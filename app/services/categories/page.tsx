import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BottomNav } from "@/app/components/BottomNav";
import { ServiceGrid } from "@/app/components/ServiceGrid";
import { getLandingData } from "@/app/lib/landing";

export default async function ServiceCategoriesPage() {
  const { services } = await getLandingData();

  return (
    <main className="max-w-md mx-auto min-h-screen bg-[#fffdf9] pb-24 font-sans shadow-md">
      <header className="sticky top-0 z-30 border-b border-[#efe2d3] bg-white/95 px-4 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center justify-center text-[#6f6255]">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#1f1f1f]">Semua Kategori Layanan</h1>
            <p className="text-xs text-[#8d7b69]">
              Pilih kategori untuk melihat layanan CleverMom yang sesuai.
            </p>
          </div>
        </div>
      </header>

      <section className="border-b border-[#f1e5d8] bg-gradient-to-b from-[#fff5e8] via-[#fff9f1] to-[#fffdf9] px-6 py-6">
        <div className="rounded-[28px] border border-[#eadbc9] bg-white/80 px-5 py-5 shadow-[0_16px_40px_rgba(166,139,109,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a68b6d]">
            Kategori Layanan
          </p>
          <h2 className="mt-2 text-2xl font-bold leading-tight text-[#1f1f1f]">
            Pilih kebutuhan Mom dan si Kecil
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#7b6b5b]">
            Semua kategori ini akan langsung mengarahkan Mom ke daftar layanan yang sesuai.
          </p>
        </div>
      </section>

      <div className="bg-[#fffdf9]">
        <ServiceGrid services={services} className="px-6 py-6" />
      </div>

      <BottomNav />
    </main>
  );
}
