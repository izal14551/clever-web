import { mockServiceListData } from "../data/mockServiceListData";
import { buildAppsScriptUrl } from "../lib/appsScript";
import type { ServiceListItemData } from "../types/landing";
import { getDirectImageUrl } from "../utils/imageUtils";

export async function getServiceListData(): Promise<ServiceListItemData[]> {
  try {
    const scriptUrl = buildAppsScriptUrl();

    if (!scriptUrl) {
      return mockServiceListData;
    }

    const res = await fetch(scriptUrl, {
      redirect: "follow",
      next: {
        revalidate: 900,
      },
    });

    if (!res.ok) {
      return mockServiceListData;
    }

    const payload: unknown = await res.json();
    if (!isRecord(payload)) {
      return mockServiceListData;
    }

    const sourceList =
      getArray(payload, "serviceList") ||
      getArray(payload, "service_list") ||
      getArray(payload, "services");

    if (!sourceList || sourceList.length === 0) {
      return mockServiceListData;
    }

    const normalized = sourceList
      .map((item, index) => normalizeServiceItem(item, index))
      .filter((item): item is ServiceListItemData => item !== null);

    return normalized.length > 0 ? normalized : mockServiceListData;
  } catch (error) {
    console.error("Gagal mengambil data halaman services:", error);
    return mockServiceListData;
  }
}

export async function getServiceById(
  id: string,
): Promise<ServiceListItemData | null> {
  const services = await getServiceListData();
  return services.find((service) => service.id === id) || null;
}

function normalizeServiceItem(
  item: unknown,
  index: number,
): ServiceListItemData | null {
  if (!isRecord(item)) {
    return null;
  }

  const title =
    toStringValue(item.title) ||
    toStringValue(item.label) ||
    toStringValue(item.name) ||
    "Layanan Clevermom";

  const description =
    toStringValue(item.description) ||
    toStringValue(item.subtitle) ||
    toStringValue(item.details) ||
    "Deskripsi layanan belum tersedia.";

  const duration =
    toStringValue(item.duration) ||
    toStringValue(item.estimateDuration) ||
    toStringValue(item.durasi) ||
    "-";

  const imageUrl =
    getDirectImageUrl(toStringValue(item.imageUrl) || toStringValue(item.iconUrl)) ||
    undefined;

  return {
    id: toStringValue(item.id) || `svc-${index + 1}`,
    title,
    category:
      toStringValue(item.category) ||
      toStringValue(item.group) ||
      toStringValue(item.section) ||
      undefined,
    description,
    duration,
    imageUrl,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getArray(
  source: Record<string, unknown>,
  key: string,
): unknown[] | undefined {
  const value = source[key];
  return Array.isArray(value) ? value : undefined;
}

function toStringValue(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean)
      .join(". ");
  }

  return "";
}
