export const NAVBAR_MENUS = [
  { menuKey: "HOME", label: "Kezdőlap", url: "/" },
  { menuKey: "SUCCESSES", label: "Sikereink", url: null },
  { menuKey: "ACTUALITY", label: "Aktuális", url: "/aktualis" },
  { menuKey: "CALENDAR", label: "Naptár", url: "/naptar" },
  { menuKey: "ABOUT", label: "Iskolánkról", url: "/iskolank" },
  { menuKey: "GALLERY", label: "Galéria", url: "/galeria" },
  { menuKey: "DOCUMENTS", label: "Dokumentumok", url: "/dokumentumok" },
  { menuKey: "FOUNDATION", label: "Alapítvány", url: "/alapitvany" },
  { menuKey: "LINKS", label: "Linkek", url: "/linkek" },
  { menuKey: "CONTACT", label: "Kapcsolat", url: "/kapcsolat" },
];

export const DYNAMIC_NAVBAR_MENU_KEY = "NAVBAR_ROOTS";

export const NAVIGATION_MENU_GROUPS = [
  ...NAVBAR_MENUS,
  {
    menuKey: DYNAMIC_NAVBAR_MENU_KEY,
    label: "Egyedi főmenüpontok",
    url: null,
  },
];

export const getNavbarMenu = (menuKey) =>
  NAVBAR_MENUS.find((menu) => menu.menuKey === menuKey);

export const getNavigationGroupLabel = (menuKey) =>
  NAVIGATION_MENU_GROUPS.find((menu) => menu.menuKey === menuKey)?.label ||
  (menuKey === "TOP_LEVEL" ? "Korábbi fő navigáció" : menuKey);

export const isFixedNavbarMenu = (menuKey) =>
  NAVBAR_MENUS.some((menu) => menu.menuKey === menuKey);

export const isDynamicNavbarMenu = (menuKey) =>
  menuKey === DYNAMIC_NAVBAR_MENU_KEY;
