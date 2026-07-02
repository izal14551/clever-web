import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Gift, Info, ShieldCheck } from "lucide-react";
import { getLandingData } from "@/app/lib/landing";
import { BottomNav } from "@/app/components/BottomNav";
import { PromoActionButtons } from "@/app/components/PromoActionButtons";

interface PromoDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Menghasilkan deskripsi dinamis yang estetik berdasarkan judul promo agar terlihat premium
function generatePromoDetails(title: string) {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("baby massage")) {
    return {
      description:
        "Berikan kenyamanan terbaik untuk si Kecil dengan layanan Baby Massage spesial dari Bidan Profesional CleverMom. Pijat bayi bermanfaat untuk meningkatkan daya tahan tubuh (imun booster), membantu si Kecil tidur lebih nyenyak, dan melancarkan sistem pencernaan.",
      benefits: [
        "Meningkatkan imunitas & metabolisme tubuh bayi",
        "Merangsang perkembangan saraf sensorik dan motorik",
        "Membuat tidur bayi lebih berkualitas dan mengurangi kolik/kembung",
        "Dilakukan langsung oleh Bidan tersertifikasi dengan minyak pijat premium aman",
      ],
      terms: [
        "Promo berlaku untuk bayi usia 0 - 12 bulan.",
        "Wajib melakukan reservasi minimal H-1 kunjungan.",
        "Promo tidak dapat digabungkan dengan promo lainnya.",
        "Berlaku untuk area layanan home care CleverMom.",
      ],
    };
  } else if (
    lowerTitle.includes("serenity") ||
    lowerTitle.includes("haircut")
  ) {
    return {
      description:
        "Nikmati perawatan eksklusif Paket Serenity dari CleverMom dan dapatkan layanan tambahan POTONG RAMBUT GRATIS untuk si Kecil. Kombinasi paket stimulasi otak (brain gym) serta pijat relaksasi yang sangat baik untuk melatih fokus dan meredakan ketegangan tubuh anak.",
      benefits: [
        "Gratis potong rambut rapi dan higienis untuk anak",
        "Stimulasi sel-sel otak anak melalui teknik brain gym terarah",
        "Relaksasi otot menyeluruh yang meningkatkan sirkulasi darah",
        "Pelayanan ramah anak yang minim trauma dan penuh perhatian",
      ],
      terms: [
        "Promo berlaku gratis haircut untuk setiap pembelian 1 Paket Serenity.",
        "Hanya berlaku untuk layanan homecare.",
        "Wajib reservasi terlebih dahulu untuk penyesuaian jadwal bidan.",
        "Promo berlaku selama persediaan slot bidan hari ini masih tersedia.",
      ],
    };
  } else if (
    lowerTitle.includes("toddler spa") ||
    lowerTitle.includes("toddler")
  ) {
    return {
      description:
        "Rasakan kesegaran dan kenyamanan ekstra untuk anak usia balita dengan paket Toddler Spa Combo & Aromaterapi esensial organik. Terapi spa lengkap yang dikombinasikan dengan berendam air hangat beraroma menenangkan sangat membantu anak menjadi lebih rileks, ceria, dan aktif.",
      benefits: [
        "Pijat toddler khusus untuk menjaga kelenturan otot anak aktif",
        "Terapi mandi uap / berendam air hangat dengan aromaterapi organik aman",
        "Membantu melancarkan sirkulasi udara pada pernapasan balita",
        "Dilakukan dengan pendekatan kasih sayang bidan agar balita merasa ceria",
      ],
      terms: [
        "Promo berlaku untuk balita usia 1 - 3 tahun.",
        "Aromaterapi menggunakan bahan herbal alami 100% tersertifikasi.",
        "Tidak berlaku di hari libur nasional kecuali telah melakukan booking H-3.",
        "Klaim promo dapat dilakukan langsung melalui konfirmasi WhatsApp.",
      ],
    };
  } else {
    // Default fallback
    return {
      description:
        "Manfaatkan penawaran terbatas dari CleverMom untuk menghadirkan kehangatan dan perawatan bidan profesional langsung ke rumah Mom. CleverMom hadir mendampingi tumbuh kembang buah hati tercinta dengan sentuhan kasih sayang bidan bersertifikat.",
      benefits: [
        "Layanan eksklusif terstandarisasi medis dan ramah keluarga",
        "Terapis ramah, sabar, dan merupakan bidan berizin resmi",
        "Peralatan steril, higienis, dan ramah lingkungan bawaan terapis",
        "Jaminan garansi kenyamanan pelayanan atau kunjungan pengganti",
      ],
      terms: [
        "Promo berlaku selama kuota bulanan masih tersedia.",
        "Dapat diklaim oleh pelanggan baru maupun pelanggan setia CleverMom.",
        "Layanan terjadwal sesuai dengan ketersediaan terapis bidan terdekat.",
        "Hubungi Admin WhatsApp CleverMom untuk petunjuk aktivasi promo instan.",
      ],
    };
  }
}

