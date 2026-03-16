# Template Spreadsheet Apps Script untuk CleverMom

Dokumen ini menjelaskan struktur Google Spreadsheet yang disarankan agar mudah dihubungkan ke website CleverMom melalui Apps Script.

## Tujuan

Spreadsheet ini dipakai sebagai source data untuk:

- Homepage
- Daftar layanan
- Detail layanan
- Promo
- About / Tentang CleverMom
- Bantuan
- Profile summary member

## Struktur Sheet yang Disarankan

Buat file Google Spreadsheet dengan tab berikut:

1. `landing_hero`
2. `landing_consultation`
3. `landing_services`
4. `landing_promos`
5. `landing_packages`
6. `landing_testimonials`
7. `landing_featured_treatments`
8. `service_list`
9. `about_page`
10. `about_values`
11. `about_locations`
12. `help_page`
13. `help_topics`
14. `member_summary`
15. `member_menus`

Template CSV untuk tiap tab sudah disiapkan di folder [sheet-templates](/c:/laragon/www/clevermom/clever-web/docs/sheet-templates).

## Struktur Kolom per Sheet

### 1. `landing_hero`

Satu baris saja.

| Kolom | Wajib | Keterangan |
| --- | --- | --- |
| `logoUrl` | Ya | URL logo CleverMom |
| `title` | Ya | Judul hero |
| `subtitle` | Ya | Subtitle hero |
| `description` | Ya | Deskripsi hero |

### 2. `landing_consultation`

Satu baris saja.

| Kolom | Wajib | Keterangan |
| --- | --- | --- |
| `title` | Ya | Judul section konsultasi |
| `description` | Ya | Deskripsi konsultasi |
| `buttonText` | Ya | Label tombol |
| `whatsappNumber` | Ya | Nomor WhatsApp tanpa tanda `+` |

### 3. `landing_services`

Satu baris per icon layanan homepage.

Catatan:
- Sheet ini khusus untuk icon layanan di dashboard / homepage.
- Tetap gunakan versi ringkas seperti menu layanan yang sekarang.
- Jangan isi seluruh katalog treatment di sini.

| Kolom | Wajib | Keterangan |
| --- | --- | --- |
| `id` | Ya | ID unik |
| `label` | Ya | Label icon layanan |
| `iconUrl` | Tidak | URL icon jika ingin custom |
| `sortOrder` | Tidak | Urutan tampil |

### 4. `landing_promos`

Satu baris per promo.

| Kolom | Wajib | Keterangan |
| --- | --- | --- |
| `id` | Ya | ID promo |
| `title` | Tidak | Judul promo |
| `imageUrl` | Tidak | URL gambar promo |
| `link` | Tidak | Link promo |
| `sortOrder` | Tidak | Urutan tampil |

### 5. `landing_packages`

Satu baris per paket.

| Kolom | Wajib | Keterangan |
| --- | --- | --- |
| `id` | Ya | ID paket |
| `title` | Ya | Nama paket |
| `subtitle` | Tidak | Subtitle paket |
| `details` | Ya | Detail paket, pisahkan dengan `|` |
| `duration` | Ya | Durasi |
| `imageUrl` | Tidak | URL gambar |
| `sortOrder` | Tidak | Urutan tampil |

### 6. `landing_testimonials`

Satu baris per testimonial.

| Kolom | Wajib | Keterangan |
| --- | --- | --- |
| `id` | Ya | ID testimonial |
| `author` | Ya | Nama author |
| `timeAgo` | Ya | Teks waktu |
| `category` | Ya | Kategori layanan |
| `title` | Ya | Judul testimonial |
| `message` | Ya | Isi testimonial |
| `reactionCount` | Ya | Jumlah rekomendasi |
| `ctaLabel` | Ya | Label tombol |
| `sortOrder` | Tidak | Urutan tampil |

### 7. `landing_featured_treatments`

Satu baris per treatment unggulan.

| Kolom | Wajib | Keterangan |
| --- | --- | --- |
| `id` | Ya | ID treatment |
| `name` | Ya | Nama treatment |
| `description` | Ya | Deskripsi |
| `imageUrl` | Tidak | URL gambar |
| `sortOrder` | Tidak | Urutan tampil |

### 8. `service_list`

Satu baris per layanan detail.

Catatan:
- Sheet ini dipakai untuk halaman daftar layanan dan detail layanan.
- Seluruh katalog layanan CleverMom dimasukkan ke sheet ini.
- Boleh berbeda dari `landing_services` karena homepage hanya butuh menu ringkas.

| Kolom | Wajib | Keterangan |
| --- | --- | --- |
| `id` | Ya | ID layanan |
| `category` | Ya | Kategori katalog, contoh `Baby Treatment` |
| `title` | Ya | Nama layanan |
| `description` | Ya | Deskripsi layanan |
| `duration` | Ya | Durasi |
| `imageUrl` | Tidak | URL gambar |
| `sortOrder` | Tidak | Urutan tampil |

### 9. `about_page`

