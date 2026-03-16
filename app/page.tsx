import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Hero } from "./components/Hero";
import { ConsultationCard } from "./components/ConsultationCard";
import { ServiceGrid } from "./components/ServiceGrid";
import { PromoCarousel } from "./components/PromoCarousel";
import { PackageCard } from "./components/PackageCard";
import { TestimonialShowcase } from "./components/TestimonialShowcase";
import { FeaturedTreatments } from "./components/FeaturedTreatments";
import { DashboardFooter } from "./components/DashboardFooter";
import { BottomNav } from "./components/BottomNav";
import { getLandingData } from "./lib/landing";

export default async function LandingPage() {
  const data = await getLandingData();

  const {
    hero,
    consultation,
    services,
    promos,
    packages,
    testimonials,
    featuredTreatments,
  } =
    data;

  return (
    <main className="max-w-md mx-auto bg-white min-h-screen pb-10 font-sans shadow-md relative">
      <section className="bg-gradient-to-b from-orange-50 to-orange-100 pt-10 pb-24 px-6 rounded-b-[40px] relative">
        <Link
          href="/search"
          className="mb-6 block rounded-2xl bg-white/90 p-2 shadow-sm backdrop-blur"
        >
          <div className="flex items-center gap-3 rounded-xl bg-[#fffaf5] px-4 py-3">
            <Search size={18} className="text-[#a68b6d]" />
            <span className="text-sm text-[#7a6a57]">
              Cari layanan, promo, atau artikel...
            </span>
          </div>
        </Link>

        <Hero data={hero} />
        <ConsultationCard data={consultation} />
      </section>

      <ServiceGrid services={services} />

      <PromoCarousel promos={promos} />


      <section className="px-6  bg-gradient-to-b from-[#ffffff] to-[##fffffe]  rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800 text-lg">Ada Paketnya Juga loh!</h2>
          <span className="text-[#a68b6d] text-[10px] font-semibold cursor-pointer hover:underline">
            Lihat Selengkapnya
          </span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar -mx-6 px-6 scroll-smooth snap-x snap-mandatory">
          {packages?.map((pkg) => (
            <PackageCard
              key={pkg.id}
              title={pkg.title}
              subtitle={pkg.subtitle}
              details={pkg.details}
              duration={pkg.duration}
              imageUrl={pkg.imageUrl}
            />
          ))}
        </div>
      </section>

      <FeaturedTreatments treatments={featuredTreatments} />
      
      <TestimonialShowcase testimonials={testimonials} />

      <DashboardFooter />

      <BottomNav />
    </main>
  );
}