export default async function PromoDetailPage({
  params,
}: PromoDetailPageProps) {
  const data = await getLandingData();
  const resolvedParams = await params;
  const { promos, consultation } = data;

  const promo = promos.find(
    (p) => String(p.id) === resolvedParams.id || p.slug === resolvedParams.id,
  );

  if (!promo) {
    return (
      <main className="mx-auto min-h-screen max-w-md bg-[#fffdf9] pb-24 font-sans shadow-md flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-orange-400 mb-6">
          <Info size={40} />
        </div>
        <h1 className="text-xl font-bold text-gray-800">
          Promo Tidak Ditemukan
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Maaf, promo yang Mom cari tidak ditemukan atau telah berakhir masa
          berlakunya.
        </p>
        <Link
          href="/promo"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#d58b45] px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#c37a34] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          Kembali ke Promo
        </Link>
      </main>
    );
  }

  const promoMeta = generatePromoDetails(promo.title || "");

  const waText = `Halo CleverMom, saya tertarik untuk mengambil promo: "${promo.title || "Promo Spesial"}" yang tertera di website. Bagaimana cara klaim dan booking jadwalnya?`;
  const waLink = consultation.whatsappNumber
    ? `https://wa.me/${consultation.whatsappNumber}?text=${encodeURIComponent(waText)}`
    : "#";

  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#fffdf9] pb-44 font-sans shadow-md relative">
      <header className="sticky top-0 z-30 border-b border-[#efe2d3] bg-white/95 px-4 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link
            href="/promo"
            className="inline-flex items-center justify-center text-[#6f6255] hover:text-[#d58b45] transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#1f1f1f] line-clamp-1">
              Detail Promo Spesial
            </h1>
          </div>
        </div>
      </header>

      {/* Gambar Cover Promo */}
      <section className="relative w-full aspect-[16/9] bg-[#f9f4ed] overflow-hidden">
        {promo.imageUrl ? (
          <img
            src={promo.imageUrl}
            alt={promo.title}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center text-[#a68b6d] p-6 text-center gap-2">
            <Gift size={40} className="stroke-[1.5]" />
            <span className="text-sm">Gambar promo segera hadir</span>
          </div>
        )}
        <div className="absolute top-4 right-4 rounded-full bg-[#a68b6d] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm">
          Promo Aktif
        </div>
      </section>

      {/* Info Utama Promo */}
      <section className="px-6 py-6 border-b border-[#efe2d3] bg-white">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#fff5e8] px-2.5 py-1 text-[10px] font-semibold text-[#a68b6d] mb-3">
          <Calendar size={12} />
          Terbatas Bulan Ini
        </span>
        <h2 className="text-xl font-extrabold leading-snug text-[#1f1f1f]">
          {promo.title || "Promo Spesial CleverMom"}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#5f5245]">
          {promo.description || promoMeta.description}
        </p>
      </section>

      {/* Manfaat Layanan */}
      <section className="px-6 py-6 border-b border-[#efe2d3] bg-white">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#a68b6d] flex items-center gap-2 mb-4">
          <Gift size={16} className="text-[#a68b6d]" />
          Keuntungan Promo Ini
        </h3>
        <ul className="space-y-3">
          {promoMeta.benefits.map((benefit, idx) => (
            <li
              key={idx}
              className="flex gap-2.5 text-xs text-gray-700 leading-relaxed"
            >
              <span className="inline-flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 w-5 h-5 shrink-0 mt-0.5 font-bold">
                ✓
              </span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Syarat & Ketentuan */}
      <section className="px-6 py-6 bg-white">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#a68b6d] flex items-center gap-2 mb-4">
          <ShieldCheck size={16} className="text-[#a68b6d]" />
          Syarat & Ketentuan
        </h3>
        <ul className="space-y-3">
          {promoMeta.terms.map((term, idx) => (
            <li
              key={idx}
              className="flex gap-2.5 text-xs text-gray-600 leading-relaxed"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#a68b6d] shrink-0 mt-2"></span>
              <span>{term}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Fixed Action Buttons & Navigasi di bagian bawah */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
        <div className="bg-white/95 border-t border-[#eadbc9] px-4 py-3 backdrop-blur shadow-[0_-8px_30px_rgba(166,139,109,0.06)]">
          <PromoActionButtons
            waLink={waLink}
            shareTitle={`Promo Spesial CleverMom: ${promo.title}`}
            shareText={`Hai Mom! Lihat promo menarik ini dari CleverMom: "${promo.title}". Perawatan Bidan premium langsung ke rumah!`}
          />
        </div>
        <BottomNav fixed={false} />
      </div>
    </main>
  );
}
