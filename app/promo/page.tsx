import { BottomNav } from "@/app/components/BottomNav";
import { ProfileSubpageHeader } from "@/app/components/ProfileSubpageHeader";
import { ProgressLink as Link } from "@/app/components/RouteProgress";
import { getLandingData } from "@/app/lib/landing";

export default async function PromoPage() {
  const { promos, consultation } = await getLandingData();

  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-24 font-sans shadow-md">
      <ProfileSubpageHeader title="Promo" backHref="/" />

      <section className="bg-linear-to-b from-[#fffaf5] to-[#f8ecde] border-b border-[#efe2d3] px-6 pb-8 pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a68b6d]">
          Penawaran terbaru
        </p>
        <h2 className="mt-3 text-2xl font-extrabold leading-tight text-[#1f1f1f]">
          Promo menarik untuk perawatan ibu dan bayi.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#6f6255]">
          Semua promo yang tampil di sini dapat dilihat customer tanpa perlu
          login.
        </p>
      </section>

      <section className="space-y-4 px-6 py-6">
        {promos.length > 0 ? (
          promos.map((promo, index) => (
            <article
              key={promo.id}
              className="overflow-hidden rounded-3xl border border-[#efe2d3] bg-white shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Link
                href={`/promo/${promo.slug || promo.id}`}
                className="block group"
              >
                <div className="flex h-48 items-center justify-center bg-[#f9f4ed] overflow-hidden">
                  {promo.imageUrl ? (
                    <img
                      src={promo.imageUrl}
                      alt={promo.title || `Promo ${index + 1}`}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="px-6 text-center text-sm text-[#8d7b69]">
                      Materi promo akan segera tersedia.
                    </span>
                  )}
                </div>
                <div className="p-5 pb-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a68b6d]">
                    Promo {index + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-[#1f1f1f] group-hover:text-[#a68b6d] transition-colors line-clamp-2">
                    {promo.title || "Promo spesial Clevermom"}
                  </h3>
                </div>
              </Link>
              <div className="px-5 pb-5 pt-1 flex items-center justify-between gap-4">
                <Link
                  href={
                    consultation.whatsappNumber
                      ? `https://wa.me/${consultation.whatsappNumber}?text=Halo%20CleverMom,%20saya%20tertarik%20tanya%20tentang%20promo:%20${encodeURIComponent(promo.title || "Promo Spesial")}`
                      : "/"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full bg-[#a68b6d] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#917659] transition-colors"
                >
                  Tanya promo
                </Link>
                <Link
                  href={`/promo/${promo.slug || promo.id}`}
                  className="text-xs font-bold text-[#a68b6d] hover:text-[#917659] transition-colors"
                >
                  Lihat Detail →
                </Link>
              </div>
            </article>
          ))
        ) : (
          <article className="rounded-2xl border border-dashed border-[#eadbc9] bg-[#fffaf5] p-5 text-sm text-[#6f6255]">
            Belum ada promo aktif saat ini.
          </article>
        )}
      </section>

      <BottomNav />
    </main>
  );
}
