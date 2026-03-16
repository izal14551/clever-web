import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ChevronRight, Star, CircleHelp, CircleUserRound, Settings } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { LogoutButton } from "../components/LogoutButton";
import { mockMenuData } from "../data/mockMenuData";
import { buildAppsScriptUrl } from "../lib/appsScript";
import { authOptions } from "../lib/auth";
import type { AccountMenuData, MenuItem } from "../types/menu";

const defaultMenuOrder: MenuItem[] = [
  { key: "help", label: "Bantuan", href: "/menu/bantuan" },
  { key: "about", label: "Tentang clevermom.id", href: "/menu/about" },
  { key: "terms", label: "Syarat & ketentuan", href: "/menu/terms" },
];

function normalizeMenuData(input: unknown): AccountMenuData {
  if (!input || typeof input !== "object") {
    return mockMenuData;
  }

  const raw = input as Record<string, unknown>;
  const summarySource =
    (raw.summary as Record<string, unknown> | undefined) ?? raw;

  const memberLevel =
    typeof summarySource.memberLevel === "string" && summarySource.memberLevel.trim()
      ? summarySource.memberLevel
      : mockMenuData.summary.memberLevel;

  const pointsRaw = summarySource.points;
  const points =
    typeof pointsRaw === "number"
      ? pointsRaw
      : typeof pointsRaw === "string"
        ? Number(pointsRaw) || mockMenuData.summary.points
        : mockMenuData.summary.points;

  const menusRaw = Array.isArray(raw.menus) ? raw.menus : defaultMenuOrder;
  const menus = menusRaw
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return defaultMenuOrder[index] ?? null;
      }

      const row = item as Record<string, unknown>;
      const key = typeof row.key === "string" ? row.key : `menu_${index + 1}`;
      const label = typeof row.label === "string" ? row.label : "";
      const rawHref = typeof row.href === "string" ? row.href : "#";
      const href =
        key === "help" && rawHref === "#"
            ? "/menu/bantuan"
            : rawHref;
      if (!label) return null;

      return { key, label, href };
    })
    .filter((v): v is MenuItem => v !== null)
    .filter((menu) => menu.key !== "settings")
    .filter((menu) => menu.key !== "member_level" && menu.key !== "points");

  return {
    summary: { memberLevel, points },
    menus: menus.length > 0 ? menus : defaultMenuOrder,
  };
}

async function getMenuData(params?: {
  userId?: string;
  email?: string | null;
}): Promise<AccountMenuData> {
  const url = buildAppsScriptUrl({
    action: "getMemberSummary",
    userId: params?.userId,
    email: params?.email,
  });

  if (!url) {
    return normalizeMenuData(mockMenuData);
  }

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return normalizeMenuData(mockMenuData);
    }

    const rawData: unknown = await res.json();
    return normalizeMenuData(rawData);
  } catch {
    return normalizeMenuData(mockMenuData);
  }
}

function getMenuIcon(key: string) {
  if (key === "member_level") return <Star size={18} className="text-[#a68b6d]" />;
  if (key === "points") return <CircleUserRound size={18} className="text-[#a68b6d]" />;
  if (key === "settings") return <Settings size={18} className="text-[#a68b6d]" />;
  return <CircleHelp size={18} className="text-[#a68b6d]" />;
}

export default async function MenuPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const data = await getMenuData({
    userId: session.user?.id,
    email: session.user?.email,
  });

  return (
    <main className="max-w-md mx-auto bg-white min-h-screen pb-24 font-sans shadow-md relative">
      <section className="bg-gradient-to-b from-orange-50 to-orange-100 pt-10 pb-17 px-6 rounded-b-[32px]">
        <div className="flex items-center gap-4">
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user?.name || "Profile user"}
              className="h-20 w-20 rounded-full object-cover border-2 border-white shadow-sm"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-[#d9c2a7] text-lg font-bold text-white shadow-sm">
              {(session.user?.name?.charAt(0) || "M").toUpperCase()}
            </div>
          )}

          <div>
            <p className="text-xs text-[#7a6a57] mb-1">Profile User</p>
            <h1 className="text-2xl font-extrabold text-[#1f1f1f]">
              Hai, {session.user?.name?.split(" ")[0] ?? "Mom"}
            </h1>
            <p className="text-sm text-[#6f6255] mt-2">
              Kelola profile, membership, dan informasi akun kamu di sini.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 -mt-13 mb-6">
        <div className="bg-white rounded-2xl border border-orange-100 p-4 shadow-sm">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Tingkat member</span>
            <span className="font-semibold text-[#1f1f1f]">-</span>
          </div>
          <div className="h-px bg-gray-100 my-3" />
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Point kamu</span>
            <span className="font-semibold text-[#1f1f1f]">-</span>
          </div>
        </div>
      </section>

      <section className="px-6">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {data.menus.map((menu) => (
            <Link
              key={menu.key}
              href={menu.href}
              className="h-14 px-4 flex items-center justify-between border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getMenuIcon(menu.key)}
                <span className="text-sm font-medium text-[#1f1f1f]">{menu.label}</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 mt-6">
        <LogoutButton />
      </section>

      <BottomNav />
    </main>
  );
}
