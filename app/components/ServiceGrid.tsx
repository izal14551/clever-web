import React from "react";
import { ServiceData } from "../types/landing";

interface ServiceGridProps {
  services: ServiceData[];
}

export function ServiceGrid({ services }: ServiceGridProps) {
  if (!services) return null;
  return (
    <section className="mt-28 px-6 mb-10">
      <h2 className="font-bold text-gray-800 mb-6 text-lg">
        Butuh Layanan Apa Hari Ini?
      </h2>
      <div className="grid grid-cols-3 gap-y-10 gap-x-2 text-center">
        {services.map((service) => (
          <ServiceItem key={service.id} label={service.label} />
        ))}
      </div>
    </section>
  );
}

function ServiceItem({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer">
      <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-orange-50 transition-colors duration-300">
        <div className="w-8 h-8 rounded-full border border-gray-200"></div>
      </div>
      <span className="text-md leading-tight text-gray-700 font-medium px-1 whitespace-pre-wrap">
        {label}
      </span>
    </div>
  );
}
