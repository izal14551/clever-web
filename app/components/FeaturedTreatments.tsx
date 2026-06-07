import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { TreatmentData } from "../types/landing";

interface FeaturedTreatmentsProps {
  treatments: TreatmentData[];
}

export function FeaturedTreatments({ treatments }: FeaturedTreatmentsProps) {
  if (!treatments || treatments.length === 0) return null;
  return (
    <section className="px-6  bg-gradient-to-b from-[#fffffe] to-[#fffaf5] py-6">
      <h2 className="font-bold text-gray-800 text-lg mb-4">
        Treatment Favorit
      </h2>
      <div className="space-y-3">
        {treatments.map((treatment) => (
          <Link
            key={treatment.id}
            href={
              treatment.href || `/services/${treatment.slug || treatment.id}`
            }
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex gap-3 items-center"
          >
            <div className="w-20 aspect-[15/11] bg-gray-100 rounded-lg shrink-0 relative overflow-hidden">
              {treatment.imageUrl && (
                <Image
                  src={treatment.imageUrl}
                  alt={treatment.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-md text-gray-800">
                {treatment.name}
              </h4>
              <p className="text-sm text-gray-500">{treatment.description}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1 text-[#c65f51]">
              <Heart size={16} className="fill-current" />
              <span className="text-sm font-bold">
                {treatment.recommendationCount || 0}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
