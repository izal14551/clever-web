"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Info,
  Search,
  Sparkles,
  Tag,
  X,
} from "lucide-react";

interface SearchItem {
  id: string;
  title: string;
  description: string;
  href: string;
  type: "service" | "article" | "promo" | "package" | "testimonial";
  badge: string;
}

interface SearchCategory {
  label: string;
  href: string;
}

interface SearchExperienceProps {
  items: SearchItem[];
  categories: SearchCategory[];
}

const STORAGE_KEY = "clevermom_recent_searches";

function getTypeLabel(type: SearchItem["type"]) {
  if (type === "service") return "Layanan";
  if (type === "article") return "Artikel";
  if (type === "promo") return "Promo";
  if (type === "package") return "Paket";
  return "Testimonial";
}

export function SearchExperience({
  items,
  categories,
}: SearchExperienceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setRecentSearches(parsed.filter((item): item is string => typeof item === "string"));
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const keywords = useMemo(() => {
    const seen = new Set<string>();

    return items
      .flatMap((item) => [item.badge, item.title])
      .filter((value) => {
        const normalized = value.trim();
        if (!normalized || seen.has(normalized.toLowerCase())) return false;
        seen.add(normalized.toLowerCase());
        return true;
      })
      .slice(0, 6);
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = initialQuery.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return items.filter((item) => {
      const haystack = `${item.title} ${item.description} ${item.badge} ${getTypeLabel(item.type)}`
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [initialQuery, items]);

  const featuredItems = useMemo(() => items.slice(0, 5), [items]);

  function updateQuery(nextQuery: string, persist = false) {
    const params = new URLSearchParams(searchParams.toString());
    const normalized = nextQuery.trim();

    if (normalized) {
      params.set("q", normalized);
    } else {
      params.delete("q");
    }

    router.replace(`${pathname}${params.toString() ? `?${params}` : ""}`);

    if (persist && normalized) {
      const nextRecent = [
        normalized,
        ...recentSearches.filter((item) => item.toLowerCase() !== normalized.toLowerCase()),
      ].slice(0, 5);

      setRecentSearches(nextRecent);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecent));
    }
  }

  function removeRecentSearch(keyword: string) {
    const nextRecent = recentSearches.filter((item) => item !== keyword);
    setRecentSearches(nextRecent);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecent));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateQuery(query, true);
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[#f1e5d8] bg-white/95 px-4 py-4 backdrop-blur">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center justify-center text-[#6f6255]">
            <ArrowLeft size={20} />
          </Link>

          <div className="flex flex-1 items-center gap-2 rounded-full bg-[#f5f1ea] px-4 py-3">
            <Search size={16} className="text-[#a68b6d]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari layanan, artikel, atau promo"
              className="w-full bg-transparent text-sm text-[#5f4c39] outline-none placeholder:text-[#b5a291]"
            />
          </div>
        </form>
      </header>

      <section className="space-y-2 bg-white px-6 py-6">
        <h2 className="text-lg font-bold text-[#4f4032]">Riwayat Pencarian</h2>
        <p className="text-sm text-[#8b7763]">Pencarian terakhir</p>

        {recentSearches.length > 0 ? (
          <div className="rounded-3xl border border-[#f1e5d8] bg-[#fffaf5]">
            {recentSearches.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between border-b border-[#f1e5d8] px-4 py-4 last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => {
                    setQuery(item);
                    updateQuery(item, true);
                  }}
                  className="text-left text-sm text-[#5f4c39]"
                >
                  {item}
                </button>
                <button
                  type="button"
                  onClick={() => removeRecentSearch(item)}
                  className="text-[#ad9b89]"
                  aria-label={`Hapus ${item}`}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#eadbc9] bg-[#fffaf5] px-4 py-5 text-sm text-[#8b7763]">
            Belum ada riwayat pencarian. Coba cari layanan favorit Mom.
          </div>
        )}
      </section>

      <section className="space-y-4 border-t border-[#f6eee4] bg-white px-6 py-6">
        <div>
          <h2 className="text-lg font-bold text-[#4f4032]">Pencarian Pilihan</h2>
          <p className="mt-1 text-sm text-[#8b7763]">Kata kunci</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword) => (
            <button
              key={keyword}
              type="button"
              onClick={() => {
                setQuery(keyword);
                updateQuery(keyword, true);
              }}
              className="rounded-full border border-[#eadbc9] bg-[#fffaf5] px-3 py-2 text-sm font-medium text-[#7b664f]"
            >
              {keyword}
            </button>
          ))}
        </div>

        {!initialQuery.trim() ? (
          <>
            <div className="rounded-[28px] border border-[#eadbc9] bg-gradient-to-b from-[#fffdf9] to-[#fff3e4] px-5 py-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#d58b45] shadow-sm">
                <Sparkles size={34} />
              </div>
              <h3 className="mt-5 text-2xl font-bold text-[#4f4032]">
                Temukan kebutuhan Mom lebih cepat
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#8b7763]">
                Cari layanan, artikel, promo, atau testimonial yang sudah tersedia di CleverMom.
              </p>
            </div>

            <div className="rounded-3xl bg-[#edf6ff] px-4 py-4 text-sm leading-6 text-[#4f6b86]">
              <div className="flex items-start gap-2">
                <Info size={16} className="mt-1 shrink-0 text-[#2997dc]" />
                <p>
                  Gunakan kata kunci seperti <strong>pijat bayi</strong>, <strong>laktasi</strong>, atau <strong>promo</strong> untuk menemukan konten yang paling relevan.
                </p>
              </div>
            </div>
          </>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-[28px] border border-[#eadbc9] bg-gradient-to-b from-[#fffdf9] to-[#fff3e4] px-5 py-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#d58b45] shadow-sm">
              <Search size={34} />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-[#4f4032]">
              Kata kunci belum ditemukan
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#8b7763]">
              Coba gunakan kata kunci lain yang lebih spesifik sesuai layanan atau topik yang Mom cari.
            </p>
          </div>
        ) : null}
      </section>

      <section className="space-y-6 border-t border-[#f6eee4] bg-white px-6 py-6">
        {initialQuery.trim() ? (
          <div>
            <h2 className="text-lg font-bold text-[#4f4032]">Hasil Pencarian</h2>
            <p className="mt-1 text-sm text-[#8b7763]">
              Menampilkan {filteredItems.length} hasil untuk &quot;{initialQuery}&quot;
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-bold text-[#4f4032]">Rekomendasi Untuk Mom</h2>
            <p className="mt-1 text-sm text-[#8b7763]">
              Konten pilihan dari layanan dan halaman yang sudah tersedia.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {(initialQuery.trim() ? filteredItems : featuredItems).map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="block rounded-[24px] border border-[#f1e5d8] bg-white p-4 shadow-sm transition-colors hover:bg-[#fffaf5]"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff4e8] text-[#d58b45]">
                  <Tag size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a68b6d]">
                    {getTypeLabel(item.type)} • {item.badge}
                  </p>
                  <h3 className="mt-1 text-base font-bold leading-6 text-[#4f4032]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#7c6957]">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4 border-t border-[#f6eee4] bg-white px-6 py-6">
        <div>
          <h2 className="text-lg font-bold text-[#4f4032]">Rekomendasi</h2>
          <p className="mt-1 text-sm text-[#8b7763]">
            Jelajahi halaman yang paling sering dicari Mom
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="rounded-[22px] border border-[#eadbc9] bg-[#fffaf5] px-4 py-4 text-sm font-semibold text-[#6f6255] transition-colors hover:bg-[#fff3e6]"
            >
              {category.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
