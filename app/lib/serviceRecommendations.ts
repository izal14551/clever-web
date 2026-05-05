import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getAppsScriptApiKey, getAppsScriptUrl } from "@/app/lib/appsScript";

export interface ServiceRecommendationSummary {
  serviceId: string;
  recommendationCount: number;
  recommendedByCurrentUser: boolean;
}

type ServiceRecommendationStore = Record<string, string[]>;

const SERVICE_RECOMMENDATIONS_FILE = path.join(
  process.cwd(),
  "app",
  "data",
  "serviceRecommendations.json",
);

export async function getServiceRecommendation(
  serviceId: string,
  viewerUserId?: string,
): Promise<ServiceRecommendationSummary> {
  const remoteSummary = await fetchRemoteServiceRecommendation({
    serviceId,
    viewerUserId,
  });
  if (remoteSummary) {
    return remoteSummary;
  }

  const store = await readRecommendationStore();
  return buildSummary(serviceId, store, viewerUserId);
}

export async function getAllServiceRecommendations(): Promise<
  ServiceRecommendationSummary[]
> {
  const remoteSummaries = await fetchRemoteServiceRecommendations();
  if (remoteSummaries) {
    return remoteSummaries;
  }

  const store = await readRecommendationStore();
  return Object.keys(store).map((serviceId) => buildSummary(serviceId, store));
}

export async function addServiceRecommendation(input: {
  serviceId: string;
  userId: string;
}): Promise<ServiceRecommendationSummary> {
  const remoteSummary = await addRemoteServiceRecommendation(input);
  if (remoteSummary) {
    return remoteSummary;
  }

  if (isReadOnlyDeployment()) {
    throw new Error("Service recommendation storage is not configured.");
  }

  const store = await readRecommendationStore();
  const recommendedUserIds = new Set(store[input.serviceId] || []);
  recommendedUserIds.add(input.userId);
  store[input.serviceId] = Array.from(recommendedUserIds);
  await writeRecommendationStore(store);

  return buildSummary(input.serviceId, store, input.userId);
}

export async function removeServiceRecommendation(input: {
  serviceId: string;
  userId: string;
}): Promise<ServiceRecommendationSummary> {
  const remoteSummary = await removeRemoteServiceRecommendation(input);
  if (remoteSummary) {
    return remoteSummary;
  }

  if (isReadOnlyDeployment()) {
    throw new Error("Service recommendation storage is not configured.");
  }

  const store = await readRecommendationStore();
  const recommendedUserIds = new Set(store[input.serviceId] || []);
  recommendedUserIds.delete(input.userId);
  store[input.serviceId] = Array.from(recommendedUserIds);
  await writeRecommendationStore(store);

  return buildSummary(input.serviceId, store, input.userId);
}

function buildSummary(
  serviceId: string,
  store: ServiceRecommendationStore,
  viewerUserId?: string,
): ServiceRecommendationSummary {
  const userIds = store[serviceId] || [];

  return {
    serviceId,
    recommendationCount: userIds.length,
    recommendedByCurrentUser: viewerUserId ? userIds.includes(viewerUserId) : false,
  };
}

function hasRemoteRecommendationStore() {
  const scriptUrl = getAppsScriptUrl();
  const apiKey = getAppsScriptApiKey();
  return scriptUrl.startsWith("http") && Boolean(apiKey);
}

async function fetchRemoteServiceRecommendation(params: {
  serviceId: string;
  viewerUserId?: string;
}): Promise<ServiceRecommendationSummary | null> {
  if (!hasRemoteRecommendationStore()) {
    return null;
  }

  try {
    const response = await postToAppsScript(
      {
        action: "getServiceRecommendation",
        serviceId: params.serviceId,
        viewerUserId: params.viewerUserId,
      },
      { noStore: false },
    );

    return isServiceRecommendationSummary(response.recommendation)
      ? response.recommendation
      : null;
  } catch (error) {
    if (error instanceof Error && error.message === "Unsupported action") {
      return null;
    }

    console.error("Gagal mengambil rekomendasi service dari spreadsheet:", error);
    return null;
  }
}

async function fetchRemoteServiceRecommendations(): Promise<
  ServiceRecommendationSummary[] | null
> {
  if (!hasRemoteRecommendationStore()) {
    return null;
  }

  try {
    const response = await postToAppsScript(
      {
        action: "getAllServiceRecommendations",
      },
      { noStore: false },
    );

    return Array.isArray(response.recommendations)
      ? response.recommendations.filter(isServiceRecommendationSummary)
      : [];
  } catch (error) {
    if (error instanceof Error && error.message === "Unsupported action") {
      return null;
    }

    console.error("Gagal mengambil rekomendasi service dari spreadsheet:", error);
    return null;
  }
}

async function addRemoteServiceRecommendation(input: {
  serviceId: string;
  userId: string;
}): Promise<ServiceRecommendationSummary | null> {
  if (!hasRemoteRecommendationStore()) {
    return null;
  }

  try {
    const response = await postToAppsScript(
      {
        action: "addServiceRecommendation",
        serviceId: input.serviceId,
        userId: input.userId,
      },
      { noStore: true },
    );

    return isServiceRecommendationSummary(response.recommendation)
      ? response.recommendation
      : null;
  } catch (error) {
    if (error instanceof Error && error.message === "Unsupported action") {
      return null;
    }

    console.error("Gagal menyimpan rekomendasi service ke spreadsheet:", error);
    return null;
  }
}

async function removeRemoteServiceRecommendation(input: {
  serviceId: string;
  userId: string;
}): Promise<ServiceRecommendationSummary | null> {
  if (!hasRemoteRecommendationStore()) {
    return null;
  }

  try {
    const response = await postToAppsScript(
      {
        action: "removeServiceRecommendation",
        serviceId: input.serviceId,
        userId: input.userId,
      },
      { noStore: true },
    );

    return isServiceRecommendationSummary(response.recommendation)
      ? response.recommendation
      : null;
  } catch (error) {
    if (error instanceof Error && error.message === "Unsupported action") {
      return null;
    }

    console.error("Gagal menghapus rekomendasi service dari spreadsheet:", error);
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
        : "Apps Script recommendation request failed.",
    );
  }

  return response;
}

function isReadOnlyDeployment() {
  return process.env.NETLIFY === "true" || process.env.VERCEL === "1";
}

async function readRecommendationStore(): Promise<ServiceRecommendationStore> {
  try {
    const content = await readFile(SERVICE_RECOMMENDATIONS_FILE, "utf8");
    const parsed: unknown = JSON.parse(content);

    if (!isRecord(parsed)) {
      return {};
    }

    const store: ServiceRecommendationStore = {};

    for (const [serviceId, userIds] of Object.entries(parsed)) {
      if (!Array.isArray(userIds)) {
        continue;
      }

      store[serviceId] = Array.from(
        new Set(userIds.filter((userId) => typeof userId === "string")),
      );
    }

    return store;
  } catch {
    return {};
  }
}

async function writeRecommendationStore(store: ServiceRecommendationStore) {
  await mkdir(path.dirname(SERVICE_RECOMMENDATIONS_FILE), { recursive: true });
  await writeFile(
    SERVICE_RECOMMENDATIONS_FILE,
    JSON.stringify(store, null, 2),
    "utf8",
  );
}

function isServiceRecommendationSummary(
  value: unknown,
): value is ServiceRecommendationSummary {
  return (
    isRecord(value) &&
    typeof value.serviceId === "string" &&
    typeof value.recommendationCount === "number" &&
    typeof value.recommendedByCurrentUser === "boolean"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
