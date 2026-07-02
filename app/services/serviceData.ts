import { mockServiceListData } from "../data/mockServiceListData";
import { buildAppsScriptUrl } from "../lib/appsScript";
import type { ServiceListItemData } from "../types/landing";
import {
  normalizeNumericId,
  normalizeSortOrder,
  normalizeSlug,
  toPositiveInteger,
  toStringValue,
} from "../utils/dataIdentity";
import { getDirectImageUrl } from "../utils/imageUtils";
import { createSlug } from "../utils/slug";

export async function getServiceListData(): Promise<ServiceListItemData[]> {
  try {
    const scriptUrl = buildAppsScriptUrl();

    if (!scriptUrl) {
      return normalizeServiceSlugs(mockServiceListData);
    }

    const res = await fetch(scriptUrl, {
      redirect: "follow",
      next: {
        revalidate: 900,
      },
    });

    if (!res.ok) {
      return normalizeServiceSlugs(mockServiceListData);
    }

    const payload: unknown = await res.json();
    if (!isRecord(payload)) {
      return normalizeServiceSlugs(mockServiceListData);
    }

    const sourceList =
      getArray(payload, "serviceList") ||
      getArray(payload, "service_list") ||
      getArray(payload, "services");

    if (!sourceList || sourceList.length === 0) {
      return normalizeServiceSlugs(mockServiceListData);
    }

    const normalized = sourceList
      .map((item, index) => normalizeServiceItem(item, index))
      .filter((item): item is ServiceListItemData => item !== null);

    return normalized.length > 0
      ? normalizeServiceSlugs(normalized)
      : normalizeServiceSlugs(mockServiceListData);
  } catch (error) {
    console.error("Gagal mengambil data halaman services:", error);
    return normalizeServiceSlugs(mockServiceListData);
  }
}

export async function getServiceById(
  id: string,
): Promise<ServiceListItemData | null> {
  const services = await getServiceListData();
  return (
    services.find(
      (service) => String(service.id) === id || service.slug === id,
    ) || null
  );
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
    getDirectImageUrl(
      toStringValue(item.imageUrl) || toStringValue(item.iconUrl),
    ) || undefined;

  const id = normalizeNumericId(item.id, index + 1);
  const legacySlug = toPositiveInteger(item.id) ? "" : toStringValue(item.id);

  const recommendationCount =
    toPositiveInteger(item.recommendationCount) ||
    toPositiveInteger(item.recommendations) ||
    toPositiveInteger(item.likes) ||
    toPositiveInteger(item.initialRecommendations) ||
    0;

  return {
    id,
    slug: normalizeSlug(
      toStringValue(item.slug) || legacySlug,
      title,
      `service-${id}`,
    ),
    title,
    category:
      toStringValue(item.category) ||
      toStringValue(item.group) ||
      toStringValue(item.section) ||
      undefined,
    description,
    duration,
    imageUrl,
    recommendationCount,
    sortOrder: normalizeSortOrder(item.sortOrder, index + 1),
  };
}

function normalizeServiceSlugs(
  services: ServiceListItemData[],
): ServiceListItemData[] {
  const slugCounts = new Map<string, number>();

  return services
    .map((service) => {
      const baseSlug =
        service.slug || createSlug(service.title, `service-${service.id}`);
      const count = slugCounts.get(baseSlug) || 0;
      slugCounts.set(baseSlug, count + 1);

      return {
        ...service,
        slug: count === 0 ? baseSlug : `${baseSlug}-${count + 1}`,
      };
    })
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
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
