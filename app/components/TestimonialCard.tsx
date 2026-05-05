"use client";

import { useEffect, useState } from "react";
import { Ellipsis, Heart, UserCircle2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ReadMoreText } from "./ReadMoreText";
import { ProgressLink as Link, useRouteProgress } from "./RouteProgress";
import { TestimonialData } from "../types/landing";

interface TestimonialCardProps {
  testimonial: TestimonialData;
  compact?: boolean;
}

export function TestimonialCard({
  testimonial,
  compact = false,
}: TestimonialCardProps) {
  const pathname = usePathname();
  const { status: sessionStatus } = useSession();
  const routeProgress = useRouteProgress();
  const serviceHref = testimonial.serviceSlug
    ? `/services/${encodeURIComponent(testimonial.serviceSlug)}`
    : testimonial.serviceId
      ? `/services/${testimonial.serviceId}`
      : "";
  const testimonialKey = String(testimonial.id);
  const baseReactionCount =
    testimonial.reactionCount - (testimonial.persistedReactionCount || 0);
  const [reactionCount, setReactionCount] = useState(testimonial.reactionCount);
  const [hasHelped, setHasHelped] = useState(
    testimonial.reactedByCurrentUser === true,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleHelpMom = async () => {
    if (sessionStatus !== "authenticated") {
      return;
    }

    const willHelp = !hasHelped;
    routeProgress.start();
    setIsSaving(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/service-comments/like", {
        method: willHelp ? "POST" : "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId: testimonialKey }),
      });
      const payload: unknown = await response.json();

      if (!response.ok || !isLikePayload(payload)) {
        const message =
          isMessagePayload(payload) && payload.message
            ? payload.message
            : willHelp
              ? "Bantuan belum bisa disimpan."
              : "Bantuan belum bisa dibatalkan.";
        throw new Error(message);
      }

      setReactionCount(baseReactionCount + payload.like.likeCount);
      setHasHelped(payload.like.likedByCurrentUser);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : willHelp
            ? "Bantuan belum bisa disimpan."
            : "Bantuan belum bisa dibatalkan.",
      );
    } finally {
      setIsSaving(false);
      routeProgress.finish();
    }
  };

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
              <p className="text-[11px] text-[#b49a80]">
                {testimonial.timeAgo}
              </p>
            </div>
            <Ellipsis size={18} className="shrink-0 text-[#c6b29e]" />
          </div>

          <p className="mt-1 inline-flex rounded-full bg-[#fff4e8] px-2.5 py-1 text-[11px] font-semibold text-[#d48b3b]">
            {testimonial.category}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4">
        <h3 className="text-sm font-bold text-[#5f4c39]">
          {serviceHref ? (
            <Link
              href={serviceHref}
              className="transition hover:text-[#c65f51]"
            >
              {testimonial.title}
            </Link>
          ) : (
            testimonial.title
          )}
        </h3>
        <ReadMoreText
          text={testimonial.message}
          maxChars={compact ? 140 : 220}
          className="mt-2 text-sm leading-6 text-[#5d554e]"
          buttonClassName="mt-1 inline-flex w-fit text-sm font-medium text-[#9a856f]"
        />

        <p className="mt-4 text-xs text-[#9a856f]">
          Dibantu oleh {reactionCount} Mom
        </p>
      </div>

      <div className="border-t border-[#f3e7d9] px-4 py-3">
        {sessionStatus === "authenticated" ? (
          <button
            type="button"
            onClick={handleHelpMom}
            disabled={isSaving}
            className={`flex w-full cursor-pointer items-center justify-center gap-2 text-base font-medium transition disabled:cursor-not-allowed disabled:opacity-70 ${
              hasHelped
                ? "text-[#c65f51]"
                : "text-[#a68b6d] hover:text-[#c65f51]"
            }`}
            aria-pressed={hasHelped}
            aria-label={
              hasHelped
                ? "Batalkan bantuan untuk cerita ini"
                : "Bantu Mom lain dengan cerita ini"
            }
          >
            <Heart
              size={18}
              className={hasHelped ? "fill-current" : undefined}
            />
            <span>
              {isSaving
                ? "Memproses"
                : hasHelped
                  ? "Sudah Bantu"
                  : testimonial.ctaLabel || "Bantu Mom lain"}
            </span>
          </button>
        ) : (
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(pathname || "/")}`}
            className="flex w-full cursor-pointer items-center justify-center gap-2 text-base font-medium text-[#a68b6d] transition hover:text-[#c65f51]"
          >
            <Heart size={18} />
            <span>{testimonial.ctaLabel || "Bantu Mom lain"}</span>
          </Link>
        )}
        {errorMessage ? (
          <p className="mt-2 text-center text-xs text-[#c05c4c]">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function isLikePayload(value: unknown): value is {
  like: {
    commentId: string;
    likeCount: number;
    likedByCurrentUser: boolean;
  };
} {
  return (
    isRecord(value) &&
    isRecord(value.like) &&
    typeof value.like.commentId === "string" &&
    typeof value.like.likeCount === "number" &&
    typeof value.like.likedByCurrentUser === "boolean"
  );
}

function isMessagePayload(value: unknown): value is { message: string } {
  return isRecord(value) && typeof value.message === "string";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
