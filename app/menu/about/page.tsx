import { ProfileSubpageHeader } from "@/app/components/ProfileSubpageHeader";
import { BottomNav } from "@/app/components/BottomNav";
import { getAboutData } from "@/app/lib/about";

export default async function AboutPage() {
  const data = await getAboutData();

  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#fffaf5] pb-24 font-sans shadow-md">
      <ProfileSubpageHeader title="Tentang clevermom.id" />

      <section className="bg-gradient-to-b from-orange-50 to-orange-100 px-6 pb-8 pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a68b6d]">
          Clevermom
        </p>
        <h2 className="mt-3 text-2xl font-extrabold leading-tight text-[#1f1f1f]">
          {data.heroTitle}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#6f6255]">
          {data.heroDescription}
        </p>
      </section>

      <section className="space-y-4 px-6 py-6">
        {data.values.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm"
          >
            <h3 className="text-base font-bold text-[#1f1f1f]">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      <section className="px-6 pb-8">
        <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a68b6d]">
                Lokasi Cabang
              </p>
              <h3 className="mt-2 text-base font-bold text-[#1f1f1f]">
                Clevermom hadir di lokasi berikut
              </h3>
            </div>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-[#a68b6d]">
              {data.locations.length} lokasi
            </span>
          </div>

          {data.locations.length > 0 ? (
            <div className="mt-4 space-y-3">
              {data.locations.map((location) => (
                <a
                  key={location.id}
                  href={location.mapUrl || undefined}
                  target={location.mapUrl ? "_blank" : undefined}
                  rel={location.mapUrl ? "noreferrer" : undefined}
                  className={`block rounded-xl border border-orange-100 bg-[#fffaf5] p-4 ${
                    location.mapUrl ? "transition-colors hover:bg-orange-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-[#1f1f1f]">
                      {location.name}
                    </p>
                    {location.mapUrl ? (
                      <span className="shrink-0 text-xs font-semibold text-[#a68b6d]">
                        Buka Maps
                      </span>
                    ) : null}
                  </div>
                  {location.address ? (
                    <p className="mt-1 text-sm leading-relaxed text-[#6f6255]">
                      {location.address}
                    </p>
                  ) : null}
                </a>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-[#6f6255]">
              Daftar lokasi cabang akan tampil otomatis di halaman ini saat data
              cabang ditambahkan ke sumber data Clevermom.
            </p>
          )}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