Satu baris saja.

| Kolom | Wajib | Keterangan |
| --- | --- | --- |
| `heroTitle` | Ya | Judul halaman tentang |
| `heroDescription` | Ya | Deskripsi halaman tentang |

### 10. `about_values`

Satu baris per nilai / highlight.

| Kolom | Wajib | Keterangan |
| --- | --- | --- |
| `title` | Ya | Judul nilai |
| `description` | Ya | Deskripsi nilai |
| `sortOrder` | Tidak | Urutan tampil |

### 11. `about_locations`

Satu baris per cabang.

| Kolom | Wajib | Keterangan |
| --- | --- | --- |
| `id` | Ya | ID cabang |
| `name` | Ya | Nama cabang |
| `address` | Tidak | Alamat |
| `mapUrl` | Tidak | Link Google Maps |
| `sortOrder` | Tidak | Urutan tampil |

### 12. `help_page`

Satu baris saja.

| Kolom | Wajib | Keterangan |
| --- | --- | --- |
| `heroTitle` | Ya | Judul halaman bantuan |
| `heroDescription` | Ya | Deskripsi bantuan |
| `contactTitle` | Ya | Judul CTA kontak |
| `contactDescription` | Ya | Deskripsi CTA kontak |
| `contactButtonLabel` | Ya | Label tombol kontak |
| `whatsappNumber` | Ya | Nomor WhatsApp bantuan |

### 13. `help_topics`

Satu baris per topik bantuan.

| Kolom | Wajib | Keterangan |
| --- | --- | --- |
| `id` | Ya | ID topik |
| `title` | Ya | Judul topik |
| `description` | Ya | Deskripsi topik |
| `sortOrder` | Tidak | Urutan tampil |

### 14. `member_summary`

Satu baris per member.

| Kolom | Wajib | Keterangan |
| --- | --- | --- |
| `userId` | Ya | ID user |
| `email` | Tidak | Email user |
| `name` | Tidak | Nama user |
| `memberLevel` | Tidak | Level member |
| `points` | Tidak | Poin member |

### 15. `member_menus`

Satu baris per item menu akun.

| Kolom | Wajib | Keterangan |
| --- | --- | --- |
| `key` | Ya | Key menu |
| `label` | Ya | Label menu |
| `href` | Ya | URL tujuan |
| `sortOrder` | Tidak | Urutan tampil |

## Bentuk JSON Output yang Disarankan

Apps Script paling aman mengembalikan satu JSON gabungan seperti ini:

```json
{
  "hero": {
    "logoUrl": "https://...",
    "title": "Spesialis Kebidanan",
    "subtitle": "One Stop Solution Mom and Baby Care",
    "description": "Layanan Bidan Premium No. 1 Bergaransi"
  },
  "consultation": {
    "title": "Butuh Konsultasi Online?",
    "description": "Konsultasi ibu dan bayi bersama bidan profesional, langsung dari rumah.",
    "buttonText": "Hubungi Sekarang",
    "whatsappNumber": "6281932618816"
  },
  "services": [],
  "promos": [],
  "packages": [],
  "testimonials": [],
  "featuredTreatments": [],
  "about": {
    "heroTitle": "Platform pendamping untuk ibu dan keluarga.",
    "heroDescription": "....",
    "values": [],
    "locations": []
  },
  "help": {
    "heroTitle": "Customer bisa melihat bantuan dan menghubungi tim dengan cepat.",
    "heroDescription": "...",
    "topics": [],
    "contactTitle": "Butuh bantuan langsung?",
    "contactDescription": "...",
    "contactButtonLabel": "Hubungi via WhatsApp",
    "whatsappNumber": "6281932618816"
  },
  "serviceList": [],
  "summary": {
    "memberLevel": "-",
    "points": 120
  },
  "menus": [
    {
      "key": "help",
      "label": "Bantuan",
      "href": "/menu/bantuan"
    }
  ]
}
```

## Mapping ke Loader Project

- Homepage: `app/lib/landing.ts`
- Service list: `app/services/serviceData.ts`
- About: `app/lib/about.ts`
- Help: `app/lib/help.ts`
- Profile summary: `app/menu/page.tsx`

## Catatan Implementasi Apps Script

- Untuk field array seperti `details`, simpan di sheet sebagai text dipisah karakter `|`, lalu split di Apps Script.
- Jika memakai gambar dari Google Drive, pastikan URL diubah ke direct image URL agar bisa dibaca frontend.
- Nomor WhatsApp simpan tanpa spasi, tanpa `+`, contoh: `6281932618816`.
- Tambahkan `sortOrder` jika ingin urutan stabil dari spreadsheet.

## Saran Workflow

1. Import semua file CSV template ke Google Spreadsheet.
2. Isi data sesuai kebutuhan bisnis.
3. Buat Apps Script yang membaca tiap tab dan menggabungkannya menjadi JSON.
4. Publish Apps Script sebagai web app.
5. Set `APPS_SCRIPT_URL` di `.env.local`.
