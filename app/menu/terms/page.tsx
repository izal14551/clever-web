import { BottomNav } from "@/app/components/BottomNav";
import { ProfileSubpageHeader } from "@/app/components/ProfileSubpageHeader";

const terms = [
  "Informasi akun yang digunakan untuk login harus benar dan berada dalam kendali pengguna.",
  "Akses ke halaman profile, membership, dan fitur terkait hanya boleh digunakan untuk kebutuhan pribadi pengguna.",
  "Clevermom berhak memperbarui isi layanan, manfaat membership, dan kebijakan penggunaan sesuai kebutuhan operasional.",
  "Pengguna bertanggung jawab menjaga kerahasiaan akun Google yang dipakai untuk masuk ke platform.",
  "Konten, jadwal, dan informasi layanan yang tampil di aplikasi dapat berubah sewaktu-waktu tanpa pemberitahuan terpisah.",
  "Dengan menggunakan platform ini, pengguna dianggap memahami dan menyetujui ketentuan yang berlaku.",
];

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-md bg-white pb-24 font-sans shadow-md">
      <ProfileSubpageHeader title="Syarat & ketentuan" />

      <section className="px-6 pb-6 pt-8">
        <div className="rounded-3xl bg-[#f9f4ed] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a68b6d]">
            Ketentuan Penggunaan
          </p>
          <h2 className="mt-3 text-2xl font-extrabold leading-tight text-[#1f1f1f]">
            Hal-hal dasar yang perlu dipahami sebelum menggunakan Clevermom.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#6f6255]">
            Halaman ini merangkum poin utama penggunaan akun dan layanan di
            clevermom.id.
          </p>
        </div>
      </section>

      <section className="space-y-3 px-6 pb-8">
        {terms.map((term, index) => (
          <article
            key={term}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-semibold text-[#a68b6d]">Poin {index + 1}</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{term}</p>
          </article>
        ))}
      </section>

      <BottomNav />
    </main>
  );
}
