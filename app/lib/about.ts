import { buildAppsScriptUrl } from "@/app/lib/appsScript";
import { mockAboutData } from "@/app/data/mockAboutData";
import type { AboutPageData, AboutValue, BranchLocation } from "@/app/types/about";

export async function getAboutData(): Promise<AboutPageData> {
  const aboutScriptUrl = buildAppsScriptUrl();

  if (!aboutScriptUrl) {
    return mockAboutData;
  }

  try {
    const res = await fetch(aboutScriptUrl, { cache: "no-store", redirect: "follow" });
    if (!res.ok) {
      return mockAboutData;
    }

    const payload: unknown = await res.json();
    return normalizeAboutData(payload);
  } catch {
    return mockAboutData;
  }
}

function normalizeAboutData(input: unknown): AboutPageData {
  if (!isRecord(input)) {
    return mockAboutData;
  }

  const aboutSource = getRecord(input, "about") ?? input;
  const valuesSource =
    getArray(aboutSource, "values") ||
    getArray(aboutSource, "highlights") ||
    getArray(aboutSource, "aboutValues");

  const locationsSource =
    getArray(aboutSource, "locations") ||
    getArray(aboutSource, "branches") ||
    getArray(aboutSource, "branchLocations") ||
    getArray(aboutSource, "cabang") ||
    getArray(aboutSource, "lokasi");

  const values = (valuesSource || mockAboutData.values)
    .map((item, index) => normalizeValue(item, index))
    .filter((item): item is AboutValue => item !== null)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const locations = (locationsSource || mockAboutData.locations)
    .map((item, index) => normalizeLocation(item, index))
    .filter((item): item is BranchLocation => item !== null)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return {
    heroTitle:
      toStringValue(aboutSource.heroTitle) ||
      toStringValue(aboutSource.title) ||
      mockAboutData.heroTitle,
    heroDescription:
      toStringValue(aboutSource.heroDescription) ||
      toStringValue(aboutSource.description) ||
      mockAboutData.heroDescription,
    values: values.length > 0 ? values : mockAboutData.values,
    locations,
  };
}

function normalizeValue(item: unknown, index: number): AboutValue | null {
  if (!isRecord(item)) {
    return null;
  }

  const title =
    toStringValue(item.title) ||
    toStringValue(item.heading) ||
    `Nilai ${index + 1}`;
  const description =
    toStringValue(item.description) ||
    toStringValue(item.text) ||
    toStringValue(item.body);

  if (!description) {
    return null;
  }

  const id = toIntegerValue(item.id);
  const legacySlug = typeof item.id === "string" ? item.id.trim() : "";

  return {
    id,
    slug:
      toStringValue(item.slug) ||
      toStringValue(item.valueSlug) ||
      (id ? undefined : legacySlug) ||
      undefined,
    title,
    description,
    sortOrder: toIntegerValue(item.sortOrder) || index + 1,
  };
}

function normalizeLocation(item: unknown, index: number): BranchLocation | null {
  if (typeof item === "string") {
    const value = item.trim();
    if (!value) {
      return null;
    }

    return {
      id: index + 1,
      slug: `branch-${index + 1}`,
      name: value,
      sortOrder: index + 1,
    };
  }

  if (!isRecord(item)) {
    return null;
  }

  const name =
    toStringValue(item.name) ||
    toStringValue(item.title) ||
    toStringValue(item.branchName) ||
    toStringValue(item.cabang) ||
    toStringValue(item.lokasi);

  const address =
    toStringValue(item.address) ||
    toStringValue(item.alamat) ||
    toStringValue(item.city) ||
    toStringValue(item.kota);
  const mapUrl =
    toStringValue(item.mapUrl) ||
    toStringValue(item.mapsUrl) ||
    toStringValue(item.googleMapsUrl) ||
    toStringValue(item.link) ||
    toStringValue(item.url);

  if (!name && !address) {
    return null;
  }

  const id = toIntegerValue(item.id) || index + 1;
  const legacySlug = typeof item.id === "string" ? item.id.trim() : "";
  const slug =
    toStringValue(item.slug) ||
    toStringValue(item.branchSlug) ||
    toStringValue(item.cabangSlug) ||
    (toIntegerValue(item.id) ? "" : legacySlug);

  return {
    id,
    slug: slug || undefined,
    name: name || address,
    address: name && address && name !== address ? address : undefined,
    mapUrl: mapUrl || undefined,
    sortOrder: toIntegerValue(item.sortOrder) || index + 1,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getRecord(
  source: Record<string, unknown>,
  key: string,
): Record<string, unknown> | undefined {
  const value = source[key];
  return isRecord(value) ? value : undefined;
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

  return "";
}

function toIntegerValue(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^\d+$/.test(trimmed)) {
      return Number(trimmed);
    }
  }

  return undefined;
}
