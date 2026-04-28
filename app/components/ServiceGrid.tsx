import React from "react";
import { ProgressLink as Link } from "./RouteProgress";

interface ServiceGridItem {
  id: string;
  label?: string;
  title?: string;
  category?: string;
}

interface ServiceGridProps {
  services: ServiceGridItem[];
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

  const categories = getServiceCategories(services);
  const shouldCollapse = collapsed && categories.length > 9;
  const visibleCategories = shouldCollapse ? categories.slice(0, 8) : categories;

  return (
    <section className={className}>
      <h2 className="mb-6 text-lg font-bold text-[#3f3228]">
        Butuh Layanan Apa Hari Ini?
      </h2>
      <div className="grid grid-cols-3 gap-y-10 gap-x-2 text-center">
        {visibleCategories.map((category) => (
          <ServiceItem
            key={category}
            label={category}
            href={`/services?category=${encodeURIComponent(category)}`}
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

function getServiceCategories(services: ServiceGridItem[]): string[] {
  const categories = services
    .map((service) => resolveServiceCategory(service) || getServiceLabel(service))
    .map((category) => category.trim())
    .filter(Boolean);

  return Array.from(new Set(categories));
}

function getServiceLabel(service: ServiceGridItem): string {
  return service.label || service.title || "Layanan";
}

function resolveServiceCategory(service: ServiceGridItem): string {
  if (service.category?.trim()) {
    return service.category.trim();
  }

  const normalizedLabel = getServiceLabel(service)
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

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
