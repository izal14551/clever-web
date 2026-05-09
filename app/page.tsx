import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { getServerSession } from "next-auth";
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
import { formatCommentTimeAgo } from "./lib/commentTime";
import { getServiceListData } from "./services/serviceData";
import { getAllServiceComments } from "./lib/serviceComments";
import { getAllServiceRecommendations } from "./lib/serviceRecommendations";
import { authOptions } from "./lib/auth";
import { getTestimonialReactions } from "./lib/testimonialReactions";
import type { TestimonialData } from "./types/landing";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [session, data, serviceItems, storedComments, serviceRecommendations] =
    await Promise.all([
      getServerSession(authOptions),
      getLandingData(),
      getServiceListData(),
      getAllServiceComments(),
      getAllServiceRecommendations(),
    ]);

  const {
    hero,
    consultation,
    services,
    promos,
    testimonials,
    featuredTreatments,
  } =
    data;

  const serviceMap = new Map(
    serviceItems.map((service) => [service.id, service]),
  );
  const allFeedback: TestimonialData[] = [
    ...storedComments.map((comment) => {
      const service = serviceMap.get(comment.serviceId);

      return {
        id: `comment-${comment.id}`,
        serviceId: comment.serviceId,
        author: comment.author,
        timeAgo: formatCommentTimeAgo(comment.createdAt),
        category: service?.category || "Layanan CleverMom",
        title: service?.title || "Komentar Mom",
        message: comment.message,
        reactionCount: comment.likeCount,
        ctaLabel: "Bantu Mom lain",
      };
    }),
    ...testimonials.map((testimonial) => ({
      ...testimonial,
      ctaLabel: "Bantu Mom lain",
    })),
  ];
  const feedbackReactions = await getTestimonialReactions(
    allFeedback.map((testimonial) => testimonial.id),
    session?.user?.id,
  );
  const feedbackReactionMap = new Map(
    feedbackReactions.map((reaction) => [reaction.testimonialId, reaction]),
  );
  const feedbackWithReactionState = allFeedback.map((testimonial) => {
    const reaction = feedbackReactionMap.get(testimonial.id);

    return {
      ...testimonial,
      persistedReactionCount: reaction?.reactionCount || 0,
      reactionCount:
        testimonial.reactionCount + (reaction?.reactionCount || 0),
      reactedByCurrentUser: reaction?.reactedByCurrentUser || false,
    };
  });
  const recommendationMap = new Map(
    serviceRecommendations.map((recommendation) => [
      recommendation.serviceId,
      recommendation.recommendationCount,
    ]),
  );
  const favoriteTreatments = serviceItems
    .map((service) => ({
      id: service.id,
      name: service.title,
      description: service.category || service.description,
      imageUrl: service.imageUrl,
      href: `/services/${service.id}`,
      recommendationCount: recommendationMap.get(service.id) || 0,
    }))
    .filter((service) => service.recommendationCount > 0)
    .sort((a, b) => b.recommendationCount - a.recommendationCount)
    .slice(0, 5);
  const packageServices = serviceItems
    .filter((service) => service.category?.toLowerCase().includes("paket"))
    .map((service) => ({
      id: service.id,
      title: service.title,
      subtitle: service.category || "Paket CleverMom",
      details: [service.description],
      duration: service.duration,
      imageUrl: service.imageUrl,
    }));

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

      <ServiceGrid services={services} collapsed />

      <PromoCarousel promos={promos} />


      <section className="px-6  bg-gradient-to-b from-[#ffffff] to-[##fffffe]  rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800 text-lg">Ada Paketnya Juga loh!</h2>
          <span className="text-[#a68b6d] text-[10px] font-semibold cursor-pointer hover:underline">
            Lihat Selengkapnya
          </span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar -mx-6 px-6 scroll-smooth snap-x snap-mandatory">
          {packageServices.map((pkg) => (
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

      <FeaturedTreatments
        treatments={
          favoriteTreatments.length > 0 ? favoriteTreatments : featuredTreatments
        }
      />
      
      <TestimonialShowcase testimonials={feedbackWithReactionState} />

      <DashboardFooter />

      <BottomNav />
    </main>
  );
}
