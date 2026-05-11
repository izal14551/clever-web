# Clevermom Spreadsheet Template

Template ini menstandarkan data spreadsheet agar siap dipakai aplikasi sekarang dan lebih mudah dimigrasikan ke relational DB nanti.

## Prinsip Kolom

- `id`: integer positif, stabil, tidak dipakai untuk URL publik.
- `slug`: teks URL-friendly, unik per sheet jika dipakai untuk route/link.
- `serviceId`: foreign key integer ke sheet `services.id`.
- `sortOrder`: integer untuk urutan tampil.
- Kolom gambar boleh berisi URL publik atau Google Drive share link; aplikasi akan mencoba mengubahnya ke direct image URL.

## Sheet yang Disiapkan

- `service_categories.csv`: kategori layanan untuk grid homepage.
- `services.csv`: daftar treatment/layanan detail.
- `promos.csv`: banner promo.
- `packages.csv`: paket yang tampil di homepage.
- `testimonials.csv`: testimonial, terkait ke treatment via `serviceId`.
- `featured_treatments.csv`: fallback treatment favorit saat belum ada rekomendasi user.
- `about_values.csv`: nilai/section halaman tentang.
- `branches.csv`: lokasi cabang.
- `help_topics.csv`: topik bantuan.
- `site_content.csv`: konten singleton seperti hero, konsultasi, dan CTA bantuan.

## Apps Script

File `apps-script-example.gs` sudah dibuat sebagai `Code.gs` paste-ready.

Langkah implementasi:

1. Buat Google Sheets.
2. Import CSV template ke sheet dengan nama yang sama tanpa ekstensi, misalnya `branches.csv` menjadi sheet `branches`.
3. Buka `Extensions -> Apps Script`.
4. Paste isi `apps-script-example.gs` ke `Code.gs`.
5. Di Apps Script, buka `Project Settings -> Script properties`.
6. Tambahkan `APPS_SCRIPT_API_KEY` dengan value yang sama seperti `.env.local`.
7. Deploy sebagai Web app, lalu pakai URL deployment sebagai `APPS_SCRIPT_URL`.

Script akan mengembalikan JSON dengan bentuk:

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
