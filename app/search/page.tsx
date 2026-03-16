import { Suspense } from "react";
import { BottomNav } from "@/app/components/BottomNav";
import { SearchExperience } from "@/app/components/SearchExperience";
import { getLandingData } from "@/app/lib/landing";
import { getArticleList } from "@/app/lib/blogger";
import { getServiceListData } from "@/app/services/serviceData";

export default async function SearchPage() {
  const [landingData, services, articles] = await Promise.all([
    getLandingData(),
    getServiceListData(),
    getArticleList(),
  ]);

  const searchItems = [
    ...services.map((service) => ({
      id: `service-${service.id}`,
      title: service.title,
      description: service.description,
      href: `/services/${service.id}`,
      type: "service" as const,
      badge: service.duration,
    })),
    ...articles.map((article) => ({
      id: `article-${article.id}`,
      title: article.title,
      description: article.excerpt,
      href: `/artikel/${article.id}`,
      type: "article" as const,
      badge: "Artikel terbaru",
    })),
    ...landingData.packages.map((pkg) => ({
      id: `package-${pkg.id}`,
      title: pkg.title,
      description: pkg.details.join(". "),
      href: "/services",
      type: "package" as const,
      badge: pkg.duration,
    })),
    ...landingData.testimonials.map((testimonial) => ({
      id: `testimonial-${testimonial.id}`,
      title: testimonial.title,
      description: testimonial.message,
      href: "/testimonial",
      type: "testimonial" as const,
      badge: testimonial.category,
    })),
    ...landingData.promos.map((promo, index) => ({
      id: `promo-${promo.id}`,
      title: promo.title || `Promo spesial CleverMom ${index + 1}`,
      description:
        "Penawaran pilihan untuk layanan ibu dan bayi yang dapat Mom lihat langsung di halaman promo.",
      href: "/promo",
      type: "promo" as const,
      badge: "Promo aktif",
    })),
  ];

  const categories = [
    { label: "Layanan", href: "/services" },
    { label: "Artikel", href: "/artikel" },
    { label: "Promo", href: "/promo" },
    { label: "Testimonial", href: "/testimonial" },
  ];

  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-24 font-sans shadow-md">
      <Suspense fallback={<div className="px-6 py-8 text-sm text-[#8b7763]">Memuat pencarian...</div>}>
        <SearchExperience items={searchItems} categories={categories} />
      </Suspense>
      <BottomNav />
    </main>
  );
}
