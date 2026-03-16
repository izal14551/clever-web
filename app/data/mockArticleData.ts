import type { ArticleDetail } from "@/app/types/article";

export const mockArticleData: ArticleDetail[] = [
  {
    id: "artikel-1",
    title: "Tips merawat bayi baru lahir di minggu pertama",
    excerpt:
      "Langkah dasar yang bisa dilakukan orang tua untuk menjaga kenyamanan dan kebersihan bayi baru lahir di rumah.",
    publishedAt: "2026-03-01T09:00:00.000Z",
    updatedAt: "2026-03-01T09:00:00.000Z",
    imageUrl: "/logo/LOGO_CLEVERMOM.png",
    authorName: "Tim Clevermom",
    contentHtml: `
      <p>Minggu pertama setelah persalinan biasanya menjadi masa adaptasi untuk ibu dan bayi. Orang tua perlu fokus pada kebutuhan dasar bayi seperti menyusu, tidur, dan kebersihan.</p>
      <h2>Hal penting yang perlu diperhatikan</h2>
      <ul>
        <li>Pastikan bayi menyusu secara teratur.</li>
        <li>Jaga kebersihan area popok dan tali pusat.</li>
        <li>Perhatikan suhu ruangan agar bayi tetap nyaman.</li>
      </ul>
      <p>Jika bayi tampak demam, sulit menyusu, atau terlihat sangat lemas, segera hubungi tenaga kesehatan.</p>
    `,
  },
  {
    id: "artikel-2",
    title: "Cara memilih treatment ibu dan bayi yang sesuai kebutuhan",
    excerpt:
      "Panduan singkat untuk memahami kapan perlu konsultasi, treatment relaksasi, atau pendampingan perawatan di rumah.",
    publishedAt: "2026-03-05T08:30:00.000Z",
    updatedAt: "2026-03-06T03:15:00.000Z",
    imageUrl: "/logo/LOGO_CLEVERMOM.png",
    authorName: "Admin Clevermom",
    contentHtml: `
      <p>Setiap ibu dan bayi memiliki kebutuhan yang berbeda. Karena itu, treatment yang dipilih sebaiknya disesuaikan dengan kondisi saat ini.</p>
      <h2>Pertimbangan sebelum memilih treatment</h2>
      <ol>
        <li>Usia bayi atau fase pemulihan ibu.</li>
        <li>Tujuan utama treatment, misalnya relaksasi atau stimulasi.</li>
        <li>Ketersediaan waktu dan kebutuhan konsultasi lanjutan.</li>
      </ol>
      <p>Konsultasi awal dapat membantu menentukan layanan yang paling relevan sebelum booking.</p>
    `,
  },
];
