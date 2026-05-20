import { mockLandingData } from "@/app/data/mockLandingData";
import { buildAppsScriptUrl } from "@/app/lib/appsScript";
import type {
  LandingPageData,
  PackageData,
  PromoData,
  ServiceData,
  TestimonialData,
  TreatmentData,
} from "@/app/types/landing";
import {
  normalizeNumericId,
  normalizeSortOrder,
  normalizeSlug,
  toPositiveInteger,
  toStringValue,
} from "@/app/utils/dataIdentity";
import { getDirectImageUrl } from "@/app/utils/imageUtils";

export async function getLandingData(): Promise<LandingPageData> {
  try {
    const scriptUrl = buildAppsScriptUrl();

    if (!scriptUrl) {
      console.warn(
        "URL Apps Script belum diubah. Menggunakan mock data lokal.",
      );
      return mockLandingData;
    }

    const res = await fetch(scriptUrl, {
      redirect: "follow",
      next: {
        revalidate: 60,
      },
    });

    if (!res.ok) {
      console.error("Gagal mendapat response data dari Google Sheets");
      return mockLandingData;
    }

    const fetchedData: Partial<LandingPageData> = await res.json();

    return {
      hero: {
        ...mockLandingData.hero,
        ...(fetchedData.hero || {}),
        logoUrl:
          getDirectImageUrl(fetchedData.hero?.logoUrl) ||
          mockLandingData.hero.logoUrl,
      },
      consultation: {
        ...mockLandingData.consultation,
        ...(fetchedData.consultation || {}),
      },
      services: normalizeServices(fetchedData.services),
      promos: normalizePromos(fetchedData.promos),
      packages: normalizePackages(fetchedData.packages),
      testimonials: normalizeTestimonials(fetchedData.testimonials),
      featuredTreatments: normalizeTreatments(fetchedData.featuredTreatments),
    };
  } catch (error) {
    console.error("Terjadi kesalahan saat fetch data Apps Script:", error);
    return mockLandingData;
  }
}

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  "baby treatment": "/icon_treatment/Baby_Treatment.png",
  "toddler treatment": "/icon_treatment/Toddler_Treatment.png",
  "kids treatment": "/icon_treatment/Kids_Treatment.png",
};

function getCategoryFallbackImage(categoryName?: string): string | undefined {
  if (!categoryName) return undefined;
  const key = categoryName.toLowerCase().trim();
  for (const [fallbackKey, url] of Object.entries(CATEGORY_FALLBACK_IMAGES)) {
    if (key.includes(fallbackKey)) {
      return url;
    }
  }
  return undefined;
}

function normalizeServices(source?: ServiceData[]): ServiceData[] {
  const services =
    source && source.length > 0 ? source : mockLandingData.services;

  return services
    .map((service, index) => {
      const item = service as unknown as Record<string, unknown>;
      const id = normalizeNumericId(item.id, index + 1);
      const label =
        toStringValue(item.label) || toStringValue(item.title) || "Layanan";
      const category = toStringValue(item.category) || undefined;
      const rawIconUrl =
        getDirectImageUrl(toStringValue(item.iconUrl)) || undefined;

      return {
        id,
        slug: normalizeSlug(
          item.slug,
          category || label,
          `service-category-${id}`,
        ),
        label,
        category,
        iconUrl: rawIconUrl || getCategoryFallbackImage(category || label),
        sortOrder: normalizeSortOrder(item.sortOrder, index + 1),
      };
    })
    .sort(sortBySortOrder);
}

