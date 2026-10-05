export const SECTION_STYLE_OPTIONS = {
  background: [
    { value: "white", label: "Fehér" },
    { value: "soft", label: "Lágy" },
    { value: "muted", label: "Tompa" },
    { value: "dark", label: "Sötét" },
    { value: "accent", label: "Kiemelt" },
  ],
  width: [
    { value: "narrow", label: "Keskeny" },
    { value: "normal", label: "Normál" },
    { value: "wide", label: "Széles" },
    { value: "full", label: "Teljes szélesség" },
  ],
  spacing: [
    { value: "compact", label: "Kompakt" },
    { value: "normal", label: "Normál" },
    { value: "large", label: "Nagy" },
    { value: "extraLarge", label: "Extra nagy" },
  ],
  textAlign: [
    { value: "left", label: "Balra" },
    { value: "center", label: "Középre" },
  ],
};

export const DEFAULT_SECTION_STYLE = {
  background: "white",
  width: "normal",
  spacing: "normal",
  textAlign: "left",
};

export const SECTION_STYLE_DEFAULTS_BY_TYPE = {
  TEXT: { background: "white", width: "narrow", spacing: "normal", textAlign: "left" },
  IMAGE: { background: "white", width: "wide", spacing: "compact", textAlign: "left" },
  TEXT_IMAGE: { background: "soft", width: "wide", spacing: "normal", textAlign: "left" },
  CARD_GRID: { background: "soft", width: "wide", spacing: "normal", textAlign: "left" },
  GALLERY: { background: "white", width: "wide", spacing: "normal", textAlign: "left" },
  HERO: { background: "dark", width: "full", spacing: "compact", textAlign: "left" },
  CTA: { background: "white", width: "wide", spacing: "normal", textAlign: "left" },
  DOWNLOADS: { background: "soft", width: "normal", spacing: "normal", textAlign: "left" },
};

const sectionClasses = {
  background: {
    white: "bg-[#fffefa]",
    soft: "bg-stone-50/80",
    muted: "bg-slate-100/75",
    dark: "bg-slate-950 text-white",
    accent: "bg-amber-50/70",
  },
  width: {
    narrow: "max-w-3xl",
    normal: "max-w-5xl",
    wide: "max-w-7xl",
    full: "max-w-none",
  },
  spacing: {
    compact: "py-5 sm:py-7",
    normal: "py-8 sm:py-10",
    large: "py-11 sm:py-14",
    extraLarge: "py-14 sm:py-20",
  },
  textAlign: {
    left: "text-left",
    center: "text-center",
  },
};

export const IMAGE_STYLE_OPTIONS = {
  aspectRatio: [
    { value: "auto", label: "Automatikus" },
    { value: "16:9", label: "16:9" },
    { value: "4:3", label: "4:3" },
    { value: "3:2", label: "3:2" },
    { value: "1:1", label: "1:1" },
  ],
  height: [
    { value: "auto", label: "Automatikus" },
    { value: "small", label: "Kicsi" },
    { value: "medium", label: "Közepes" },
    { value: "large", label: "Nagy" },
  ],
  fit: [
    { value: "cover", label: "Kitöltés" },
    { value: "contain", label: "Illesztés" },
  ],
  position: [
    { value: "left", label: "Bal" },
    { value: "center", label: "Közép" },
    { value: "right", label: "Jobb" },
  ],
  radius: [
    { value: "none", label: "Nincs" },
    { value: "small", label: "Kicsi" },
    { value: "medium", label: "Közepes" },
    { value: "large", label: "Nagy" },
  ],
  width: [
    { value: "narrow", label: "Keskeny" },
    { value: "normal", label: "Normál" },
    { value: "wide", label: "Széles" },
    { value: "full", label: "Teljes" },
  ],
};

export const DEFAULT_IMAGE_STYLE = {
  aspectRatio: "16:9",
  height: "medium",
  fit: "cover",
  position: "center",
  radius: "medium",
  width: "full",
};

const imageClasses = {
  aspectRatio: {
    auto: "aspect-auto",
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
    "3:2": "aspect-[3/2]",
    "1:1": "aspect-square",
  },
  height: {
    auto: "max-h-none",
    small: "max-h-64",
    medium: "max-h-[28rem]",
    large: "max-h-[38rem]",
  },
  fit: {
    cover: "object-cover",
    contain: "object-contain",
  },
  position: {
    left: "object-left",
    center: "object-center",
    right: "object-right",
  },
  radius: {
    none: "rounded-none",
    small: "rounded-sm",
    medium: "rounded-xl",
    large: "rounded-3xl",
  },
  width: {
    narrow: "max-w-2xl",
    normal: "max-w-4xl",
    wide: "max-w-6xl",
    full: "max-w-none",
  },
};

function safeToken(value, mapping, fallback) {
  return Object.hasOwn(mapping, value) ? value : fallback;
}

export function resolveSectionStyle(style = {}, defaults = {}) {
  const merged = { ...DEFAULT_SECTION_STYLE, ...defaults, ...(style || {}) };

  return {
    background: safeToken(merged.background, sectionClasses.background, "white"),
    width: safeToken(merged.width, sectionClasses.width, "normal"),
    spacing: safeToken(merged.spacing, sectionClasses.spacing, "normal"),
    textAlign: safeToken(merged.textAlign, sectionClasses.textAlign, "left"),
  };
}

export function getSectionClassNames(style, defaults) {
  const resolved = resolveSectionStyle(style, defaults);
  return {
    resolved,
    section: `${sectionClasses.background[resolved.background]} ${sectionClasses.spacing[resolved.spacing]}`,
    inner: `${sectionClasses.width[resolved.width]} ${sectionClasses.textAlign[resolved.textAlign]}`,
  };
}

export function getSectionTone(style, defaults) {
  const { background } = resolveSectionStyle(style, defaults);
  const dark = background === "dark";

  return {
    dark,
    heading: dark ? "text-white" : "text-slate-950",
    body: dark ? "text-slate-300" : "text-slate-600",
  };
}

export function resolveImageStyle(imageStyle = {}, defaults = {}) {
  const merged = { ...DEFAULT_IMAGE_STYLE, ...defaults, ...(imageStyle || {}) };

  return Object.fromEntries(
    Object.entries(imageClasses).map(([key, mapping]) => [
      key,
      safeToken(merged[key], mapping, DEFAULT_IMAGE_STYLE[key]),
    ])
  );
}

export function getImageClassNames(imageStyle, defaults) {
  const resolved = resolveImageStyle(imageStyle, defaults);

  return {
    resolved,
    wrapper: `${imageClasses.width[resolved.width]} ${imageClasses.aspectRatio[resolved.aspectRatio]} ${imageClasses.height[resolved.height]} ${imageClasses.radius[resolved.radius]}`,
    image: `${imageClasses.fit[resolved.fit]} ${imageClasses.position[resolved.position]}`,
    fit: imageClasses.fit[resolved.fit],
    position: imageClasses.position[resolved.position],
    radius: imageClasses.radius[resolved.radius],
  };
}

export function sanitizeLinkUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  if (url.startsWith("/") || url.startsWith("#")) return url;

  try {
    const parsed = new URL(url);
    return ["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol) ? url : "";
  } catch {
    return "";
  }
}
