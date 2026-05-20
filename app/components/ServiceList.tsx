"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ServiceListItemData } from "../types/landing";
import { ProgressLink as Link } from "./RouteProgress";

interface ServiceListProps {
  services: ServiceListItemData[];
  itemsPerPage?: number;
}

export function ServiceList({ services, itemsPerPage = 5 }: ServiceListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [prevServices, setPrevServices] = useState(services);

  if (services !== prevServices) {
    setPrevServices(services);
    setCurrentPage(1);
  }

  if (!services || services.length === 0) return null;

  const totalPages = Math.ceil(services.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedServices = services.slice(startIndex, endIndex);

  return (
    <section className="bg-white py-2">
      <div className="overflow-hidden border border-orange-100/80">
        {displayedServices.map((service) => (
          <Link
            key={service.id}
            href={`/services/${service.slug || service.id}`}
            className="block p-4 border-b border-orange-100 last:border-b-0 hover:bg-orange-50/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-[150px] h-[110px] rounded-md bg-orange-100 overflow-hidden shrink-0">
                {service.imageUrl ? (
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[11px] text-[#a68b6d]">
                    Foto layanan
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-bold text-[#6f5a40] mb-1 leading-snug">
                  {service.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-2 line-clamp-3">
                  {service.description}
                </p>
                <p className="text-xs font-semibold text-[#a68b6d]">
                  Durasi: {service.duration}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-4 bg-orange-50/30 border-t border-orange-100">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border border-orange-200 bg-white text-xs font-semibold text-[#6f5a40] shadow-sm hover:bg-orange-50/50 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} />
            Sebelumnya
          </button>

          <span className="text-xs font-medium text-[#7a6a57]">
            Halaman <span className="font-bold">{currentPage}</span> dari{" "}
            <span className="font-bold">{totalPages}</span>
          </span>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border border-orange-200 bg-white text-xs font-semibold text-[#6f5a40] shadow-sm hover:bg-orange-50/50 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            Berikutnya
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </section>
  );
}
