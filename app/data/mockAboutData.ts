import type { AboutPageData } from "@/app/types/about";

export const mockAboutData: AboutPageData = {
  heroTitle: "Platform pendamping untuk ibu dan keluarga.",
  heroDescription:
    "clevermom.id membantu pengguna mengakses informasi layanan, membership, dan pengalaman perawatan yang lebih terstruktur.",
  values: [
    {
      id: 1,
      slug: "pendampingan-yang-hangat",
      title: "Pendampingan yang hangat",
      description:
        "Clevermom hadir untuk membantu ibu memahami kebutuhan tumbuh kembang anak dengan pendekatan yang dekat, jelas, dan praktis.",
    },
    {
      id: 2,
      slug: "akses-layanan-yang-mudah",
      title: "Akses layanan yang mudah",
      description:
        "Kami merancang pengalaman yang sederhana agar konsultasi, treatment, dan informasi membership bisa diakses dengan cepat dari satu tempat.",
    },
    {
      id: 3,
      slug: "fokus-pada-kepercayaan",
      title: "Fokus pada kepercayaan",
      description:
        "Setiap informasi dan layanan disusun untuk mendukung hubungan jangka panjang dengan keluarga yang menggunakan Clevermom.",
    },
  ],
  locations: [
    {
      id: 1,
      slug: "branch-bintaro",
      name: "Clevermom Bintaro",
      address: "Bintaro, Tangerang Selatan",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Clevermom+Bintaro",
      sortOrder: 1,
    },
  ],
};
