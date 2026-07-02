import { describe, expect, it, vi } from "vitest";
import {
  normalizeNumericId,
  normalizeSlug,
  normalizeSortOrder,
  toPositiveInteger,
  toStringValue,
} from "@/app/utils/dataIdentity";
import { getDirectImageUrl } from "@/app/utils/imageUtils";
import { createSlug } from "@/app/utils/slug";
import { formatCommentTimeAgo } from "@/app/lib/commentTime";

describe("core utilities", () => {
  it("normalizes ids, sort order, and text values", () => {
    expect(toPositiveInteger(" 12 ")).toBe(12);
    expect(toPositiveInteger(-1)).toBeUndefined();
    expect(normalizeNumericId(undefined, 7)).toBe(7);
    expect(normalizeSortOrder("3", 1)).toBe(3);
    expect(toStringValue(["Halo", " Mom ", 3])).toBe("Halo. Mom");
  });

  it("creates stable slugs with accents removed and fallbacks", () => {
    expect(createSlug("Pijat Bayi Élégant")).toBe("pijat-bayi-elegant");
    expect(createSlug("!!!", "fallback")).toBe("fallback");
    expect(normalizeSlug("", "Nama Layanan", "service-1")).toBe("nama-layanan");
  });

  it("converts supported Google Drive links into direct image URLs", () => {
    expect(
      getDirectImageUrl("https://drive.google.com/file/d/abc_123/view?usp=sharing"),
    ).toBe("https://drive.google.com/uc?export=view&id=abc_123");
    expect(getDirectImageUrl("https://example.com/a.png")).toBe(
      "https://example.com/a.png",
    );
  });

  it("formats comment timestamps in Indonesian", () => {
    vi.spyOn(Date, "now").mockReturnValue(new Date("2026-05-15T10:00:00.000Z").getTime());

    expect(formatCommentTimeAgo("2026-05-15T09:59:30.000Z")).toBe("Baru saja");
    expect(formatCommentTimeAgo("2026-05-15T09:45:00.000Z")).toBe("15 menit lalu");
    expect(formatCommentTimeAgo("2026-05-15T08:00:00.000Z")).toBe("2 jam lalu");
    expect(formatCommentTimeAgo("2026-05-13T10:00:00.000Z")).toBe("2 hari lalu");
  });
});
