# UAT Checklist Clevermom Web

Dokumen ini digunakan untuk membantu proses User Acceptance Testing pada website CleverMom.

## Informasi Umum

- Project: Clevermom Web
- Environment:
- Tester:
- Tanggal Testing:
- Versi Build:

## Status Acuan

Gunakan salah satu status berikut saat pengujian:

- `Pass`
- `Fail`
- `Partial`
- `Not Tested`

## 1. Homepage

| No | Skenario Uji | Expected Result | Status | Catatan |
| --- | --- | --- | --- | --- |
| 1.1 | Customer membuka homepage | Homepage tampil tanpa error |  |  |
| 1.2 | Search bar ditampilkan | Search bar terlihat di bagian atas homepage |  |  |
| 1.3 | Customer klik search bar | User diarahkan ke halaman search |  |  |
| 1.4 | Banner / hero tampil | Banner tampil dengan konten utama |  |  |
| 1.5 | Icon menu layanan tampil | Semua icon menu layanan tampil |  |  |
| 1.6 | Section promo tampil | Promo tampil di homepage |  |  |
| 1.7 | Section testimonial tampil | Testimonial tampil di homepage |  |  |
| 1.8 | Footer tampil | Footer homepage tampil lengkap |  |  |
| 1.9 | Bottom navigation tampil | Bottom bar tampil dan dapat diklik |  |  |
| 1.10 | Data homepage berasal dari source dinamis | Konten homepage mengikuti Apps Script Google Sheet API |  |  |

## 2. Service List Page

| No | Skenario Uji | Expected Result | Status | Catatan |
| --- | --- | --- | --- | --- |
| 2.1 | Customer membuka halaman layanan | Daftar layanan tampil tanpa error |  |  |
| 2.2 | Data layanan tampil dinamis | Data layanan sesuai dengan Apps Script Google Sheet API |  |  |
| 2.3 | Customer klik salah satu layanan | User diarahkan ke halaman detail layanan |  |  |

## 3. Detail Service Page

| No | Skenario Uji | Expected Result | Status | Catatan |
| --- | --- | --- | --- | --- |
| 3.1 | Customer membuka detail layanan | Detail layanan tampil tanpa error |  |  |
| 3.2 | Informasi layanan tampil lengkap | Judul, deskripsi, durasi, dan gambar tampil |  |  |
| 3.3 | Data detail layanan dinamis | Data sesuai dengan Apps Script Google Sheet API |  |  |

## 4. Order via WhatsApp

| No | Skenario Uji | Expected Result | Status | Catatan |
| --- | --- | --- | --- | --- |
| 4.1 | Customer klik tombol WhatsApp di detail layanan | User diarahkan ke WhatsApp |  |  |
| 4.2 | Pesan otomatis terisi | Pesan awal sesuai layanan yang dipilih |  |  |
| 4.3 | Nomor WhatsApp yang digunakan benar | Nomor tujuan sesuai kebutuhan bisnis |  |  |

## 5. Share Service Link

| No | Skenario Uji | Expected Result | Status | Catatan |
| --- | --- | --- | --- | --- |
| 5.1 | Customer klik tombol share layanan | Muncul aksi share |  |  |
| 5.2 | Share ke WhatsApp tersedia | User dapat membagikan ke WhatsApp |  |  |
| 5.3 | Share ke Facebook tersedia | User dapat membagikan ke Facebook |  |  |
| 5.4 | Share ke Instagram tersedia | User dapat membagikan ke Instagram atau mekanisme yang disepakati |  |  |
| 5.5 | Share ke TikTok tersedia | User dapat membagikan ke TikTok atau mekanisme yang disepakati |  |  |

## 6. Login via Google OAuth

| No | Skenario Uji | Expected Result | Status | Catatan |
| --- | --- | --- | --- | --- |
| 6.1 | Customer membuka halaman login | Halaman login tampil tanpa error |  |  |
| 6.2 | Customer klik tombol login Google | User diarahkan ke Google OAuth consent screen |  |  |
| 6.3 | Customer login dengan akun Google valid | Login berhasil dan user kembali ke app |  |  |
| 6.4 | Session user tersimpan | User tetap terautentikasi setelah login |  |  |

## 7. Profile Page

| No | Skenario Uji | Expected Result | Status | Catatan |
| --- | --- | --- | --- | --- |
| 7.1 | Customer membuka profile page setelah login | Halaman profile tampil tanpa error |  |  |
| 7.2 | Summary profile tampil | Nama, email, atau summary member tampil sesuai data |  |  |
| 7.3 | Data profile dinamis | Data profile sesuai Apps Script Google Sheet API |  |  |

## 8. Search Page

