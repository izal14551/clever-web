import React from "react";
import Link from "next/link";
import { HeartHandshake, Quote } from "lucide-react";
import { TestimonialCard } from "./TestimonialCard";
import { TestimonialData } from "../types/landing";

interface TestimonialShowcaseProps {
  testimonials: TestimonialData[];
}

export function TestimonialShowcase({
  testimonials,
}: TestimonialShowcaseProps) {
  if (!testimonials?.length) return null;

  return (
    <section className=" overflow-hidden bg-[#fffaf5] py-6">
      <div className="mb-4 flex items-center justify-between px-6">
        <h2 className="text-lg font-bold text-[#6f5840]">Cerita Mom Bersama CleverMom</h2>
        <Link
          href="/testimonial"
          className="cursor-pointer text-sm font-medium text-[#a68b6d] hover:underline"
        >
          Lihat semua
        </Link>
      </div>

      <div className="overflow-x-auto pb-3 no-scrollbar">
        <div className="flex min-w-max gap-4 px-6">
          <article className="relative flex w-[220px] shrink-0 flex-col justify-between overflow-hidden rounded-[24px] border border-[#ecd8c3] bg-[linear-gradient(180deg,_#fffdf9_0%,_#fff4e8_48%,_#f8e4cd_100%)] p-5 shadow-[0_14px_34px_rgba(166,139,109,0.14)]">
           
            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#c98a47] shadow-sm">
              <HeartHandshake size={24} />
            </div>

            <div className="relative z-10 mt-5">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#c98a47]">
                Review Pilihan
              </p>
              <h3 className="mt-2 text-lg font-bold leading-7 text-[#5f4c39]">
                Pengalaman hangat dari Mom yang sudah mencoba layanan kami
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#7d6a57]">
                Cerita asli dari ibu yang merasakan treatment, konsultasi, dan pendampingan CleverMom di rumah.
              </p>
            </div>
             <Quote
              size={132}
              className="pointer-events-none absolute -right-6 bottom-1 z-0 text-[#fffff5] opacity-80"
              strokeWidth={1.5}
            />
          </article>

          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id || `testimonial-${index}`}
              testimonial={testimonial}
              compact
            />
          ))}
        </div>
      </div>
    </section>
  );
}
