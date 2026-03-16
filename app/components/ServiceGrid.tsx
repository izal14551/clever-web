import React from "react";
import Link from "next/link";
import { ServiceData } from "../types/landing";

interface ServiceGridProps {
  services: ServiceData[];
  collapsed?: boolean;
  showMoreHref?: string;
  className?: string;
}

export function ServiceGrid({
  services,
  collapsed = false,
  showMoreHref = "/services/categories",
  className = "mt-28 px-6 mb-10",
}: ServiceGridProps) {
  if (!services) return null;

  const shouldCollapse = collapsed && services.length > 9;
  const visibleServices = shouldCollapse ? services.slice(0, 8) : services;

  return (
    <section className={className}>
      <h2 className="mb-6 text-lg font-bold text-[#3f3228]">
        Butuh Layanan Apa Hari Ini?
      </h2>
      <div className="grid grid-cols-3 gap-y-10 gap-x-2 text-center">
        {visibleServices.map((service) => (
          <ServiceItem
            key={service.id}
            label={service.label}
            href={
              resolveServiceCategory(service)
                ? `/services?category=${encodeURIComponent(resolveServiceCategory(service))}`
                : "/services"
            }
          />
        ))}
        {shouldCollapse ? (
          <Link
            href={showMoreHref}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-14 h-14 bg-[#fff4e8] rounded-xl flex items-center justify-center text-[#a68b6d] group-hover:bg-[#f8e7d2] transition-colors duration-300 border border-[#eadbc9]">
              <div className="text-2xl leading-none font-light">+</div>
            </div>
            <span className="text-md leading-tight text-[#6f6255] font-medium px-1 whitespace-pre-wrap">
              Lainnya
            </span>
          </Link>
        ) : null}
      </div>
    </section>
  );
}

function resolveServiceCategory(service: ServiceData): string {
  if (service.category?.trim()) {
    return service.category.trim();
  }

  const normalizedLabel = service.label.replace(/\s+/g, " ").trim().toLowerCase();

  if (normalizedLabel.includes("paket baby")) return "Paket Baby Treatment";
  if (normalizedLabel.includes("baby")) return "Baby Treatment";
  if (normalizedLabel.includes("paket toddler")) return "Paket Toddler Treatment";
  if (normalizedLabel.includes("toddler")) return "Toddler Treatment";
  if (normalizedLabel.includes("paket kids")) return "Paket Kids Treatment";
  if (normalizedLabel.includes("kids")) return "Kids Treatment";
  if (normalizedLabel.includes("additional") || normalizedLabel.includes("lainnya")) {
    return "Additional";
  }

  return "";
}

function ServiceItem({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-2 group cursor-pointer">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#eadbc9] bg-[#fffaf5] text-[#a68b6d] transition-colors duration-300 group-hover:bg-[#fff1e2]">
        <div className="h-8 w-8 rounded-full border border-[#dcc4a8] bg-[#fffdf9]"></div>
      </div>
      <span className="text-md whitespace-pre-wrap px-1 font-medium leading-tight text-[#6f6255]">
        {label}
      </span>
    </Link>
  );
}
