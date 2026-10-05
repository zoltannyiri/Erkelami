export const PAGE_SECTION_TYPES = [
  { value: "TEXT", label: "Szöveg" },
  { value: "IMAGE", label: "Kép" },
  { value: "TEXT_IMAGE", label: "Kép + szöveg" },
  { value: "CARD_GRID", label: "Kártyarács" },
  { value: "GALLERY", label: "Galéria" },
  { value: "HERO", label: "Kiemelt nyitóblokk" },
  { value: "CTA", label: "Felhívás" },
  { value: "DOWNLOADS", label: "Dokumentumok / Letöltések" },
];

export function createEmptySectionContent(type) {
  switch (type) {
    case "TEXT":
      return {
        heading: "",
        text: "",
        style: { background: "white", width: "narrow", spacing: "normal", textAlign: "left" },
      };
    case "IMAGE":
      return {
        imageUrl: "",
        alt: "",
        adjacentItems: [],
        style: { background: "white", width: "wide", spacing: "normal", textAlign: "left" },
        imageStyle: { aspectRatio: "16:9", height: "medium", fit: "cover", position: "center", radius: "medium", width: "full" },
      };
    case "TEXT_IMAGE":
      return {
        heading: "",
        text: "",
        imageUrl: "",
        imageAlt: "",
        imagePosition: "right",
        layout: "imageRight",
        imageWidth: "50",
        verticalAlign: "center",
        style: { background: "soft", width: "wide", spacing: "large", textAlign: "left" },
        imageStyle: { aspectRatio: "4:3", height: "medium", fit: "cover", position: "center", radius: "medium", width: "full" },
      };
    case "CARD_GRID":
      return {
        heading: "",
        cards: [],
        columns: "3",
        cardStyle: "bordered",
        imageRatio: "4:3",
        imageStyle: { aspectRatio: "4:3", height: "auto", fit: "cover", position: "center", radius: "none", width: "full" },
        style: { background: "soft", width: "wide", spacing: "large", textAlign: "left" },
      };
    case "GALLERY":
      return {
        heading: "",
        images: [],
        layout: "grid",
        columns: "3",
        imageRatio: "4:3",
        gap: "normal",
        imageStyle: { aspectRatio: "4:3", height: "auto", fit: "cover", position: "center", radius: "small", width: "full" },
        style: { background: "white", width: "wide", spacing: "large", textAlign: "left" },
      };
    case "HERO":
      return {
        heading: "",
        subheading: "",
        imageUrl: "",
        overlay: "medium",
        textPosition: "left",
        height: "large",
        buttonText: "",
        linkUrl: "",
        imageStyle: { aspectRatio: "auto", height: "large", fit: "cover", position: "center", radius: "none", width: "full" },
        style: { background: "dark", width: "full", spacing: "compact", textAlign: "left" },
      };
    case "CTA":
      return {
        heading: "",
        text: "",
        buttonText: "",
        linkUrl: "",
        variant: "dark",
        alignment: "left",
        buttonStyle: "primary",
        style: { background: "white", width: "wide", spacing: "large", textAlign: "left" },
      };
    case "DOWNLOADS":
      return {
        heading: "",
        description: "",
        files: [],
        style: { background: "soft", width: "normal", spacing: "normal", textAlign: "left" },
      };
    default:
      return {};
  }
}

export function getSectionTypeLabel(type) {
  if (type === "DOWNLOADS") {
    return "Dokumentumok";
  }
  const option = PAGE_SECTION_TYPES.find(({ value }) => value === type);
  return option ? option.label : type;
}

export function getSectionDisplayName(section) {
  if (section.type === "DOWNLOADS") {
    return section.content?.heading || "Dokumentumok";
  }
  const label = PAGE_SECTION_TYPES.find(({ value }) => value === section.type)?.label;

  return section.content?.heading || section.content?.alt || label || "Tartalmi blokk";
}
