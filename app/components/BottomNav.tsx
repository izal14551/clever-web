"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Newspaper, BadgePercent, User } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
      <NavItem icon={<Home size={22} />} label="Home" href="/" active={pathname === "/"} />
      <NavItem
        icon={<Grid size={22} />}
        label="Layanan"
        href="/services"
        active={pathname.startsWith("/services")}
      />
      <NavItem
        icon={<Newspaper size={22} />}
        label="Artikel"
        href="/artikel"
        active={pathname.startsWith("/artikel")}
      />
      <NavItem
        icon={<BadgePercent size={22} />}
        label="Promo"
        href="/promo"
        active={pathname.startsWith("/promo")}
      />
      <NavItem
        icon={<User size={22} />}
        label="Akun Saya"
        href="/menu"
        active={pathname.startsWith("/menu")}
      />
    </nav>
  );
}

function NavItem({
  icon,
  label,
  href,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}) {
  const className = `flex flex-col items-center gap-1 transition-colors ${active ? "text-[#a68b6d]" : "text-gray-400 hover:text-gray-600"}`;

  if (href === "#") {
    return (
      <div className={`${className} cursor-not-allowed opacity-80`}>
        {icon}
        <span className="text-[10px] font-medium">{label}</span>
      </div>
    );
  }

  return (
    <Link href={href} className={`${className} cursor-pointer`}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
