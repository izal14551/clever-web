import Link from "next/link";
import { ServiceListItemData } from "../types/landing";

interface ServiceListProps {
  services: ServiceListItemData[];
}

export function ServiceList({ services }: ServiceListProps) {
  if (!services || services.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-orange-50 to-orange-100/70 py-2">
      <div className="overflow-hidden border border-orange-100/80">
        {services.map((service) => (
          <Link
            key={service.id}
            href={`/services/${service.id}`}
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
    </section>
  );
}
