import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getAppsScriptApiKey, getAppsScriptUrl } from "@/app/lib/appsScript";

export interface ServiceComment {
  id: string;
  serviceId: string;
  author: string;
  message: string;
  createdAt: string;
  userId?: string;
  authorMode?: "anonymous" | "account";
  likeCount: number;
  likedByCurrentUser: boolean;
}

type ServiceCommentStore = Record<string, ServiceComment[]>;
type ServiceCommentLikeStore = Record<string, string[]>;

const COMMENTS_FILE = path.join(
  process.cwd(),
  "app",
  "data",
  "serviceComments.json",
);
const COMMENT_LIKES_FILE = path.join(
  process.cwd(),
  "app",
  "data",
  "serviceCommentLikes.json",
);

export async function getServiceComments(
  serviceId: string,
  viewerUserId?: string,
): Promise<ServiceComment[]> {
  const remoteComments = await fetchRemoteComments("getServiceComments", {
    serviceId,
    viewerUserId,
  });
  if (remoteComments) {
    return sortComments(remoteComments);
  }

  const store = await readCommentStore();
  const likes = await readLikeStore();
  return sortComments(
    (store[serviceId] || []).map((comment) =>
      withLikeSummary(comment, likes, viewerUserId),
    ),
  );
}

export async function getAllServiceComments(): Promise<ServiceComment[]> {
  const remoteComments = await fetchRemoteComments("getAllServiceComments");
  if (remoteComments) {
    return sortComments(remoteComments);
  }

  const store = await readCommentStore();
  const likes = await readLikeStore();

  return sortComments(
    Object.values(store)
      .flat()
      .map((comment) => withLikeSummary(comment, likes)),
  );
}

export async function addServiceComment(input: {
  serviceId: string;
  author: string;
  message: string;
  userId?: string;
  authorMode?: "anonymous" | "account";
}): Promise<ServiceComment> {
  const store = await readCommentStore();
  const serviceComments = store[input.serviceId] || [];
  const comment: ServiceComment = {
    id: randomUUID(),
    serviceId: input.serviceId,
    author: input.author,
    message: input.message,
    createdAt: new Date().toISOString(),
    userId: input.userId,
    authorMode: input.authorMode,
    likeCount: 0,
    likedByCurrentUser: false,
  };

  const remoteComment = await addRemoteComment(comment);
  if (remoteComment) {
    return remoteComment;
  }

  if (isReadOnlyDeployment()) {
    throw new Error("Comment storage is not configured.");
  }

  store[input.serviceId] = [comment, ...serviceComments].slice(0, 100);
  await writeCommentStore(store);

  return comment;
}

export interface ServiceCommentLikeResult {
  commentId: string;
  likeCount: number;
  likedByCurrentUser: boolean;
}

export async function addServiceCommentLike(input: {
  commentId: string;
  userId: string;
}): Promise<ServiceCommentLikeResult> {
  const remoteLike = await addRemoteCommentLike(input);
  if (remoteLike) {
    return remoteLike;
  }

  if (isReadOnlyDeployment()) {
    throw new Error("Comment storage is not configured.");
  }

  const likes = await readLikeStore();
  const likedUserIds = new Set(likes[input.commentId] || []);
  likedUserIds.add(input.userId);
  likes[input.commentId] = Array.from(likedUserIds);
  await writeLikeStore(likes);

  return {
    commentId: input.commentId,
    likeCount: likes[input.commentId].length,
    likedByCurrentUser: true,
  };
}

