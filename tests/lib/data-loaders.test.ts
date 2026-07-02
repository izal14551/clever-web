import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAboutData } from "@/app/lib/about";
import { getHelpData } from "@/app/lib/help";
import { getLandingData } from "@/app/lib/landing";
import { getArticleBySlugOrId, getArticleList } from "@/app/lib/blogger";
import { getServiceById, getServiceListData } from "@/app/services/serviceData";
import { mockAboutData } from "@/app/data/mockAboutData";
import { mockHelpData } from "@/app/data/mockHelpData";
import { mockLandingData } from "@/app/data/mockLandingData";

describe("data loaders", () => {
  beforeEach(() => {
    vi.stubEnv("APPS_SCRIPT_URL", "");
    vi.stubEnv("BLOGGER_BLOG_ID", "");
    vi.stubEnv("BLOGGER_API_KEY", "");
  });

  it("falls back to local mocks when remote sources are not configured", async () => {
    await expect(getAboutData()).resolves.toEqual(mockAboutData);
    await expect(getHelpData()).resolves.toEqual(mockHelpData);
    await expect(getLandingData()).resolves.toEqual(mockLandingData);
    await expect(getServiceListData()).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 2,
          slug: "baby-massage-imun-booster-relaksasi",
        }),
      ]),
    );
  });

  it("normalizes fetched about/help/service payloads", async () => {
    vi.stubEnv("APPS_SCRIPT_URL", "https://script.example/exec");
    vi.stubGlobal(
      "fetch",
      vi.fn()
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              about: {
                title: "Tentang Kami",
                highlights: [{ id: "warmth", heading: "Hangat", text: "Dekat" }],
                branches: ["Bintaro"],
              },
            }),
            { status: 200 },
          ),
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              bantuan: {
                title: "Pusat Bantuan",
                faq: [{ id: "akun", title: "Akun", body: "Cara masuk" }],
              },
            }),
            { status: 200 },
          ),
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              services: [
                {
                  id: "promo-massage",
                  name: "Promo Massage",
                  details: "Nyaman",
                  durasi: "45 Menit",
                  sortOrder: 2,
                },
              ],
            }),
            { status: 200 },
          ),
        ),
    );

    await expect(getAboutData()).resolves.toMatchObject({
      heroTitle: "Tentang Kami",
      values: [expect.objectContaining({ slug: "warmth", title: "Hangat" })],
      locations: [expect.objectContaining({ name: "Bintaro" })],
    });
    await expect(getHelpData()).resolves.toMatchObject({
      heroTitle: "Pusat Bantuan",
      topics: [expect.objectContaining({ slug: "akun", title: "Akun" })],
    });
    await expect(getServiceListData()).resolves.toEqual([
      expect.objectContaining({
        id: 1,
        slug: "promo-massage",
        duration: "45 Menit",
      }),
    ]);
  });

  it("loads blogger data, strips HTML, and resolves duplicate slugs", async () => {
    vi.stubEnv("BLOGGER_BLOG_ID", "blog");
    vi.stubEnv("BLOGGER_API_KEY", "key");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            items: [
              {
                id: "1",
                title: "Tips Bayi",
                content: "<p>Konten pertama</p>",
                published: "2026-05-01T00:00:00.000Z",
              },
              {
                id: "2",
                title: "Tips Bayi",
                content: "<p>Konten kedua</p>",
                published: "2026-05-02T00:00:00.000Z",
              },
            ],
          }),
          { status: 200 },
        ),
      ),
    );

    await expect(getArticleList()).resolves.toEqual([
      expect.objectContaining({ id: "1", slug: "tips-bayi", excerpt: "Konten pertama" }),
      expect.objectContaining({ id: "2", slug: "tips-bayi-2", excerpt: "Konten kedua" }),
    ]);
  });

  it("finds services by numeric id or slug", async () => {
    await expect(getServiceById("2")).resolves.toEqual(
      expect.objectContaining({ id: 2 }),
    );
    await expect(
      getServiceById("baby-massage-imun-booster-relaksasi"),
    ).resolves.toEqual(expect.objectContaining({ id: 2 }));
  });

  it("resolves mock articles by slug when blogger is disabled", async () => {
    const articles = await getArticleList();
    await expect(getArticleBySlugOrId(articles[0].slug)).resolves.toEqual(
      expect.objectContaining({ id: articles[0].id }),
    );
  });
});
