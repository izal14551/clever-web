import type { AccountMenuData } from "../types/menu";

export const mockMenuData: AccountMenuData = {
  summary: {
    memberLevel: "-",
    points: 120,
  },
  menus: [
    {
      key: "help",
      label: "Bantuan",
      href: "/menu/bantuan",
    },
    {
      key: "about",
      label: "Tentang clevermom.id",
      href: "/menu/about",
    },
    {
      key: "terms",
      label: "Syarat & ketentuan",
      href: "/menu/terms",
    },
  ],
};
