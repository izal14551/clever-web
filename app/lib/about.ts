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
    .filter((item): item is AboutValue => item !== null);

  const locations = (locationsSource || mockAboutData.locations)
    .map((item, index) => normalizeLocation(item, index))
    .filter((item): item is BranchLocation => item !== null);

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

  return { title, description };
}

function normalizeLocation(item: unknown, index: number): BranchLocation | null {
  if (typeof item === "string") {
    const value = item.trim();
    if (!value) {
      return null;
    }

    return {
      id: `branch-${index + 1}`,
      name: value,
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

  return {
    id: toStringValue(item.id) || `branch-${index + 1}`,
    name: name || address,
    address: name && address && name !== address ? address : undefined,
    mapUrl: mapUrl || undefined,
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
