# Clevermom Spreadsheet Template

Template ini menstandarkan data spreadsheet agar siap dipakai aplikasi sekarang dan lebih mudah dimigrasikan ke relational DB nanti.

Template siap pakai tersedia sebagai satu workbook multi-sheet di `docs/spreadsheet-template.xlsx`.
Upload file tersebut ke Google Sheets jika ingin langsung mendapatkan semua tab dalam satu file.

## Prinsip Kolom

- `id`: integer positif, stabil, tidak dipakai untuk URL publik.
- `slug`: teks URL-friendly, unik per sheet jika dipakai untuk route/link.
- `service_id`: foreign key integer ke sheet `services.id`.
- `sort_order`: integer untuk urutan tampil.
- Kolom gambar boleh berisi URL publik atau Google Drive share link; aplikasi akan mencoba mengubahnya ke direct image URL.

## Sheet yang Disiapkan

- `service_categories.csv`: kategori layanan untuk grid homepage.
- `services.csv`: daftar treatment/layanan detail.
- `promos.csv`: banner promo.
- `packages.csv`: paket yang tampil di homepage.
- `testimonials.csv`: testimonial, terkait ke treatment via `service_id`.
- `featured_treatments.csv`: fallback treatment favorit saat belum ada rekomendasi user.
- `about_values.csv`: nilai/section halaman tentang.
- `branches.csv`: lokasi cabang.
- `help_topics.csv`: topik bantuan.
- `site_content.csv`: konten singleton seperti hero, konsultasi, dan CTA bantuan.

## Apps Script

File `apps-script-example.gs` sudah dibuat sebagai `Code.gs` paste-ready.

Langkah implementasi:

1. Upload `docs/spreadsheet-template.xlsx` ke Google Sheets.
2. Pastikan nama tab sama seperti daftar sheet di atas.
3. Buka `Extensions -> Apps Script`.
4. Paste isi `apps-script-example.gs` ke `Code.gs`.
5. Di Apps Script, buka `Project Settings -> Script properties`.
6. Tambahkan `APPS_SCRIPT_API_KEY` dengan value yang sama seperti `.env.local`.
7. Deploy sebagai Web app, lalu pakai URL deployment sebagai `APPS_SCRIPT_URL`.

CSV di folder ini adalah sumber maintenance untuk `docs/spreadsheet-template.xlsx`.
Untuk penggunaan normal, upload file `.xlsx` saja.

Script membaca header spreadsheet dalam `snake_case`, lalu mengembalikan JSON dengan bentuk `camelCase` agar tetap cocok dengan aplikasi:

```json
{
  "hero": {},
  "consultation": {},
  "services": [],
  "serviceList": [],
  "promos": [],
  "packages": [],
  "testimonials": [],
  "featuredTreatments": [],
  "about": {
    "values": [],
    "branches": []
  },
  "help": {
    "topics": []
  }
}
```

`services` dipakai untuk kategori homepage, sedangkan `serviceList` dipakai untuk halaman `/services` dan detail `/services/[slug]`.

Sheet penyimpanan fitur interaktif akan dibuat otomatis saat pertama kali dipakai:

- `members`
- `service_comments`
- `service_comment_likes`
- `service_recommendations`
- `testimonial_reactions`
