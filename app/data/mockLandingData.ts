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
    {
      id: 1,
      slug: "baby-treatment",
      label: "Baby\nTreatment",
      category: "Baby Treatment",
    },
    {
      id: 2,
      slug: "paket-baby-treatment",
      label: "Paket Baby\nTreatment",
      category: "Paket Baby Treatment",
    },
    {
      id: 3,
      slug: "toddler-treatment",
      label: "Toddler\nTreatment",
      category: "Toddler Treatment",
    },
    {
      id: 4,
      slug: "paket-toddler-treatment",
      label: "Paket Toddler\nTreatment",
      category: "Paket Toddler Treatment",
    },
    {
      id: 5,
      slug: "kids-treatment",
      label: "Kids\nTreatment",
      category: "Kids Treatment",
    },
    {
      id: 6,
      slug: "paket-kids-treatment",
      label: "Paket Kids\nTreatment",
      category: "Paket Kids Treatment",
    },
    { id: 7, slug: "additional", label: "Additional", category: "Additional" },
  ],
  promos: [
    {
      id: 1,
      slug: "diskon-baby-massage-imun-booster",
      title: "Diskon 20% Baby Massage Imun Booster",
      description:
        "Manjakan si kecil dengan sentuhan lembut terapis bidan profesional CleverMom. Dapatkan diskon 20% untuk paket pijat bayi dan imun booster yang dirancang khusus untuk meningkatkan sistem kekebalan tubuh buah hati Mom di musim pancaroba ini.",
      imageUrl:
        "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      slug: "gratis-haircut-paket-serenity",
      title: "Gratis Haircut untuk Pembelian Paket Serenity",
      imageUrl:
        "https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      slug: "special-toddler-spa-combo",
      title: "Special Toddler Spa Combo & Aromatherapy",
      imageUrl:
        "https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      slug: "hemat-on-call-bidan-half-day",
      title: "Hemat Rp 50.000 On-Call Bidan Half Day",
      imageUrl:
        "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80",
    },
  ],
  packages: [
    {
      id: 1,
      slug: "little-raindrops",
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
      id: 2,
      slug: "comfort-breath",
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
      id: 1,
      slug: "baby-jadi-lebih-tenang-setelah-treatment",
      serviceId: 2,
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
      id: 2,
      slug: "napas-si-kecil-lebih-lega-setelah-sesi-treatment",
      serviceId: 8,
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
      id: 3,
      slug: "anak-lebih-nyaman-setelah-pediatric-massage",
      serviceId: 18,
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
      id: 1,
      slug: "nama-treatment",
      name: "Nama Treatment",
      description: "Deskripsi singkat treatment...",
    },
    {
      id: 2,
      slug: "nama-treatment-2",
      name: "Nama Treatment",
      description: "Deskripsi singkat treatment...",
    },
  ],
};
