import { HeartHandshake, Quote } from "lucide-react";
import { getServerSession } from "next-auth";
import { BottomNav } from "../components/BottomNav";
import { ProfileSubpageHeader } from "../components/ProfileSubpageHeader";
import { TestimonialCard } from "../components/TestimonialCard";
import { formatCommentTimeAgo } from "../lib/commentTime";
import { getLandingData } from "../lib/landing";
import { getServiceListData } from "../services/serviceData";
import { getAllServiceComments } from "../lib/serviceComments";
import { authOptions } from "../lib/auth";
import { getTestimonialReactions } from "../lib/testimonialReactions";
import type { TestimonialData } from "../types/landing";

export const dynamic = "force-dynamic";

export default async function TestimonialPage() {
  const [session, data, services, storedComments] = await Promise.all([
    getServerSession(authOptions),
    getLandingData(),
    getServiceListData(),
    getAllServiceComments(),
  ]);
  const serviceMap = new Map(services.map((service) => [String(service.id), service]));
  const serviceSlugMap = new Map(
    services
      .filter((service) => service.slug)
      .map((service) => [service.slug as string, service]),
  );
  const testimonials: TestimonialData[] = [
    ...storedComments.map((comment) => {
      const service =
        serviceMap.get(comment.serviceId) || serviceSlugMap.get(comment.serviceId);

      return {
        id: `comment-${comment.id}`,
        serviceId: service?.id,
        serviceSlug: service?.slug,
        author: comment.author,
        timeAgo: formatCommentTimeAgo(comment.createdAt),
        category: service?.category || "Layanan CleverMom",
        title: service?.title || "Komentar Mom",
        message: comment.message,
        reactionCount: comment.likeCount,
        ctaLabel: "Bantu Mom lain",
      };
    }),
    ...(data.testimonials ?? []).map((testimonial) => ({
      ...testimonial,
      ctaLabel: "Bantu Mom lain",
    })),
  ];
  const reactions = await getTestimonialReactions(
    testimonials.map((testimonial) => String(testimonial.id)),
    session?.user?.id,
  );
  const reactionMap = new Map(
    reactions.map((reaction) => [reaction.testimonialId, reaction]),
  );
  const testimonialsWithReactionState = testimonials.map((testimonial) => {
    const reaction = reactionMap.get(String(testimonial.id));
    const service = testimonial.serviceId
      ? serviceMap.get(String(testimonial.serviceId))
      : undefined;

    return {
      ...testimonial,
      serviceSlug: testimonial.serviceSlug || service?.slug,
      persistedReactionCount: reaction?.reactionCount || 0,
      reactionCount:
        testimonial.reactionCount + (reaction?.reactionCount || 0),
      reactedByCurrentUser: reaction?.reactedByCurrentUser || false,
    };
  });

  return (
    <main className="relative mx-auto min-h-screen max-w-md bg-white pb-24 font-sans shadow-md">
      <ProfileSubpageHeader title="Testimonial Mom" backHref="/" />

      <section className="bg-gradient-to-b from-[#fffaf5] to-[#f8ecde] px-6 pb-8 pt-6">
        <div className="relative rounded-[28px] border border-[#ecd8c3] bg-[linear-gradient(180deg,_#fffefb_0%,_#fff4e8_55%,_#f8e4cd_100%)] p-5 shadow-[0_14px_34px_rgba(166,139,109,0.14)]">
          <Quote
            size={148}
            className="pointer-events-none absolute right-2 top-2 z-0 text-[#f2ddc5]"
            strokeWidth={1.5}
          />
          <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#c98a47] shadow-sm">
            <HeartHandshake size={24} />
          </div>
          <h1 className="relative z-10 mt-4 text-2xl font-bold leading-8 text-[#5f4c39]">
            Cerita hangat dari Mom yang sudah ditemani CleverMom
          </h1>
          <p className="relative z-10 mt-3 text-sm leading-6 text-[#7d6a57]">
            Kumpulan pengalaman dari ibu yang sudah mencoba layanan treatment, konsultasi, dan pendampingan kami di rumah.
          </p>
          <div className="relative z-10 mt-4 inline-flex items-center rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#a68b6d]">
            {testimonialsWithReactionState.length} testimonial pilihan
          </div>
        </div>
      </section>

      <section className="-mt-2 px-6 pb-6">
        <div className="space-y-4">
          {testimonialsWithReactionState.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </section>

      <section className="px-6 pb-8">
        <div className="relative overflow-hidden rounded-[24px] border border-[#f0e1cf] bg-[#fffaf5] p-5">
          <Quote
            size={132}
            className="pointer-events-none absolute -right-6 top-1 z-0 text-[#f3e5d4]"
            strokeWidth={1.5}
          />
          <h2 className="relative z-10 text-lg font-bold text-[#5f4c39]">
            Setiap cerita jadi pengingat bahwa ibu juga perlu ditemani
          </h2>
          <p className="relative z-10 mt-2 text-sm leading-6 text-[#7d6a57]">
            Karena itu kami berusaha menjaga setiap layanan tetap hangat, tenang, dan nyaman untuk Mom serta si kecil.
          </p>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
