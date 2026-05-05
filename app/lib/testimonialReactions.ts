import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getAppsScriptApiKey, getAppsScriptUrl } from "@/app/lib/appsScript";

export interface TestimonialReactionSummary {
  testimonialId: string;
  reactionCount: number;
  reactedByCurrentUser: boolean;
}

type TestimonialReactionStore = Record<string, string[]>;

const TESTIMONIAL_REACTIONS_FILE = path.join(
  process.cwd(),
  "app",
  "data",
  "testimonialReactions.json",
);

export async function getTestimonialReaction(
  testimonialId: string,
  viewerUserId?: string,
): Promise<TestimonialReactionSummary> {
  const remoteSummary = await fetchRemoteTestimonialReaction({
    testimonialId,
    viewerUserId,
  });
  if (remoteSummary) {
    return remoteSummary;
  }

  const store = await readReactionStore();
  return buildSummary(testimonialId, store, viewerUserId);
}

export async function addTestimonialReaction(input: {
  testimonialId: string;
  userId: string;
}): Promise<TestimonialReactionSummary> {
  const remoteSummary = await addRemoteTestimonialReaction(input);
  if (remoteSummary) {
    return remoteSummary;
  }

  if (isReadOnlyDeployment()) {
    throw new Error("Testimonial reaction storage is not configured.");
  }

  const store = await readReactionStore();
  const reactedUserIds = new Set(store[input.testimonialId] || []);
  reactedUserIds.add(input.userId);
  store[input.testimonialId] = Array.from(reactedUserIds);
  await writeReactionStore(store);

  return buildSummary(input.testimonialId, store, input.userId);
}

export async function removeTestimonialReaction(input: {
  testimonialId: string;
  userId: string;
}): Promise<TestimonialReactionSummary> {
  const remoteSummary = await removeRemoteTestimonialReaction(input);
  if (remoteSummary) {
    return remoteSummary;
  }

  if (isReadOnlyDeployment()) {
    throw new Error("Testimonial reaction storage is not configured.");
  }

  const store = await readReactionStore();
  const reactedUserIds = new Set(store[input.testimonialId] || []);
  reactedUserIds.delete(input.userId);
  store[input.testimonialId] = Array.from(reactedUserIds);
  await writeReactionStore(store);

  return buildSummary(input.testimonialId, store, input.userId);
}

function buildSummary(
  testimonialId: string,
  store: TestimonialReactionStore,
  viewerUserId?: string,
): TestimonialReactionSummary {
  const userIds = store[testimonialId] || [];

  return {
    testimonialId,
    reactionCount: userIds.length,
    reactedByCurrentUser: viewerUserId ? userIds.includes(viewerUserId) : false,
  };
}

function hasRemoteReactionStore() {
  const scriptUrl = getAppsScriptUrl();
  const apiKey = getAppsScriptApiKey();
  return scriptUrl.startsWith("http") && Boolean(apiKey);
}

async function fetchRemoteTestimonialReaction(params: {
  testimonialId: string;
  viewerUserId?: string;
}): Promise<TestimonialReactionSummary | null> {
  if (!hasRemoteReactionStore()) {
    return null;
  }

  try {
    const response = await postToAppsScript(
      {
        action: "getTestimonialReaction",
        testimonialId: params.testimonialId,
        viewerUserId: params.viewerUserId,
      },
      { noStore: true },
    );

    return isTestimonialReactionSummary(response.reaction)
      ? response.reaction
      : null;
  } catch (error) {
    if (error instanceof Error && error.message === "Unsupported action") {
      return null;
    }

    console.error("Gagal mengambil reaksi testimonial dari spreadsheet:", error);
    return null;
  }
}

async function addRemoteTestimonialReaction(input: {
  testimonialId: string;
  userId: string;
}): Promise<TestimonialReactionSummary | null> {
  if (!hasRemoteReactionStore()) {
    return null;
  }

  try {
    const response = await postToAppsScript(
      {
        action: "addTestimonialReaction",
        testimonialId: input.testimonialId,
        userId: input.userId,
      },
      { noStore: true },
    );

    return isTestimonialReactionSummary(response.reaction)
      ? response.reaction
      : null;
  } catch (error) {
    if (error instanceof Error && error.message === "Unsupported action") {
      return null;
    }

    console.error("Gagal menyimpan reaksi testimonial ke spreadsheet:", error);
    return null;
  }
}

async function removeRemoteTestimonialReaction(input: {
  testimonialId: string;
  userId: string;
}): Promise<TestimonialReactionSummary | null> {
  if (!hasRemoteReactionStore()) {
    return null;
  }

  try {
    const response = await postToAppsScript(
      {
        action: "removeTestimonialReaction",
        testimonialId: input.testimonialId,
        userId: input.userId,
      },
      { noStore: true },
    );

    return isTestimonialReactionSummary(response.reaction)
      ? response.reaction
      : null;
  } catch (error) {
    if (error instanceof Error && error.message === "Unsupported action") {
      return null;
    }

    console.error("Gagal menghapus reaksi testimonial dari spreadsheet:", error);
    return null;
  }
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
        : "Apps Script testimonial reaction request failed.",
    );
  }

  return response;
}

function isReadOnlyDeployment() {
  return process.env.NETLIFY === "true" || process.env.VERCEL === "1";
}

async function readReactionStore(): Promise<TestimonialReactionStore> {
  try {
    const content = await readFile(TESTIMONIAL_REACTIONS_FILE, "utf8");
    const parsed: unknown = JSON.parse(content);

    if (!isRecord(parsed)) {
      return {};
    }

    const store: TestimonialReactionStore = {};

    for (const [testimonialId, userIds] of Object.entries(parsed)) {
      if (!Array.isArray(userIds)) {
        continue;
      }

      store[testimonialId] = Array.from(
        new Set(userIds.filter((userId) => typeof userId === "string")),
      );
    }

    return store;
  } catch {
    return {};
  }
}

async function writeReactionStore(store: TestimonialReactionStore) {
  await mkdir(path.dirname(TESTIMONIAL_REACTIONS_FILE), { recursive: true });
  await writeFile(
    TESTIMONIAL_REACTIONS_FILE,
    JSON.stringify(store, null, 2),
    "utf8",
  );
}

function isTestimonialReactionSummary(
  value: unknown,
): value is TestimonialReactionSummary {
  return (
    isRecord(value) &&
    typeof value.testimonialId === "string" &&
    typeof value.reactionCount === "number" &&
    typeof value.reactedByCurrentUser === "boolean"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
