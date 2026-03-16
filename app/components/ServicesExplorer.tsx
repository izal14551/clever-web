"use client";

import { useState } from "react";
import { ArrowDownUp, Funnel, SlidersHorizontal } from "lucide-react";
import { ServiceList } from "./ServiceList";
import { ServiceListItemData } from "../types/landing";

type SortOption = "default" | "duration-asc" | "duration-desc" | "name-asc";
type DurationFilter = "all" | "short" | "medium" | "long";
type PanelType = "category" | "sort" | "filter" | null;

interface ServicesExplorerProps {
  services: ServiceListItemData[];
}

function extractMinutes(duration: string): number {
  const match = duration.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function deriveCategory(service: ServiceListItemData): string {
  if (service.category?.trim()) {
    return service.category.trim();
  }

  const text = `${service.title} ${service.description}`.toLowerCase();

  if (text.includes("bayi") || text.includes("baby") || text.includes("newborn")) {
    return "Bayi";
  }

  if (text.includes("laktasi") || text.includes("menyusui")) {
    return "Laktasi";
  }

  if (text.includes("nifas") || text.includes("postpartum") || text.includes("ibu")) {
    return "Ibu";
  }

  return "Perawatan";
}

export function ServicesExplorer({ services }: ServicesExplorerProps) {
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [category, setCategory] = useState("Semua");
  const [sort, setSort] = useState<SortOption>("default");
  const [durationFilter, setDurationFilter] = useState<DurationFilter>("all");

  const categories = ["Semua", ...Array.from(new Set(services.map(deriveCategory)))];

  let visibleServices = services.filter((service) => {
    if (category !== "Semua" && deriveCategory(service) !== category) {
      return false;
    }

    const minutes = extractMinutes(service.duration);
    if (durationFilter === "short") return minutes > 0 && minutes <= 30;
    if (durationFilter === "medium") return minutes > 30 && minutes <= 60;
    if (durationFilter === "long") return minutes > 60;
    return true;
  });

  if (sort === "duration-asc") {
    visibleServices = [...visibleServices].sort(
      (a, b) => extractMinutes(a.duration) - extractMinutes(b.duration),
    );
  } else if (sort === "duration-desc") {
    visibleServices = [...visibleServices].sort(
      (a, b) => extractMinutes(b.duration) - extractMinutes(a.duration),
    );
  } else if (sort === "name-asc") {
    visibleServices = [...visibleServices].sort((a, b) =>
      a.title.localeCompare(b.title, "id"),
    );
  }

  return (
    <>
      <section className="grid grid-cols-3 bg-white border-b border-orange-100">
        <button
          type="button"
          onClick={() =>
            setActivePanel((current) => (current === "category" ? null : "category"))
          }
          className="flex items-center justify-center gap-2 border-r border-orange-100 py-3 text-sm font-semibold text-[#6f5a40]"
        >
          <SlidersHorizontal size={16} className="text-[#a68b6d]" />
          Kategori
        </button>
        <button
          type="button"
          onClick={() => setActivePanel((current) => (current === "sort" ? null : "sort"))}
          className="flex items-center justify-center gap-2 border-r border-orange-100 py-3 text-sm font-semibold text-[#6f5a40]"
        >
          <ArrowDownUp size={16} className="text-[#a68b6d]" />
          Urutkan
        </button>
        <button
          type="button"
          onClick={() =>
            setActivePanel((current) => (current === "filter" ? null : "filter"))
          }
          className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-[#6f5a40]"
        >
          <Funnel size={16} className="text-[#a68b6d]" />
          Filter
        </button>
      </section>

      {activePanel ? (
        <section className="border-b border-orange-100 bg-[#fffaf5] px-4 py-4">
          {activePanel === "category" ? (
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setCategory(item);
                    setActivePanel(null);
                  }}
                  className={`rounded-full border px-3 py-2 text-sm font-medium ${
                    category === item
                      ? "border-[#d58b45] bg-[#d58b45] text-white"
                      : "border-orange-100 bg-white text-[#6f5a40]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          ) : null}

          {activePanel === "sort" ? (
            <div className="space-y-2">
              {[
                { value: "default", label: "Urutan default" },
                { value: "duration-asc", label: "Durasi tercepat" },
                { value: "duration-desc", label: "Durasi terlama" },
                { value: "name-asc", label: "Nama A-Z" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setSort(option.value as SortOption);
                    setActivePanel(null);
                  }}
                  className={`block w-full rounded-2xl border px-4 py-3 text-left text-sm ${
                    sort === option.value
                      ? "border-[#d58b45] bg-white text-[#d58b45]"
                      : "border-orange-100 bg-white text-[#6f5a40]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}

          {activePanel === "filter" ? (
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "Semua durasi" },
                { value: "short", label: "<= 30 menit" },
                { value: "medium", label: "31 - 60 menit" },
                { value: "long", label: "> 60 menit" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setDurationFilter(option.value as DurationFilter);
                    setActivePanel(null);
                  }}
                  className={`rounded-full border px-3 py-2 text-sm font-medium ${
                    durationFilter === option.value
                      ? "border-[#d58b45] bg-[#d58b45] text-white"
                      : "border-orange-100 bg-white text-[#6f5a40]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="flex flex-wrap gap-2 border-b border-orange-100 bg-white px-4 py-3">
        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-[#a68b6d]">
          Kategori: {category}
        </span>
        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-[#a68b6d]">
          Filter:{" "}
          {durationFilter === "all"
            ? "Semua durasi"
            : durationFilter === "short"
              ? "<= 30 menit"
              : durationFilter === "medium"
                ? "31 - 60 menit"
                : "> 60 menit"}
        </span>
        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-[#a68b6d]">
          Hasil: {visibleServices.length}
        </span>
      </section>

      {visibleServices.length > 0 ? (
        <ServiceList services={visibleServices} />
      ) : (
        <section className="bg-gradient-to-b from-orange-50 to-orange-100/70 px-4 py-6">
          <div className="rounded-2xl border border-dashed border-orange-200 bg-white p-5 text-sm text-[#6f6255]">
            Belum ada layanan yang cocok dengan kategori, urutan, dan filter yang dipilih.
          </div>
        </section>
      )}
    </>
  );
}
