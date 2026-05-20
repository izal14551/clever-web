import React from "react";
import { ProgressLink as Link } from "./RouteProgress";

interface ServiceGridItem {
  id: number;
  slug?: string;
  label: string;
  category?: string;
  iconUrl?: string;
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

  const uniqueCategories = getUniqueCategories(services);
  const shouldCollapse = collapsed && uniqueCategories.length > 9;
  const visibleCategories = shouldCollapse
    ? uniqueCategories.slice(0, 8)
    : uniqueCategories;

  return (
    <section className={className}>
      <h2 className="mb-6 text-lg font-bold text-[#3f3228]">
        Butuh Layanan Apa Hari Ini?
      </h2>
      <div className="grid grid-cols-3 gap-y-10 gap-x-2 text-center">
        {visibleCategories.map((item) => {
          const categoryName = (item.category || item.label || "").trim();
          return (
            <ServiceItem
              key={item.id}
              label={item.label}
              iconUrl={item.iconUrl}
              href={`/services?category=${encodeURIComponent(categoryName)}`}
            />
          );
        })}
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

function getUniqueCategories(services: ServiceGridItem[]): ServiceGridItem[] {
  const seen = new Set<string>();
  return services.filter((service) => {
    const categoryName = (service.category || service.label || "").trim();
    if (!categoryName) return false;

    // Saring kategori yang memiliki kata "paket"
    if (categoryName.toLowerCase().includes("paket")) return false;

    if (seen.has(categoryName.toLowerCase())) {
      return false;
    }
    seen.add(categoryName.toLowerCase());
    return true;
  });
}

function ServiceItem({
  label,
  iconUrl,
  href,
}: {
  label: string;
  iconUrl?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 group cursor-pointer"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#eadbc9] bg-[#fffaf5] text-[#a68b6d] transition-colors duration-300 group-hover:bg-[#fff1e2] overflow-hidden">
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={label.replace(/\n/g, " ")}
            className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="h-8 w-8 rounded-full border border-[#dcc4a8] bg-[#fffdf9]"></div>
        )}
      </div>
      <span className="text-md whitespace-pre-wrap px-1 font-medium leading-tight text-[#6f6255]">
        {label}
      </span>
    </Link>
  );
}