function normalizePromos(source?: PromoData[]): PromoData[] {
  const promos = source && source.length > 0 ? source : mockLandingData.promos;

  return promos
    .map((promo, index) => {
      const item = promo as unknown as Record<string, unknown>;
      const id = normalizeNumericId(item.id, index + 1);
      const title = toStringValue(item.title);

      return {
        id,
        slug: normalizeSlug(item.slug, title || `promo-${id}`, `promo-${id}`),
        title: title || undefined,
        imageUrl: getDirectImageUrl(toStringValue(item.imageUrl)) || undefined,
        link: toStringValue(item.link) || undefined,
        sortOrder: normalizeSortOrder(item.sortOrder, index + 1),
      };
    })
    .sort(sortBySortOrder);
}

function normalizePackages(source?: PackageData[]): PackageData[] {
  const packages =
    source && source.length > 0 ? source : mockLandingData.packages;

  return packages
    .map((pkg, index) => {
      const item = pkg as unknown as Record<string, unknown>;
      const id = normalizeNumericId(item.id, index + 1);
      const title = toStringValue(item.title) || `Paket ${id}`;
      const details = Array.isArray(item.details)
        ? item.details.map(toStringValue).filter(Boolean)
        : toStringValue(item.details)
            .split("|")
            .map((detail) => detail.trim())
            .filter(Boolean);

      return {
        id,
        slug: normalizeSlug(item.slug, title, `package-${id}`),
        title,
        subtitle: toStringValue(item.subtitle),
        details,
        duration: toStringValue(item.duration) || "-",
        imageUrl: getDirectImageUrl(toStringValue(item.imageUrl)) || undefined,
        sortOrder: normalizeSortOrder(item.sortOrder, index + 1),
      };
    })
    .sort(sortBySortOrder);
}

function normalizeTestimonials(source?: TestimonialData[]): TestimonialData[] {
  const testimonials =
    source && source.length > 0 ? source : mockLandingData.testimonials;

  return testimonials
    .map((testimonial, index) => {
      const item = testimonial as unknown as Record<string, unknown>;
      const id = normalizeNumericId(item.id, index + 1);
      const title = toStringValue(item.title) || `Testimonial ${id}`;

      return {
        id,
        slug: normalizeSlug(item.slug, title, `testimonial-${id}`),
        serviceId:
          toPositiveInteger(item.serviceId) ||
          toPositiveInteger(item.service_id) ||
          undefined,
        serviceSlug:
          toStringValue(item.serviceSlug) ||
          toStringValue(item.service_slug) ||
          undefined,
        author: toStringValue(item.author) || "Mom CleverMom",
        timeAgo:
          toStringValue(item.timeAgo) || toStringValue(item.time_ago) || "",
        category: toStringValue(item.category) || "Layanan CleverMom",
        title,
        message: toStringValue(item.message),
        reactionCount: toPositiveInteger(item.reactionCount) || 0,
        ctaLabel: toStringValue(item.ctaLabel) || "Bantu Mom lain",
        sortOrder: normalizeSortOrder(item.sortOrder, index + 1),
      };
    })
    .sort(sortBySortOrder);
}

function normalizeTreatments(source?: TreatmentData[]): TreatmentData[] {
  const treatments =
    source && source.length > 0 ? source : mockLandingData.featuredTreatments;

  return treatments
    .map((treatment, index) => {
      const item = treatment as unknown as Record<string, unknown>;
      const id = normalizeNumericId(item.id, index + 1);
      const name =
        toStringValue(item.name) ||
        toStringValue(item.title) ||
        `Treatment ${id}`;

      return {
        id,
        slug: normalizeSlug(item.slug, name, `treatment-${id}`),
        name,
        description: toStringValue(item.description),
        imageUrl: getDirectImageUrl(toStringValue(item.imageUrl)) || undefined,
        href: toStringValue(item.href) || undefined,
        recommendationCount: toPositiveInteger(item.recommendationCount) || 0,
        sortOrder: normalizeSortOrder(item.sortOrder, index + 1),
      };
    })
    .sort(sortBySortOrder);
}

function sortBySortOrder<T extends { sortOrder?: number }>(a: T, b: T) {
  return (a.sortOrder || 0) - (b.sortOrder || 0);
}
