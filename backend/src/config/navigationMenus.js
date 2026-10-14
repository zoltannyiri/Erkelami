export const NAVBAR_MENUS = [
  { menuKey: "HOME", label: "Kezdőlap", url: "/" },
  { menuKey: "SUCCESSES", label: "Sikereink", url: null },
  { menuKey: "ACTUALITY", label: "Aktuális", url: "/aktualis" },
  { menuKey: "ABOUT", label: "Iskolánkról", url: "/iskolank" },
  { menuKey: "GALLERY", label: "Galéria", url: "/galeria" },
  { menuKey: "DOCUMENTS", label: "Dokumentumok", url: "/dokumentumok" },
  { menuKey: "FOUNDATION", label: "Alapítvány", url: "/alapitvany" },
  { menuKey: "LINKS", label: "Linkek", url: "/linkek" },
  { menuKey: "CONTACT", label: "Kapcsolat", url: "/kapcsolat" },
];

export const DYNAMIC_NAVBAR_MENU_KEY = "NAVBAR_ROOTS";

export const NAVBAR_MENU_KEYS = [
  ...NAVBAR_MENUS.map(({ menuKey }) => menuKey),
  DYNAMIC_NAVBAR_MENU_KEY,
];
