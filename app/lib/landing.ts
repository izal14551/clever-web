import { mockLandingData } from "@/app/data/mockLandingData";
import { buildAppsScriptUrl } from "@/app/lib/appsScript";
import type { LandingPageData } from "@/app/types/landing";
import { getDirectImageUrl } from "@/app/utils/imageUtils";

export async function getLandingData(): Promise<LandingPageData> {
  try {
    const scriptUrl = buildAppsScriptUrl();

    if (!scriptUrl) {
      console.warn("URL Apps Script belum diubah. Menggunakan mock data lokal.");
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
      services: (fetchedData.services && fetchedData.services.length > 0
        ? fetchedData.services
        : mockLandingData.services
      ).map((service) => ({
        ...service,
        iconUrl: getDirectImageUrl(service.iconUrl),
      })),
      promos: (fetchedData.promos && fetchedData.promos.length > 0
        ? fetchedData.promos
        : mockLandingData.promos
      ).map((promo) => ({
        ...promo,
        imageUrl: getDirectImageUrl(promo.imageUrl),
      })),
      packages: (fetchedData.packages && fetchedData.packages.length > 0
        ? fetchedData.packages
        : mockLandingData.packages
      ).map((pkg) => ({
        ...pkg,
        imageUrl: getDirectImageUrl(pkg.imageUrl),
      })),
      testimonials: fetchedData.testimonials && fetchedData.testimonials.length > 0
        ? fetchedData.testimonials
        : mockLandingData.testimonials,
      featuredTreatments: (fetchedData.featuredTreatments &&
      fetchedData.featuredTreatments.length > 0
        ? fetchedData.featuredTreatments
        : mockLandingData.featuredTreatments
      ).map((treatment) => ({
        ...treatment,
        imageUrl: getDirectImageUrl(treatment.imageUrl),
      })),
    };
  } catch (error) {
    console.error("Terjadi kesalahan saat fetch data Apps Script:", error);
    return mockLandingData;
  }
}
