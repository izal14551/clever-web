# Template Spreadsheet Apps Script untuk CleverMom

Gunakan file [spreadsheet-template.xlsx](/c:/laragon/www/clevermom/clever-web/docs/spreadsheet-template.xlsx) sebagai template utama.

File tersebut adalah satu workbook multi-sheet. Upload langsung ke Google Sheets, lalu isi data di masing-masing tab.

## File yang Dipakai

- `docs/spreadsheet-template.xlsx` — file utama untuk di-upload ke Google Sheets.
- `docs/spreadsheet-template/apps-script-example.gs` — script paste-ready untuk Apps Script.
- `docs/spreadsheet-template/*.csv` — sumber template per sheet untuk maintenance repo.

## Sheet

Workbook berisi tab berikut:

1. `service_categories`
2. `services`
3. `promos`
4. `packages`
5. `testimonials`
6. `featured_treatments`
7. `about_values`
8. `branches`
9. `help_topics`
10. `site_content`

Header spreadsheet memakai `snake_case`, misalnya `image_url`, `sort_order`, `service_id`, dan `reaction_count`.
Apps Script akan membaca header tersebut lalu mengembalikan JSON `camelCase` agar tetap cocok dengan loader aplikasi.

## Workflow

1. Upload `docs/spreadsheet-template.xlsx` ke Google Sheets.
2. Isi atau sesuaikan data pada tiap tab.
3. Buka `Extensions -> Apps Script`.
4. Paste isi `docs/spreadsheet-template/apps-script-example.gs` ke `Code.gs`.
5. Di Apps Script, buka `Project Settings -> Script properties`.
6. Tambahkan `APPS_SCRIPT_API_KEY` dengan value yang sama seperti `.env.local`.
7. Deploy sebagai Web app.
8. Pakai URL deployment sebagai `APPS_SCRIPT_URL`.

## Mapping ke Project

- Homepage: `app/lib/landing.ts`
- Service list: `app/services/serviceData.ts`
- About: `app/lib/about.ts`
- Help: `app/lib/help.ts`
- Profile summary: `app/menu/page.tsx`

## Catatan

- Untuk field array seperti `details`, simpan sebagai teks dipisah karakter `|`.
- Jika memakai gambar dari Google Drive, aplikasi akan mencoba mengubah link menjadi direct image URL.
- Nomor WhatsApp simpan tanpa spasi dan tanpa `+`, contoh: `6281932618816`.
- Tambahkan `sort_order` jika ingin urutan tampil stabil dari spreadsheet.
