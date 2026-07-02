"use client";

import React, { useState } from "react";
import { MessageCircle, Share2 } from "lucide-react";

interface PromoActionButtonsProps {
  waLink: string;
  shareTitle: string;
  shareText: string;
}

export function PromoActionButtons({
  waLink,
  shareTitle,
  shareText,
}: PromoActionButtonsProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareData = {
      title: shareTitle,
      text: shareText,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Abaikan jika user membatalkan sharing
        if (error instanceof Error && error.name !== "AbortError") {
          fallbackCopy();
        }
      }
    } else {
      fallbackCopy();
    }
  }

  function fallbackCopy() {
    if (typeof window === "undefined") return;

    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Gagal menyalin tautan:", err);
      });
  }

  return (
    <div className="grid grid-cols-[120px_1fr] gap-2 w-full">
      {/* Tombol Bagikan */}
      <button
        type="button"
        onClick={handleShare}
        className={`h-10 rounded-md border font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer active:scale-[0.98] ${
          copied
            ? "bg-emerald-50 border-emerald-200 text-emerald-600"
            : "border-[#a68b6d] text-[#a68b6d] hover:bg-[#fff5e8]"
        }`}
      >
        <Share2 size={16} className={copied ? "animate-bounce" : ""} />
        {copied ? "Tersalin!" : "Bagikan"}
      </button>

      {/* Tombol Tanya Promo */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="h-10 rounded-md bg-[#a68b6d] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 hover:bg-[#917659] active:scale-[0.98] transition-all cursor-pointer"
      >
        <MessageCircle size={16} />
        Tanya Promo
      </a>
    </div>
  );
}
