import { createSlug } from "./slug";

export function toPositiveInteger(value: unknown): number | undefined {
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

export function normalizeNumericId(value: unknown, fallback: number): number {
  return toPositiveInteger(value) || fallback;
}

export function normalizeSortOrder(value: unknown, fallback: number): number {
  return toPositiveInteger(value) || fallback;
}

export function normalizeSlug(
  explicitSlug: unknown,
  source: string,
  fallback: string,
): string {
  return createSlug(toStringValue(explicitSlug) || source, fallback);
}

export function toStringValue(value: unknown): string {
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
