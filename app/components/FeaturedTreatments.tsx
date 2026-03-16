import React from "react";
import Image from "next/image";
import { TreatmentData } from "../types/landing";

interface FeaturedTreatmentsProps {
  treatments: TreatmentData[];
}

export function FeaturedTreatments({ treatments }: FeaturedTreatmentsProps) {
  if (!treatments) return null;
  return (
    <section className="px-6  bg-gradient-to-b from-[#fffffe] to-[#fffaf5] py-6">
      <h2 className="font-bold text-gray-800 text-lg mb-4">
        Treatment Favorit
      </h2>
      <div className="space-y-3">
        {treatments.map((treatment) => (
          <div
            key={treatment.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex gap-3 items-center"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-lg shrink-0 relative overflow-hidden">
              {treatment.imageUrl && (
                <Image
                  src={treatment.imageUrl}
                  alt={treatment.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div>
              <h4 className="font-bold text-md text-gray-800">
                {treatment.name}
              </h4>
              <p className="text-sm text-gray-500">{treatment.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