| No | Skenario Uji | Expected Result | Status | Catatan |
| --- | --- | --- | --- | --- |
| 8.1 | Customer membuka halaman search | Halaman search tampil tanpa error |  |  |
| 8.2 | Riwayat pencarian tampil | Recent search tampil jika tersedia |  |  |
| 8.3 | Kata kunci rekomendasi tampil | Rekomendasi kata kunci tampil |  |  |
| 8.4 | Rekomendasi konten tampil | Daftar rekomendasi tampil tanpa error |  |  |

## 9. Search Result

| No | Skenario Uji | Expected Result | Status | Catatan |
| --- | --- | --- | --- | --- |
| 9.1 | Customer mengetik kata kunci lalu submit | Hasil pencarian tampil |  |  |
| 9.2 | Hasil relevan terhadap kata kunci | Konten yang tampil sesuai input pencarian |  |  |
| 9.3 | Hasil dapat diklik | User dapat membuka halaman detail dari hasil pencarian |  |  |
| 9.4 | Search result memanfaatkan source data yang benar | Data hasil berasal dari source aplikasi yang disepakati |  |  |

## 10. Tentang CleverMom

| No | Skenario Uji | Expected Result | Status | Catatan |
| --- | --- | --- | --- | --- |
| 10.1 | Customer membuka halaman Tentang CleverMom | Halaman tampil tanpa error |  |  |
| 10.2 | Konten tentang tampil lengkap | Judul, deskripsi, nilai, dan lokasi tampil |  |  |
| 10.3 | Data tentang dinamis | Data sesuai Apps Script Google Sheet API |  |  |

## 11. Syarat dan Ketentuan

| No | Skenario Uji | Expected Result | Status | Catatan |
| --- | --- | --- | --- | --- |
| 11.1 | Customer membuka halaman Syarat & Ketentuan | Halaman tampil tanpa error |  |  |
| 11.2 | Konten syarat dan ketentuan tampil | Semua poin tampil dengan benar |  |  |
| 11.3 | Data syarat dan ketentuan dinamis | Data sesuai Apps Script Google Sheet API |  |  |

## 12. Bantuan

| No | Skenario Uji | Expected Result | Status | Catatan |
| --- | --- | --- | --- | --- |
| 12.1 | Customer membuka halaman Bantuan | Halaman tampil tanpa error |  |  |
| 12.2 | Topik bantuan tampil | Konten bantuan tampil lengkap |  |  |
| 12.3 | Tombol WhatsApp bantuan berfungsi | User dapat menghubungi admin |  |  |
| 12.4 | Data bantuan dinamis | Data sesuai Apps Script Google Sheet API |  |  |

## 13. Promo Page

| No | Skenario Uji | Expected Result | Status | Catatan |
| --- | --- | --- | --- | --- |
| 13.1 | Customer membuka halaman promo | Halaman promo tampil tanpa error |  |  |
| 13.2 | Semua promo tersedia tampil | Semua promo yang aktif tampil |  |  |
| 13.3 | Data promo dinamis | Data sesuai Apps Script Google Sheet API |  |  |

## 14. Layanan Selengkapnya

| No | Skenario Uji | Expected Result | Status | Catatan |
| --- | --- | --- | --- | --- |
| 14.1 | Customer klik CTA layanan selengkapnya dari homepage | User diarahkan ke halaman yang benar |  |  |
| 14.2 | Halaman tujuan tampil | Halaman layanan tampil sesuai kebutuhan |  |  |

## 15. Artikel List

| No | Skenario Uji | Expected Result | Status | Catatan |
| --- | --- | --- | --- | --- |
| 15.1 | Customer membuka halaman artikel | Daftar artikel tampil tanpa error |  |  |
| 15.2 | Artikel diambil dari Blogger API | Konten artikel sesuai source Blogger |  |  |
| 15.3 | Customer klik artikel | User diarahkan ke halaman detail artikel |  |  |

## 16. Read Artikel

| No | Skenario Uji | Expected Result | Status | Catatan |
| --- | --- | --- | --- | --- |
| 16.1 | Customer membuka detail artikel | Detail artikel tampil tanpa error |  |  |
| 16.2 | Konten artikel terbaca dengan baik | Judul, tanggal, gambar, dan isi artikel tampil |  |  |
| 16.3 | Detail artikel berasal dari Blogger API | Data sesuai source Blogger |  |  |

## Temuan UAT

Gunakan section ini untuk mencatat issue utama yang ditemukan saat testing.

| No | Halaman / Fitur | Deskripsi Temuan | Severity | Status |
| --- | --- | --- | --- | --- |
| 1 |  |  |  |  |
| 2 |  |  |  |  |
| 3 |  |  |  |  |

## Catatan Akhir

- Approval UAT:
- Disetujui oleh:
- Tanggal:

