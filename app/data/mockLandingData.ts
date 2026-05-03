import { LandingPageData } from "../types/landing";

export const mockLandingData: LandingPageData = {
  hero: {
    logoUrl: "/logo/LOGO_CLEVERMOM.PNG",
    title: "Spesialis Kebidanan",
    subtitle: "One Stop Solution Mom and Baby Care",
    description: "Layanan Bidan Premium No. 1 Bergaransi",
  },
  consultation: {
    title: "Butuh Konsultasi Online?",
    description:
      "Konsultasi ibu dan bayi bersama bidan profesional, langsung dari rumah.",
    buttonText: "Hubungi Sekarang",
    whatsappNumber: "6281932618816",
  },
  services: [
    { id: "1", label: "Baby\nTreatment", category: "Baby Treatment" },
    {
      id: "2",
      label: "Paket Baby\nTreatment",
      category: "Paket Baby Treatment",
    },
    { id: "3", label: "Toddler\nTreatment", category: "Toddler Treatment" },
    {
      id: "4",
      label: "Paket Toddler\nTreatment",
      category: "Paket Toddler Treatment",
    },
    { id: "5", label: "Kids\nTreatment", category: "Kids Treatment" },
    {
      id: "6",
      label: "Paket Kids\nTreatment",
      category: "Paket Kids Treatment",
    },
    { id: "7", label: "Additional", category: "Additional" },
  ],
  promos: [{ id: "p1" }, { id: "p2" }, { id: "p3" }, { id: "p4" }],
  packages: [
    {
      id: "pkg1",
      title: "Little Raindrops",
      subtitle: "(Baby Massage, Memandikan)",
      details: [
        "Baby massage",
        "Memandikan bayi",
        "Fokus untuk membuat bayi lebih rileks dan bersih dengan perawatan lembut",
      ],
      duration: "90 Menit",
    },
    {
      id: "pkg2",
      title: "Comfort Breath",
      subtitle: "(Nebulizer, Sinar Infrared)",
      details: [
        "Nebulizer",
        "Sinar Infrared",
        "Membantu melegakan pernapasan dan meredakan ketegangan pada dada",
      ],
      duration: "30 Menit",
    },
  ],
  testimonials: [
    {
      id: "ts1",
      serviceId: "svc2",
      author: "Mom Anisa",
      timeAgo: "3 hari lalu",
      category: "Baby Massage",
      title: "Baby jadi lebih tenang setelah treatment",
      message:
        "Terapisnya lembut banget, cara pegang bayinya juga bikin saya tenang. Setelah sesi selesai, anak saya tidurnya lebih nyenyak dan badan terasa lebih rileks. Saya suka karena semua dijelaskan pelan-pelan ke saya sebagai ibunya.",
      reactionCount: 18,
      ctaLabel: "Bantu Mom lain",
    },
    {
      id: "ts2",
      serviceId: "svc8",
      author: "Mom Dita",
      timeAgo: "1 minggu lalu",
      category: "Paket Baby Treatment",
      title: "Napas si kecil lebih lega setelah sesi treatment",
      message:
        "Saya ambil paket Comfort Breath saat anak lagi pilek dan tidurnya mulai terganggu. Terapis datang tepat waktu, alatnya rapi, dan prosesnya tenang. Setelah sesi selesai, napas anak terasa lebih lega dan saya jadi lebih tenang juga.",
      reactionCount: 12,
      ctaLabel: "Bantu Mom lain",
    },
    {
      id: "ts3",
      serviceId: "svc18",
      author: "Mom Rara",
      timeAgo: "2 minggu lalu",
      category: "Kids Treatment",
      title: "Anak lebih nyaman setelah pediatric massage",
      message:
        "Awalnya saya khawatir karena anak lagi susah tidur dan perutnya sering tidak nyaman. Setelah pediatric massage, badannya lebih rileks dan malamnya tidur lebih panjang. Terapisnya juga sabar menjelaskan apa yang dilakukan selama sesi.",
      reactionCount: 9,
      ctaLabel: "Bantu Mom lain",
    },
  ],
  featuredTreatments: [
    {
      id: "tr1",
      name: "Nama Treatment",
      description: "Deskripsi singkat treatment...",
    },
    {
      id: "tr2",
      name: "Nama Treatment",
      description: "Deskripsi singkat treatment...",
    },
  ],
};
