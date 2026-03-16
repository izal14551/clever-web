"use client";

import { Share2, MessageCircle } from "lucide-react";

interface ServiceActionButtonsProps {
  serviceTitle: string;
}

export function ServiceActionButtons({
  serviceTitle,
}: ServiceActionButtonsProps) {
  const handleShare = async () => {
    const shareData = {
      title: `Layanan: ${serviceTitle}`,
      text: `Saya tertarik dengan layanan ${serviceTitle} dari Clevermom. Yuk cek detailnya!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Gagal membagikan:", error);
      }
    } else {
      // Fallback jika browser tidak mendukung Web Share API,
      // atau jika diakses via http:// IP lokal (karena restriksi keamanan dari browser HP)
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(window.location.href);
          alert("Link telah disalin ke clipboard!");
        } else {
          // Fallback tradisional untuk local testing IP
          const textArea = document.createElement("textarea");
          textArea.value = window.location.href;
          textArea.style.position = "fixed";
          textArea.style.left = "-9999px";
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand("copy");
            alert("Link telah disalin ke clipboard!");
          } catch (err) {
            console.error("Copy to clipboard failed", err);
            alert("Gagal menyalin link.");
          }
          document.body.removeChild(textArea);
        }
      } catch (err) {
        console.error("Fallback error:", err);
      }
    }
  };

  // Anda dapat mengganti nomor ini dengan nomor WhatsApp yang dituju
  const WA_NUMBER = "6281234567890";
  const waMessage = `Halo Clevermom, saya tertarik untuk memesan layanan *${serviceTitle}*.`;
  const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="grid grid-cols-[120px_1fr] gap-2">
      <button
        onClick={handleShare}
        className="h-10 rounded-md border border-[#a68b6d] text-[#a68b6d] font-semibold text-sm inline-flex items-center justify-center gap-2"
      >
        <Share2 size={16} />
        Bagikan
      </button>
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="h-10 rounded-md bg-[#a68b6d] text-white font-semibold text-sm inline-flex items-center justify-center gap-2"
      >
        <MessageCircle size={16} />
        Pesan Sekarang
      </a>
    </div>
  );
}
