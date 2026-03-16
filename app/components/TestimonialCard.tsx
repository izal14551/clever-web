import { Ellipsis, Heart, UserCircle2 } from "lucide-react";
import { ReadMoreText } from "./ReadMoreText";
import { TestimonialData } from "../types/landing";

interface TestimonialCardProps {
  testimonial: TestimonialData;
  compact?: boolean;
}

export function TestimonialCard({
  testimonial,
  compact = false,
}: TestimonialCardProps) {
  return (
    <article
      className={`flex flex-col rounded-[20px] border border-[#f0e1cf] bg-white shadow-[0_14px_34px_rgba(166,139,109,0.14)] ${compact ? "w-[248px] shrink-0" : "w-full"}`}
    >
      <div className="flex items-start gap-3 px-4 pb-3 pt-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fbf2e8] text-[#b39472]">
          <UserCircle2 size={24} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#5f4c39]">
                {testimonial.author}
              </p>
              <p className="text-[11px] text-[#b49a80]">{testimonial.timeAgo}</p>
            </div>
            <Ellipsis size={18} className="shrink-0 text-[#c6b29e]" />
          </div>

          <p className="mt-1 inline-flex rounded-full bg-[#fff4e8] px-2.5 py-1 text-[11px] font-semibold text-[#d48b3b]">
            {testimonial.category}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4">
        <h3 className="text-sm font-bold text-[#5f4c39]">{testimonial.title}</h3>
        <ReadMoreText
          text={testimonial.message}
          maxChars={compact ? 140 : 220}
          className="mt-2 text-sm leading-6 text-[#5d554e]"
          buttonClassName="mt-1 inline-flex w-fit text-sm font-medium text-[#9a856f]"
        />

        <p className="mt-4 text-xs text-[#9a856f]">
          Direkomendasikan oleh {testimonial.reactionCount} Mom
        </p>
      </div>

      <div className="border-t border-[#f3e7d9] px-4 py-3">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 text-base font-medium text-[#a68b6d]"
        >
          <Heart size={18} className="fill-current" />
          <span>{testimonial.ctaLabel}</span>
        </button>
      </div>
    </article>
  );
}
