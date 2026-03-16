import type { HelpPageData } from "@/app/types/help";

export const mockHelpData: HelpPageData = {
  heroTitle: "Customer bisa melihat bantuan dan menghubungi tim dengan cepat.",
  heroDescription:
    "Halaman ini merangkum topik bantuan utama yang paling sering dibutuhkan oleh Mom saat menggunakan layanan CleverMom.",
  topics: [
    {
      id: "help-1",
      title: "Konsultasi layanan",
      description:
        "Tanyakan rekomendasi treatment, jadwal, atau kebutuhan perawatan ibu dan bayi.",
    },
    {
      id: "help-2",
      title: "Informasi promo",
      description:
        "Mom bisa meminta detail promo yang sedang berjalan sebelum melakukan booking.",
    },
    {
      id: "help-3",
      title: "Bantuan akun",
      description:
        "Jika ada kendala akses atau pertanyaan umum seputar penggunaan website, tim kami siap membantu.",
    },
  ],
  contactTitle: "Butuh bantuan langsung?",
  contactDescription:
    "Hubungi admin CleverMom melalui WhatsApp untuk mendapatkan respon yang lebih cepat.",
  contactButtonLabel: "Hubungi via WhatsApp",
  whatsappNumber: "6281932618816",
};
