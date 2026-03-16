import { mockHelpData } from "@/app/data/mockHelpData";
import { buildAppsScriptUrl } from "@/app/lib/appsScript";
import type { HelpPageData, HelpTopic } from "@/app/types/help";

export async function getHelpData(): Promise<HelpPageData> {
  const helpScriptUrl = buildAppsScriptUrl();

  if (!helpScriptUrl) {
    return mockHelpData;
  }

  try {
    const res = await fetch(helpScriptUrl, { cache: "no-store", redirect: "follow" });
    if (!res.ok) {
      return mockHelpData;
    }

    const payload: unknown = await res.json();
    return normalizeHelpData(payload);
  } catch {
    return mockHelpData;
  }
}

function normalizeHelpData(input: unknown): HelpPageData {
  if (!isRecord(input)) {
    return mockHelpData;
  }

  const helpSource =
    getRecord(input, "help") ??
    getRecord(input, "bantuan") ??
    getRecord(input, "support") ??
    input;

  const topicsSource =
    getArray(helpSource, "topics") ||
    getArray(helpSource, "items") ||
    getArray(helpSource, "helpTopics") ||
    getArray(helpSource, "bantuanItems") ||
    getArray(helpSource, "faq");

  const topics = (topicsSource || mockHelpData.topics)
    .map((item, index) => normalizeTopic(item, index))
    .filter((item): item is HelpTopic => item !== null);

  return {
    heroTitle:
      toStringValue(helpSource.heroTitle) ||
      toStringValue(helpSource.title) ||
      mockHelpData.heroTitle,
    heroDescription:
      toStringValue(helpSource.heroDescription) ||
      toStringValue(helpSource.description) ||
      mockHelpData.heroDescription,
    topics: topics.length > 0 ? topics : mockHelpData.topics,
    contactTitle:
      toStringValue(helpSource.contactTitle) ||
      toStringValue(helpSource.ctaTitle) ||
      mockHelpData.contactTitle,
    contactDescription:
      toStringValue(helpSource.contactDescription) ||
      toStringValue(helpSource.ctaDescription) ||
      mockHelpData.contactDescription,
    contactButtonLabel:
      toStringValue(helpSource.contactButtonLabel) ||
      toStringValue(helpSource.ctaButtonLabel) ||
      mockHelpData.contactButtonLabel,
    whatsappNumber:
      toStringValue(helpSource.whatsappNumber) ||
      toStringValue(helpSource.whatsapp) ||
      toStringValue(helpSource.contactWhatsapp) ||
      mockHelpData.whatsappNumber,
  };
}

function normalizeTopic(item: unknown, index: number): HelpTopic | null {
  if (!isRecord(item)) {
    return null;
  }

  const title =
    toStringValue(item.title) ||
    toStringValue(item.heading) ||
    toStringValue(item.name) ||
    `Topik ${index + 1}`;
  const description =
    toStringValue(item.description) ||
    toStringValue(item.text) ||
    toStringValue(item.body);

  if (!description) {
    return null;
  }

  return {
    id: toStringValue(item.id) || `help-${index + 1}`,
    title,
    description,
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
