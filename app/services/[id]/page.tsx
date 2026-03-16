import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { notFound } from "next/navigation";
import { BottomNav } from "../../components/BottomNav";
import { getServiceById } from "../serviceData";
import { ReadMoreText } from "../../components/ReadMoreText";
import { ServiceActionButtons } from "../../components/ServiceActionButtons";
import { getLandingData } from "../../lib/landing";
import { getArticleList } from "../../lib/blogger";
import type { ArticleListItem } from "../../types/article";
import type { TestimonialData } from "../../types/landing";

interface ServiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { id } = await params;
  const [service, landingData, articles] = await Promise.all([
    getServiceById(id),
    getLandingData(),
    getArticleList(),
  ]);

  if (!service) {
    notFound();
  }

  const relatedTestimonials = getRelatedTestimonials(
    service.title,
    service.category,
    landingData.testimonials,
  );
  const recommendedArticles = getRecommendedArticles(
    service.title,
    service.category,
    articles,
  );

  return (
    <main className="max-w-md mx-auto min-h-screen pb-44 font-sans shadow-md relative bg-[#fffdf9]">
      <header className="h-14 px-4 flex items-center border-b border-[#efe2d3] bg-white/95 sticky top-0 z-30 backdrop-blur">
        <Link
          href="/services"
          className="inline-flex items-center text-[#6f6255]"
        >
          <ArrowLeft size={20} />
        </Link>
      </header>

      <section className="h-48 overflow-hidden bg-[#efe5d8]">
        {service.imageUrl ? (
          <img
            src={service.imageUrl}
            alt={service.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : null}
      </section>

      <section className="px-4 py-6 bg-gradient-to-b from-white to-[#fff8f0] border-b border-[#f1e5d8]">
        {service.category ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a68b6d]">
            {service.category}
          </p>
        ) : null}
        <h1 className="text-xl font-extrabold text-[#1f1f1f] leading-tight mt-2">
          {service.title}
        </h1>
        <p className="text-[#a68b6d] text-md font-semibold mt-3">
          Durasi: {service.duration}
        </p>
        <ReadMoreText
          text={service.description}
          maxChars={100}
          className="text-sm text-[#5f4c39] mt-4 leading-7"
          buttonClassName="text-[#a68b6d] text-sm mt-1"
        />
      </section>

      <section className="bg-[#fff7ee] px-4 py-5 border-b border-[#f1e5d8]">
        <h2 className="text-xl font-bold text-[#1f1f1f] mb-3">Komentar Mom</h2>
        <div className="space-y-3">
          {relatedTestimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="rounded-[24px] border border-[#eadbc9] bg-white p-4 shadow-[0_10px_28px_rgba(166,139,109,0.08)]"
            >
              <div className="flex items-start justify-between mb-2 gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#f3e6d6] flex items-center justify-center text-[#a68b6d] font-bold shrink-0">
                    {testimonial.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#3f3228] truncate">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-[#9b8977]">{testimonial.timeAgo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#d27a6a] shrink-0">
                  <Heart size={16} className="fill-red-500" />
                  <span className="text-xs font-semibold">
                    {testimonial.reactionCount}
                  </span>
                </div>
              </div>
              <p className="text-sm font-semibold text-[#6f6255] mb-2">
                {testimonial.title}
              </p>
              <p className="text-sm text-[#5f4c39] leading-7">
                {testimonial.message}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#fffdf9] px-4 py-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#1f1f1f]">
              Rekomendasi Artikel
            </h2>
            <p className="text-sm text-[#7b6b5b] mt-1">
              Bacaan yang relevan sebelum Mom booking treatment ini.
            </p>
          </div>
          <Link
            href="/artikel"
            className="text-sm font-semibold text-[#a68b6d] shrink-0"
          >
            Lihat semua
          </Link>
        </div>

        <div className="space-y-3">
          {recommendedArticles.map((article) => (
            <Link
              key={article.id}
              href={`/artikel/${article.id}`}
              className="block rounded-[24px] border border-[#eadbc9] bg-[#fffaf5] p-4 shadow-[0_10px_24px_rgba(166,139,109,0.06)] transition-colors hover:bg-[#fff4e8]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a68b6d]">
                Artikel pilihan
              </p>
              <h3 className="mt-2 text-base font-bold leading-6 text-[#1f1f1f]">
                {article.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#6f6255]">
                {article.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
        <div className="bg-white/95 border-t border-[#eadbc9] px-3 py-2 backdrop-blur">
          <ServiceActionButtons serviceTitle={service.title} />
        </div>
        <BottomNav fixed={false} />
      </div>
    </main>
  );
}

function getRelatedTestimonials(
  serviceTitle: string,
  serviceCategory: string | undefined,
  testimonials: TestimonialData[],
) {
  const keywords = buildKeywords(serviceTitle, serviceCategory);

  const matched = testimonials.filter((testimonial) => {
    const haystack = `${testimonial.category} ${testimonial.title} ${testimonial.message}`.toLowerCase();
    return keywords.some((keyword) => haystack.includes(keyword));
  });

  return (matched.length > 0 ? matched : testimonials).slice(0, 3);
}

function getRecommendedArticles(
  serviceTitle: string,
  serviceCategory: string | undefined,
  articles: ArticleListItem[],
) {
  const keywords = buildKeywords(serviceTitle, serviceCategory);

  const scored = articles
    .map((article) => {
      const haystack = `${article.title} ${article.excerpt}`.toLowerCase();
      const score = keywords.reduce(
        (total, keyword) => total + (haystack.includes(keyword) ? 1 : 0),
        0,
      );

      return { article, score };
    })
    .sort((a, b) => b.score - a.score);

  const preferred = scored.filter((item) => item.score > 0).map((item) => item.article);
  const fallback = scored.map((item) => item.article);

  return (preferred.length > 0 ? preferred : fallback).slice(0, 2);
}

function buildKeywords(serviceTitle: string, serviceCategory?: string) {
  return Array.from(
    new Set(
      `${serviceTitle} ${serviceCategory || ""}`
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((keyword) => keyword.length >= 3),
    ),
  );
}
