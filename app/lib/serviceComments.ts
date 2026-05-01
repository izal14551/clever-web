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
}

type ServiceCommentStore = Record<string, ServiceComment[]>;

const COMMENTS_FILE = path.join(
  process.cwd(),
  "app",
  "data",
  "serviceComments.json",
);

export async function getServiceComments(
  serviceId: string,
): Promise<ServiceComment[]> {
  const remoteComments = await fetchRemoteComments("getServiceComments", {
    serviceId,
  });
  if (remoteComments) {
    return sortComments(remoteComments);
  }

  const store = await readCommentStore();
  return sortComments(store[serviceId] || []);
}

export async function getAllServiceComments(): Promise<ServiceComment[]> {
  const remoteComments = await fetchRemoteComments("getAllServiceComments");
  if (remoteComments) {
    return sortComments(remoteComments);
  }

  const store = await readCommentStore();

  return sortComments(Object.values(store).flat());
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
  params?: { serviceId?: string },
): Promise<ServiceComment[] | null> {
  if (!hasRemoteCommentStore()) {
    return null;
  }

  try {
    const response = await postToAppsScript(
      {
        action,
        serviceId: params?.serviceId,
      },
      { noStore: false },
    );

    return Array.isArray(response.comments)
      ? response.comments.filter(isServiceComment)
      : [];
  } catch (error) {
    if (error instanceof Error && error.message === "Unsupported action") {
      return null;
    }

    console.error("Gagal mengambil komentar service dari spreadsheet:", error);
    return null;
  }
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

  return isServiceComment(response.comment) ? response.comment : comment;
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

      store[serviceId] = comments.filter(isServiceComment);
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
      value.authorMode === "account")
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
