import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

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
  const store = await readCommentStore();
  return (store[serviceId] || []).sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getAllServiceComments(): Promise<ServiceComment[]> {
  const store = await readCommentStore();

  return Object.values(store)
    .flat()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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
  };

  store[input.serviceId] = [comment, ...serviceComments].slice(0, 100);
  await writeCommentStore(store);

  return comment;
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
