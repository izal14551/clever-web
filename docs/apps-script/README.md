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

### `POST /exec`

Untuk mengambil member summary secara privat:

Mengembalikan:

```json
{
  "action": "getMemberSummary",
  "apiKey": "your-shared-secret",
  "userId": "google-user-id",
  "email": "mom@example.com"
}
```

Response:

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
  "apiKey": "your-shared-secret",
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
  "apiKey": "your-shared-secret",
  "userId": "google-user-id",
  "email": "mom@example.com",
  "name": "Mom Baru",
  "updatedAt": "2026-03-16T10:00:00.000Z"
}
```

Untuk komentar layanan, web memakai action privat berikut:

```json
{
  "action": "getServiceComments",
  "apiKey": "your-shared-secret",
  "serviceId": "baby-spa",
  "viewerUserId": "google-user-id"
}
```

```json
{
  "action": "getAllServiceComments",
  "apiKey": "your-shared-secret"
}
```

```json
{
  "action": "addServiceComment",
  "apiKey": "your-shared-secret",
  "comment": {
    "id": "uuid",
    "serviceId": "baby-spa",
    "author": "Anonymous",
    "message": "Layanannya nyaman.",
    "createdAt": "2026-04-30T10:00:00.000Z",
    "userId": "google-user-id",
    "authorMode": "anonymous",
    "likeCount": 0,
    "likedByCurrentUser": false
  }
}
```

Untuk like komentar layanan, web memakai action berikut. Action ini idempotent: jika akun yang sama sudah pernah like komentar yang sama, jumlah like tidak bertambah lagi.

```json
{
  "action": "addServiceCommentLike",
  "apiKey": "your-shared-secret",
  "commentId": "uuid-komentar",
  "userId": "google-user-id"
}
```

## Cara Pakai

1. Buat Google Spreadsheet dan import semua CSV di folder `docs/sheet-templates`.
2. Buka `Extensions` -> `Apps Script`.
3. Copy isi [Code.gs](/c:/laragon/www/clevermom/clever-web/docs/apps-script/Code.gs) ke editor Apps Script.
4. Simpan project.
5. Klik `Deploy` -> `New deployment`.
6. Pilih type `Web app`.
7. Tambahkan Script Property:
   - Key: `APPS_SCRIPT_API_KEY`
   - Value: secret yang sama dengan `APPS_SCRIPT_API_KEY` di `.env.local`
8. Set:
   - Execute as: `Me`
   - Who has access: `Anyone`
9. Copy URL deployment.
10. Set URL itu ke `APPS_SCRIPT_URL` pada `.env.local`.
11. Set `APPS_SCRIPT_API_KEY` pada `.env.local`.

## Catatan

- Jika struktur sheet berubah, update nama tab di konstanta `SHEETS`.
- Jika ingin menambah endpoint lain, tambahkan cabang di `doGet()` atau `doPost()`.
- Untuk field array seperti `details`, gunakan pemisah `|` di spreadsheet.
- `GET /exec` dibiarkan publik hanya untuk konten website yang memang public.
- Semua action member dan komentar layanan wajib lewat `POST` + `apiKey`.
