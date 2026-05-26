"use client";

import React, { useState } from "react";
import { Share2 } from "lucide-react";

interface ArticleActionButtonsProps {
  articleTitle: string;
}

export function ArticleActionButtons({
  articleTitle,
}: ArticleActionButtonsProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareData = {
      title: `Artikel: ${articleTitle}`,
      text: `Saya baru saja membaca artikel menarik: "${articleTitle}". Yuk baca juga!`,
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
    <div className="w-full">
      <button
        type="button"
        onClick={handleShare}
        className={`w-full h-10 rounded-md border font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer active:scale-[0.98] ${
          copied
            ? "bg-emerald-50 border-emerald-200 text-emerald-600"
            : "border-[#a68b6d] text-[#a68b6d] hover:bg-[#fff5e8]"
        }`}
      >
        <Share2 size={16} className={copied ? "animate-bounce" : ""} />
        {copied ? "Link Tersalin!" : "Bagikan Artikel"}
      </button>
    </div>
  );
}
