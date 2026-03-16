"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PromoData } from "../types/landing";

interface PromoCarouselProps {
  promos: PromoData[];
}

export function PromoCarousel({ promos }: PromoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  if (!promos) return null;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? promos.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === promos.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="mb-10 bg-gray-50 py-6">
      <div className="px-6 mb-3">
        <h2 className="font-bold text-gray-800 text-lg">Ada Promo Nih!</h2>
      </div>
      <div className="relative px-6">
        <div className="bg-gray-200 h-40 w-full rounded-2xl flex items-center justify-center overflow-hidden relative shadow-inner">
          {promos[currentIndex]?.imageUrl ? (
            <img
              src={promos[currentIndex].imageUrl}
              alt={promos[currentIndex].title || "Promo"}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="text-gray-400">Image Promo</span>
          )}

          <div
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:bg-white z-10"
            onClick={prevSlide}
          >
            <ChevronLeft size={20} className="text-gray-500" />
          </div>
          <div
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:bg-white z-10"
            onClick={nextSlide}
          >
            <ChevronRight size={20} className="text-gray-500" />
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {promos.map((promo, idx) => (
              <div
                key={promo.id || `promo-dot-${idx}`}
                className={`w-2 h-2 rounded-full ${idx === currentIndex ? "bg-white shadow-sm ring-1 ring-black/5" : "bg-white/60"}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
