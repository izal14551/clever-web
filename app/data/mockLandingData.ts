import { LandingPageData } from "../types/landing";

export const mockLandingData: LandingPageData = {
  hero: {
    logoUrl: "/logo/LOGO_CLEVERMOM.png",
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
    { id: "1", label: "Baby\nTreatment" },
    { id: "2", label: "Toddler\nTreatment" },
    { id: "3", label: "Kids\nTreatment" },
    { id: "4", label: "Pregnancy\nTreatment" },
    { id: "5", label: "Konselor\nLaktasi" },
    { id: "6", label: "Postpartum\nTreatment" },
    { id: "7", label: "Newborn\nCare" },
    { id: "8", label: "Serenity Mom\nand Care" },
    { id: "9", label: "Lainnya" },
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
      author: "Mom Dita",
      timeAgo: "1 minggu lalu",
      category: "Postpartum Care",
      title: "Pelayanannya hangat dan bikin recovery lebih nyaman",
      message:
        "Saya ambil layanan postpartum di rumah dan pengalaman saya menyenangkan. Terapis datang tepat waktu, alatnya rapi, dan treatment-nya bikin badan lebih ringan. Yang paling saya suka, saya merasa didampingi tanpa dihakimi selama masa pemulihan.",
      reactionCount: 12,
      ctaLabel: "Bantu Mom lain",
    },
    {
      id: "ts3",
      author: "Mom Rara",
      timeAgo: "2 minggu lalu",
      category: "Konselor Laktasi",
      title: "Penjelasannya sabar dan mudah dipahami",
      message:
        "Awalnya saya bingung soal pelekatan dan stok ASI, tapi setelah konsultasi saya jadi lebih paham langkah-langkah yang harus dilakukan. Cara menjelaskannya enak, tidak terburu-buru, dan benar-benar menenangkan untuk ibu baru seperti saya.",
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