function sortComments(comments: ServiceComment[]): ServiceComment[] {
  return comments.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function hasRemoteCommentStore() {
  const scriptUrl = getAppsScriptUrl();
  const apiKey = getAppsScriptApiKey();
  return scriptUrl.startsWith("http") && Boolean(apiKey);
}

async function fetchRemoteComments(
  action: "getServiceComments" | "getAllServiceComments",
  params?: { serviceId?: string; viewerUserId?: string },
): Promise<ServiceComment[] | null> {
  if (!hasRemoteCommentStore()) {
    return null;
  }

  try {
    const response = await postToAppsScript(
      {
        action,
        serviceId: params?.serviceId,
        viewerUserId: params?.viewerUserId,
      },
      { noStore: false },
    );

    return Array.isArray(response.comments)
      ? response.comments.filter(isServiceComment).map(normalizeServiceComment)
      : [];
  } catch (error) {
    if (error instanceof Error && error.message === "Unsupported action") {
      return null;
    }

    console.error("Gagal mengambil komentar service dari spreadsheet:", error);
    return null;
  }
}

async function addRemoteCommentLike(input: {
  commentId: string;
  userId: string;
}): Promise<ServiceCommentLikeResult | null> {
  if (!hasRemoteCommentStore()) {
    return null;
  }

  const response = await postToAppsScript(
    {
      action: "addServiceCommentLike",
      commentId: input.commentId,
      userId: input.userId,
    },
    { noStore: true },
  );

  return isServiceCommentLikeResult(response.like) ? response.like : null;
}

async function addRemoteComment(
  comment: ServiceComment,
): Promise<ServiceComment | null> {
  if (!hasRemoteCommentStore()) {
    return null;
  }

  const response = await postToAppsScript(
    {
      action: "addServiceComment",
      comment,
    },
    { noStore: true },
  );

  return isServiceComment(response.comment)
    ? normalizeServiceComment(response.comment)
    : comment;
}

async function postToAppsScript(
  payload: Record<string, unknown>,
  options: { noStore: boolean },
): Promise<Record<string, unknown>> {
  const res = await fetch(getAppsScriptUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: options.noStore ? "no-store" : "force-cache",
    body: JSON.stringify({
      apiKey: getAppsScriptApiKey(),
      ...payload,
    }),
  });

  const response = (await res.json()) as Record<string, unknown>;
  if (!res.ok || response.ok !== true) {
    throw new Error(
      typeof response.message === "string"
        ? response.message
        : "Apps Script comment request failed.",
    );
  }

  return response;
}

function isReadOnlyDeployment() {
  return process.env.NETLIFY === "true" || process.env.VERCEL === "1";
}

async function readCommentStore(): Promise<ServiceCommentStore> {
  try {
    const content = await readFile(COMMENTS_FILE, "utf8");
    const parsed: unknown = JSON.parse(content);

    if (!isRecord(parsed)) {
      return {};
    }

    const store: ServiceCommentStore = {};

    for (const [serviceId, comments] of Object.entries(parsed)) {
      if (!Array.isArray(comments)) {
        continue;
      }

      store[serviceId] = comments
        .filter(isServiceComment)
        .map(normalizeServiceComment);
    }

    return store;
  } catch {
    return {};
  }
}

async function writeCommentStore(store: ServiceCommentStore) {
  await mkdir(path.dirname(COMMENTS_FILE), { recursive: true });
  await writeFile(COMMENTS_FILE, JSON.stringify(store, null, 2), "utf8");
}

async function readLikeStore(): Promise<ServiceCommentLikeStore> {
  try {
    const content = await readFile(COMMENT_LIKES_FILE, "utf8");
    const parsed: unknown = JSON.parse(content);

    if (!isRecord(parsed)) {
      return {};
    }

    const store: ServiceCommentLikeStore = {};

    for (const [commentId, userIds] of Object.entries(parsed)) {
      if (!Array.isArray(userIds)) {
        continue;
      }

      store[commentId] = Array.from(
        new Set(userIds.filter((userId) => typeof userId === "string")),
      );
    }

    return store;
  } catch {
    return {};
  }
}

async function writeLikeStore(store: ServiceCommentLikeStore) {
  await mkdir(path.dirname(COMMENT_LIKES_FILE), { recursive: true });
  await writeFile(COMMENT_LIKES_FILE, JSON.stringify(store, null, 2), "utf8");
}

function withLikeSummary(
  comment: ServiceComment,
  likes: ServiceCommentLikeStore,
  viewerUserId?: string,
): ServiceComment {
  const likedUserIds = likes[comment.id] || [];

  return {
    ...comment,
    likeCount: likedUserIds.length,
    likedByCurrentUser: viewerUserId
      ? likedUserIds.includes(viewerUserId)
      : false,
  };
}

function normalizeServiceComment(comment: ServiceComment): ServiceComment {
  return {
    ...comment,
    likeCount:
      typeof comment.likeCount === "number" && Number.isFinite(comment.likeCount)
        ? comment.likeCount
        : 0,
    likedByCurrentUser: comment.likedByCurrentUser === true,
  };
}

function isServiceComment(value: unknown): value is ServiceComment {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.serviceId === "string" &&
    typeof value.author === "string" &&
    typeof value.message === "string" &&
    typeof value.createdAt === "string" &&
    (value.userId === undefined || typeof value.userId === "string") &&
    (value.authorMode === undefined ||
      value.authorMode === "anonymous" ||
      value.authorMode === "account") &&
    (value.likeCount === undefined || typeof value.likeCount === "number") &&
    (value.likedByCurrentUser === undefined ||
      typeof value.likedByCurrentUser === "boolean")
  );
}

function isServiceCommentLikeResult(
  value: unknown,
): value is ServiceCommentLikeResult {
  return (
    isRecord(value) &&
    typeof value.commentId === "string" &&
    typeof value.likeCount === "number" &&
    typeof value.likedByCurrentUser === "boolean"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
