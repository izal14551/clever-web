import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Jika memakai gambar dr Google Photos/Drive langsung
      },
      {
        protocol: "https",
        hostname: "**", // ⚠️ (Opsional) Mengizinkan SEMUA URL https (Gunakan dengan hati-hati)
      },
    ],
  },
};

export default nextConfig;
