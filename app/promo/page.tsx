import Link from "next/link";
import { BottomNav } from "@/app/components/BottomNav";
import { ProfileSubpageHeader } from "@/app/components/ProfileSubpageHeader";
import { getLandingData } from "@/app/lib/landing";

export default async function PromoPage() {
  const { promos, consultation } = await getLandingData();

  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-24 font-sans shadow-md">
      <ProfileSubpageHeader title="Promo" backHref="/" />

      <section className="bg-gradient-to-b from-orange-50 to-orange-100 px-6 pb-8 pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a68b6d]">
          Penawaran terbaru
        </p>
        <h2 className="mt-3 text-2xl font-extrabold leading-tight text-[#1f1f1f]">
          Promo menarik untuk perawatan ibu dan bayi.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#6f6255]">
          Semua promo yang tampil di sini dapat dilihat customer tanpa perlu login.
        </p>
      </section>

      <section className="space-y-4 px-6 py-6">
        {promos.length > 0 ? (
          promos.map((promo, index) => (
            <article
              key={promo.id}
              className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm"
            >
              <div className="flex h-48 items-center justify-center bg-[#f9f4ed]">
                {promo.imageUrl ? (
                  <img
                    src={promo.imageUrl}
                    alt={promo.title || `Promo ${index + 1}`}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="px-6 text-center text-sm text-[#8d7b69]">
                    Materi promo akan segera tersedia.
                  </span>
                )}
              </div>
              <div className="space-y-3 p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a68b6d]">
                    Promo {index + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-[#1f1f1f]">
                    {promo.title || "Promo spesial Clevermom"}
                  </h3>
                </div>
                <Link
                  href={
                    consultation.whatsappNumber
                      ? `https://wa.me/${consultation.whatsappNumber}`
                      : "/"
                  }
                  className="inline-flex rounded-full bg-[#d58b45] px-4 py-2 text-sm font-semibold text-white"
                >
                  Tanya promo
                </Link>
              </div>
            </article>
          ))
        ) : (
          <article className="rounded-2xl border border-dashed border-orange-200 bg-[#fffaf5] p-5 text-sm text-[#6f6255]">
            Belum ada promo aktif saat ini.
          </article>
        )}
      </section>

      <BottomNav />
    </main>
  );
}
