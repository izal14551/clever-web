"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
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
  const [recommendation, setRecommendation] = useState(initialRecommendation);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRecommend = async () => {
    if (
      sessionStatus !== "authenticated" ||
      recommendation.recommendedByCurrentUser
    ) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/service-recommendations", {
        method: "POST",
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
            : "Rekomendasi belum bisa disimpan.";
        throw new Error(message);
      }

      setRecommendation(payload.recommendation);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Rekomendasi belum bisa disimpan.",
      );
    } finally {
      setIsSaving(false);
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
        disabled={recommendation.recommendedByCurrentUser || isSaving}
        className={`inline-flex h-10 items-center justify-center gap-2 rounded-md border px-3 text-sm font-semibold transition disabled:cursor-not-allowed ${
          recommendation.recommendedByCurrentUser
            ? "border-[#f1c8c1] bg-[#fff2ef] text-[#c65f51]"
            : "border-[#eadbc9] bg-white text-[#7b6b5b] hover:border-[#d27a6a] hover:text-[#c65f51]"
        }`}
        aria-pressed={recommendation.recommendedByCurrentUser}
        aria-label={
          recommendation.recommendedByCurrentUser
            ? "Layanan sudah direkomendasikan"
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
          {recommendation.recommendedByCurrentUser
            ? "Direkomendasikan"
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
