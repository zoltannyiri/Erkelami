import { isConcertArchiveContent } from "./concertArchive";

export const PAGE_SECTION_TYPES = [
  { value: "TEXT", label: "Szöveg" },
  { value: "IMAGE", label: "Kép" },
  { value: "TEXT_IMAGE", label: "Kép + szöveg" },
  { value: "CARD_GRID", label: "Kártyarács" },
  { value: "GALLERY", label: "Galéria" },
  { value: "HERO", label: "Kiemelt nyitóblokk" },
  { value: "CTA", label: "Felhívás" },
  { value: "DOWNLOADS", label: "Dokumentumok / Letöltések" },
  { value: "PDF_VIEWER", label: "PDF megjelenítő" },
  { value: "STAFF_DIRECTORY", label: "Munkatársi névsor" },
  { value: "CONTACT_INFO", label: "Kapcsolati adatok" },
  { value: "LINK_DIRECTORY", label: "Hasznos linkek" },
  { value: "CONCERT_ARCHIVE", label: "Koncertlista" },
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
    case "PDF_VIEWER":
      return {
        heading: "",
        description: "",
        pdfUrl: "",
        height: "large",
        style: { background: "white", width: "wide", spacing: "normal", textAlign: "left" },
      };
    case "STAFF_DIRECTORY":
      return {
        academicYear: "2026/2027",
        intro: "",
        groups: [
          {
            title: "Vezetőség",
            featured: true,
            members: [{ name: "", role: "" }],
          },
          {
            title: "Pedagógusok",
            featured: false,
            members: [{ name: "", role: "" }],
          },
        ],
        style: { background: "white", width: "wide", spacing: "large", textAlign: "left" },
      };
    case "CONTACT_INFO":
      return {
        institutionName: "Tatabányai Erkel Ferenc Alapfokú Művészeti Iskola",
        address: "2800 Tatabánya, Fő tér 34.",
        coordinates: "47.582289, 18.398334",
        phones: ["34/311-238", "30/214-3243"],
        generalEmail: "info@erkelzistb.hu",
        website: "www.erkelzistb.hu",
        contacts: [
          { position: "Intézményvezető", name: "", email: "" },
        ],
        privacyOfficer: {
          name: "",
          organization: "",
          address: "",
          email: "",
        },
        style: { background: "white", width: "wide", spacing: "large", textAlign: "left" },
      };
    case "LINK_DIRECTORY":
      return {
        heading: "Fontos linkek",
        intro: "Hasznos oktatási, zenei és kulturális oldalak egy helyen.",
        links: [{ title: "", url: "", description: "" }],
        style: { background: "white", width: "wide", spacing: "large", textAlign: "left" },
      };
    case "CONCERT_ARCHIVE":
      return {
        heading: "Zeneiskolai koncertjeink",
        intro: "Hangversenyeink, iskolai rendezvényeink és növendékeink fellépéseinek felvételei tanévenként.",
        groups: [
          {
            label: "2026/2027",
            events: [
              { date: "", title: "", location: "", description: "", imageUrl: "", linkUrl: "", buttonText: "Felvétel megtekintése", visible: true },
            ],
          },
        ],
        style: { background: "white", width: "wide", spacing: "large", textAlign: "left" },
      };
    default:
      return {};
  }
}

export function resolveSectionType(type, content) {
  return type === "TEXT" && isConcertArchiveContent(content) ? "CONCERT_ARCHIVE" : type;
}

export function getSectionTypeLabel(type, content) {
  const resolvedType = resolveSectionType(type, content);
  if (resolvedType === "DOWNLOADS") {
    return "Dokumentumok";
  }
  if (resolvedType === "PDF_VIEWER") {
    return "PDF megjelenítő";
  }
  if (resolvedType === "STAFF_DIRECTORY") {
    return "Munkatársi névsor";
  }
  if (resolvedType === "CONTACT_INFO") {
    return "Kapcsolati adatok";
  }
  if (resolvedType === "LINK_DIRECTORY") {
    return "Hasznos linkek";
  }
  if (resolvedType === "CONCERT_ARCHIVE") {
    return "Koncertlista";
  }
  const option = PAGE_SECTION_TYPES.find(({ value }) => value === resolvedType);
  return option ? option.label : resolvedType;
}

export function getSectionDisplayName(section) {
  const resolvedType = resolveSectionType(section.type, section.content);
  if (resolvedType === "DOWNLOADS") {
    return section.content?.heading || "Dokumentumok";
  }
  if (resolvedType === "PDF_VIEWER") {
    return section.content?.heading || "PDF megjelenítő";
  }
  const label = PAGE_SECTION_TYPES.find(({ value }) => value === resolvedType)?.label;

  return section.content?.heading || section.content?.alt || label || "Tartalmi blokk";
}
