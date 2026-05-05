"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ProgressLink as Link, useRouteProgress } from "./RouteProgress";
import type { ServiceRecommendationSummary } from "../lib/serviceRecommendations";

interface ServiceRecommendationButtonProps {
  serviceId: string;
  initialRecommendation: ServiceRecommendationSummary;
}

export function ServiceRecommendationButton({
  serviceId,
  initialRecommendation,
}: ServiceRecommendationButtonProps) {
  const pathname = usePathname();
  const { status: sessionStatus } = useSession();
  const routeProgress = useRouteProgress();
  const [recommendation, setRecommendation] = useState(initialRecommendation);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRecommend = async () => {
    if (sessionStatus !== "authenticated") {
      return;
    }

    const willRecommend = !recommendation.recommendedByCurrentUser;
    routeProgress.start();
    setIsSaving(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/service-recommendations", {
        method: willRecommend ? "POST" : "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ serviceId }),
      });
      const payload: unknown = await response.json();

      if (!response.ok || !isRecommendationPayload(payload)) {
        const message =
          isMessagePayload(payload) && payload.message
            ? payload.message
            : willRecommend
              ? "Rekomendasi belum bisa disimpan."
              : "Rekomendasi belum bisa dibatalkan.";
        throw new Error(message);
      }

      setRecommendation(payload.recommendation);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : willRecommend
            ? "Rekomendasi belum bisa disimpan."
            : "Rekomendasi belum bisa dibatalkan.",
      );
    } finally {
      setIsSaving(false);
      routeProgress.finish();
    }
  };

  if (sessionStatus !== "authenticated") {
    return (
      <div className="mt-4">
        <Link
          href={`/login?callbackUrl=${encodeURIComponent(pathname || "/services")}`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#eadbc9] bg-white px-3 text-sm font-semibold text-[#7b6b5b]"
        >
          <Heart size={16} />
          Rekomendasikan layanan
          <span className="text-[#c65f51]">
            {recommendation.recommendationCount}
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleRecommend}
        disabled={isSaving}
        className={`inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${
          recommendation.recommendedByCurrentUser
            ? "border-[#f1c8c1] bg-[#fff2ef] text-[#c65f51] hover:border-[#d27a6a] hover:bg-[#ffe8e3]"
            : "border-[#eadbc9] bg-white text-[#7b6b5b] hover:border-[#d27a6a] hover:text-[#c65f51]"
        }`}
        aria-pressed={recommendation.recommendedByCurrentUser}
        aria-label={
          recommendation.recommendedByCurrentUser
            ? "Batalkan rekomendasi layanan"
            : "Rekomendasikan layanan"
        }
      >
        <Heart
          size={16}
          className={
            recommendation.recommendedByCurrentUser ? "fill-current" : undefined
          }
        />
        <span>
          {isSaving
            ? "Memproses"
            : recommendation.recommendedByCurrentUser
              ? "Batalkan rekomendasi"
              : "Rekomendasikan"}
        </span>
        <span>{recommendation.recommendationCount}</span>
      </button>
      {errorMessage ? (
        <p className="mt-2 text-xs text-[#c05c4c]">{errorMessage}</p>
      ) : null}
    </div>
  );
}

function isRecommendationPayload(value: unknown): value is {
  recommendation: ServiceRecommendationSummary;
} {
  return (
    isRecord(value) &&
    isRecord(value.recommendation) &&
    typeof value.recommendation.serviceId === "string" &&
    typeof value.recommendation.recommendationCount === "number" &&
    typeof value.recommendation.recommendedByCurrentUser === "boolean"
  );
}

function isMessagePayload(value: unknown): value is { message: string } {
  return isRecord(value) && typeof value.message === "string";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
