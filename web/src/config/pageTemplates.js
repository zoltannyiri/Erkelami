export const PAGE_TEMPLATE_OPTIONS = [
  {
    key: "EMPTY",
    name: "Üres oldal",
    description: "Tiszta oldal, amelyhez később egyenként adhatsz blokkokat.",
    previewSections: [],
  },
  {
    key: "SIMPLE_INFO",
    name: "Egyszerű információs oldal",
    description: "Szöveges információkhoz, szabályzatokhoz és általános tartalmakhoz.",
    previewSections: ["TEXT", "TEXT"],
  },
  {
    key: "INTRODUCTION",
    name: "Bemutatkozó oldal",
    description: "Bemutatkozáshoz, történethez és képes-szöveges tartalmakhoz.",
    previewSections: ["TEXT", "TEXT_IMAGE", "TEXT_IMAGE_REVERSED"],
  },
  {
    key: "DEPARTMENT",
    name: "Tanszak oldal",
    description: "Hangszeres tanszakok, oktatók és képzések bemutatásához.",
    previewSections: ["TEXT", "TEXT_IMAGE", "CARD_GRID"],
  },
  {
    key: "NEWS_EVENT",
    name: "Hír / esemény oldal",
    description: "Koncertekhez, eseményekhez, hírekhez és beszámolókhoz.",
    previewSections: ["IMAGE", "TEXT", "GALLERY"],
  },
  {
    key: "LANDING",
    name: "Kiemelt oldal",
    description: "Nagyobb, vizuálisan hangsúlyos tartalmakhoz.",
    previewSections: ["HERO", "TEXT", "CARD_GRID", "CTA"],
  },
];
