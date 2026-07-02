/**
 * Konversi URL default Google Drive (view link) menjadi direct image link
 * agar bisa ditampilkan langsung di tag <img> atau komponen <Image> Next.js.
 */
export function getDirectImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;

  // Cek apakah ini URL dari Google Drive
  if (url.includes("drive.google.com")) {
    // Ekstrak ID dari pola /file/d/ID/view
    const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch && fileMatch[1]) {
      return `https://drive.google.com/uc?export=view&id=${fileMatch[1]}`;
    }

    // Ekstrak ID dari pola /open?id=ID atau ekspor view yg sdh ada (buat aman)
    const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      // Pastikan bukan url yang sudah berbentuk uc?export=view&id=...
      if (!url.includes("uc?export=view")) {
        return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
      }
    }
  }

  // Jika bukan URL Google Drive atau pola tidak cocok, kembalikan URL aslinya
  return url;
}
