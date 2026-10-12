export const NAVBAR_MENUS = [
  { menuKey: "HOME", label: "Kezdőlap", url: "/" },
  { menuKey: "SUCCESSES", label: "Sikereink", url: null },
  { menuKey: "ACTUALITY", label: "Aktuális", url: "/aktualis" },
  { menuKey: "EDUCATION", label: "Oktatás", url: "/oktatas" },
  { menuKey: "ABOUT", label: "Iskolánkról", url: "/iskolank" },
  { menuKey: "GALLERY", label: "Galéria", url: "/galeria" },
  { menuKey: "CONTACT", label: "Kapcsolat", url: "/kapcsolat" },
];

export const DYNAMIC_NAVBAR_MENU_KEY = "NAVBAR_ROOTS";

export const NAVBAR_MENU_KEYS = [
  ...NAVBAR_MENUS.map(({ menuKey }) => menuKey),
  DYNAMIC_NAVBAR_MENU_KEY,
];
