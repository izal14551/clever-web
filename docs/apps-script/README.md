# Google Apps Script Template

Folder ini berisi template Google Apps Script untuk membaca Google Spreadsheet CleverMom dan mengembalikan JSON yang cocok dengan project web.

## File

- [Code.gs](/c:/laragon/www/clevermom/clever-web/docs/apps-script/Code.gs)

## Fungsi yang Didukung

### `GET /exec`

Mengembalikan payload gabungan untuk:

- landing page
- service list
- about page
- help page

### `GET /exec?action=getMemberSummary&userId=...&email=...`

Mengembalikan:

```json
{
  "summary": {
    "memberLevel": "-",
    "points": 120
  },
  "menus": []
}
```

### `POST /exec`

Untuk sinkronisasi member saat login Google:

```json
{
  "action": "upsertMember",
  "userId": "google-user-id",
  "name": "Mom Example",
  "email": "mom@example.com",
  "image": "https://...",
  "lastLoginAt": "2026-03-15T10:00:00.000Z"
}
```

Atau untuk update username:

```json
{
  "action": "updateMemberName",
  "userId": "google-user-id",
  "email": "mom@example.com",
  "name": "Mom Baru",
  "updatedAt": "2026-03-16T10:00:00.000Z"
}
```

## Cara Pakai

1. Buat Google Spreadsheet dan import semua CSV di folder `docs/sheet-templates`.
2. Buka `Extensions` -> `Apps Script`.
3. Copy isi [Code.gs](/c:/laragon/www/clevermom/clever-web/docs/apps-script/Code.gs) ke editor Apps Script.
4. Simpan project.
5. Klik `Deploy` -> `New deployment`.
6. Pilih type `Web app`.
7. Set:
   - Execute as: `Me`
   - Who has access: `Anyone`
8. Copy URL deployment.
9. Set URL itu ke `APPS_SCRIPT_URL` pada `.env.local`.

## Catatan

- Jika struktur sheet berubah, update nama tab di konstanta `SHEETS`.
- Jika ingin menambah endpoint lain, tambahkan cabang di `doGet()` atau `doPost()`.
- Untuk field array seperti `details`, gunakan pemisah `|` di spreadsheet.
