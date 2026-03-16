export interface AccountSummary {
  memberLevel: string;
  points: number;
}

export interface MenuItem {
  key: string;
  label: string;
  href: string;
}

export interface AccountMenuData {
  summary: AccountSummary;
  menus: MenuItem[];
}
