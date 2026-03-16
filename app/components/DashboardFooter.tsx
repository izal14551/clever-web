"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  MessageCircleHeart,
  Music2,
  Send,
  Youtube,
} from "lucide-react";

const footerLinks = [
  { label: "Tentang CleverMom", href: "/menu/about" },
  { label: "Syarat & Ketentuan", href: "/menu/terms" },
  { label: "Pusat Bantuan", href: "/menu/bantuan" },
];

const socialLinks = [
  { label: "Facebook", href: "#", icon: Facebook },
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "YouTube", href: "#", icon: Youtube },
  { label: "TikTok", href: "#", icon: Music2 },
  { label: "LinkedIn", href: "#", icon: Linkedin },
  { label: "Telegram", href: "#", icon: Send },
  { label: "Community", href: "#", icon: MessageCircleHeart },
];

export function DashboardFooter() {
  return (
    <footer className="border-t border-[#efe3d5] bg-[#fffaf5] px-6 pb-13 pt-8 text-center">
      <p className="mx-auto max-w-[320px] text-sm leading-7 text-[#6f6255]">
        CleverMom hadir mendampingi Mom dan si kecil dengan layanan ibu dan bayi
        yang hangat, profesional, dan nyaman langsung dari rumah sejak 2013.
      </p>

      <div className="my-6 h-px bg-[#eadfce]" />

      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm text-[#6f6255]">
        {footerLinks.map((link, index) => (
          <span key={link.href} className="inline-flex items-center">
            <Link href={link.href} className="transition-colors hover:text-[#a68b6d]">
              {link.label}
            </Link>
            {index < footerLinks.length - 1 ? (
              <span className="ml-2 text-[#c7b39c]">|</span>
            ) : null}
          </span>
        ))}
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        {socialLinks.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f2ebe3] text-[#6f6255] transition-colors hover:bg-[#e7d9c7] hover:text-[#8e7357]"
            >
              <Icon size={20} strokeWidth={2} />
            </a>
          );
        })}
      </div>

      <p className="mt-8 text-sm text-[#6f6255]">
        Copyright © 2026 CleverMom. All Rights Reserved
      </p>
    </footer>
  );
}
