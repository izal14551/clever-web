# Clevermom Web

Project ini menggunakan Next.js App Router, `next-auth` untuk Google OAuth, Apps Script Google Sheet API untuk beberapa data dinamis, dan Blogger API untuk artikel.

## Setup Project

### Install dependency

```bash
npm install
```

### Buat environment file

Copy `.env.example` menjadi `.env.local`, lalu isi nilainya:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-a-random-secret
BLOGGER_BLOG_ID=your-blogger-blog-id
BLOGGER_API_KEY=your-blogger-api-key
APPS_SCRIPT_URL=your-apps-script-url
```

Tips generate secret:

```bash
openssl rand -base64 32
```

### Setup Google OAuth Client

1. Buka Google Cloud Console.
2. Buat atau pilih project.
3. Buka `APIs & Services` -> `OAuth consent screen`.
4. Konfigurasikan app name, support email, dan developer contact email.
5. Buat `OAuth Client ID` dengan tipe `Web application`.
6. Tambahkan URL berikut:
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Ambil `Client ID` dan `Client Secret`, lalu isi ke `.env.local`.

### Jalankan aplikasi

```bash
npm run dev
```

Buka `http://localhost:3000`.

## Ringkasan Arsitektur Data

- Homepage, layanan, promo, profile summary, dan beberapa halaman informasi mengambil data dari Apps Script Google Sheet API.
- Artikel list dan artikel detail mengambil data dari Blogger API.
- Google OAuth ditangani oleh NextAuth.

## Status Implementasi Fitur

### 1. Homepage

Status: `Sebagian selesai`

Yang sudah tersedia:
- Search bar
- Banner / hero section
- Service menu icon
- Promo section
- Testimonial section
- Footer
- Bottom navigation bar

Catatan:
- Data utama homepage sudah menggunakan Apps Script Google Sheet API.
- Bagian `most popular service swipe card` belum menjadi blok khusus yang eksplisit.
- Beberapa CTA seperti `Lihat selengkapnya` masih perlu dipastikan route finalnya.

### 2. Service List Page

Status: `Selesai`

Keterangan:
- Customer sudah dapat melihat daftar layanan.
- Data sudah diambil secara dinamis dari Apps Script Google Sheet API.

### 3. Detail Service Page

Status: `Selesai`

Keterangan:
- Customer sudah dapat melihat detail layanan.
- Data sudah diambil secara dinamis dari Apps Script Google Sheet API.

### 4. Order Service via WhatsApp

Status: `Sebagian selesai`

Keterangan:
- Tombol WhatsApp untuk pemesanan sudah tersedia di halaman detail layanan.
- Nomor WhatsApp masih hardcoded dan belum sepenuhnya dinamis dari Apps Script.

### 5. Share Service Link

Status: `Belum sesuai requirement`

Keterangan:
- Saat ini fitur share masih menggunakan Web Share API atau fallback copy link.
- Belum tersedia tombol share spesifik ke:
  - WhatsApp
  - Facebook
  - Instagram
  - TikTok

### 6. Login via Google OAuth

Status: `Selesai`

Keterangan:
- Konfigurasi Google Provider di NextAuth sudah tersedia.
- Route auth dan tombol login sudah tersedia.
- Integrasi ke Google Cloud Platform masih perlu dikonfigurasi penuh di environment dan OAuth Client.

### 7. Profile Page

Status: `Selesai`

Keterangan:
- Customer sudah dapat melihat profile page.
- Data summary profile sudah diambil dari Apps Script Google Sheet API.

### 8. Search Page

Status: `Selesai`

Keterangan:
- Customer sudah dapat membuka halaman pencarian dari homepage.
- Halaman search sudah menampilkan:
  - recent searches
  - keyword suggestions
  - rekomendasi konten
  - hasil pencarian

Catatan:
- Search menggunakan gabungan data Apps Script, Blogger API, dan data turunan internal.

### 9. Search Result Page

Status: `Sebagian selesai`

Keterangan:
- Hasil pencarian sudah tampil di halaman `/search`.
- Belum dipisahkan menjadi route hasil pencarian khusus jika requirement membutuhkan halaman result terpisah.

### 10. Tentang CleverMom Page

Status: `Selesai`

Keterangan:
- Halaman tentang CleverMom sudah tersedia.
- Data sudah diambil secara dinamis dari Apps Script Google Sheet API.

### 11. Syarat dan Ketentuan Page

Status: `Belum selesai`

Keterangan:
- Halaman sudah tersedia.
- Konten masih hardcoded.
- Belum menggunakan Apps Script Google Sheet API.

### 12. Bantuan Page

Status: `Belum selesai`

Keterangan:
- Halaman sudah tersedia.
- Konten bantuan utama masih hardcoded.
- Hanya kontak WhatsApp yang memanfaatkan data landing.
- Belum sepenuhnya dinamis dari Apps Script Google Sheet API.

### 13. Promo Page

Status: `Selesai`

Keterangan:
- Customer sudah dapat melihat daftar promo.
- Data promo sudah menggunakan Apps Script Google Sheet API.

### 14. Layanan Selengkapnya

Status: `Sebagian selesai`

Keterangan:
- Struktur halaman layanan sudah tersedia.
- Beberapa tombol `lihat selengkapnya` di homepage belum seluruhnya dipastikan terhubung sesuai requirement final.

### 15. List Artikel

Status: `Selesai`

Keterangan:
- Customer sudah dapat melihat daftar artikel.
- Data menggunakan API dari Blogger platform.

### 16. Read Artikel

Status: `Selesai`

Keterangan:
- Customer sudah dapat membaca detail artikel.
- Data menggunakan API dari Blogger platform.

## Ringkasan Status

### Selesai

- Service list
- Service detail
- Profile page
- Tentang CleverMom
- Promo page
- List artikel
- Detail artikel
- Search page dasar

### Sebagian selesai

- Homepage
- Order via WhatsApp
- Google OAuth
- Search result flow
- Layanan selengkapnya

### Belum selesai atau belum sesuai requirement

- Share ke platform sosial spesifik
- Bantuan dinamis dari Apps Script
- Syarat dan ketentuan dinamis dari Apps Script

## Prioritas Implementasi Berikutnya

1. Menyelesaikan integrasi Google OAuth ke Google Cloud Platform.
2. Menjadikan nomor WhatsApp order sebagai data dinamis.
3. Membuat halaman Bantuan dinamis dari Apps Script.
4. Membuat halaman Syarat & Ketentuan dinamis dari Apps Script.
5. Menambahkan share service ke WhatsApp, Facebook, Instagram, dan TikTok.
6. Merapikan blok homepage `most popular service` dan CTA `lihat selengkapnya`.

## Referensi Lokasi Implementasi

- Auth config: `app/lib/auth.ts`
- NextAuth route: `app/api/auth/[...nextauth]/route.ts`
- Login page: `app/login/page.tsx`
- Landing data loader: `app/lib/landing.ts`
- Services data loader: `app/services/serviceData.ts`
- About data loader: `app/lib/about.ts`
- Artikel source: `app/lib/blogger.ts`

