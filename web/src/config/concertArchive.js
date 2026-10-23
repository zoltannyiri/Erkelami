const YEAR_PATTERN = /^(\d{4})\s*\/\s*(\d{4})(?:\s*tan[eé]v)?$/i;
const DATE_PATTERN = /^\d{4}\.\s*\d{1,2}\.\s*\d{1,2}(?:\s*[-–]\s*(?:\d{4}\.\s*\d{1,2}\.)?\d{1,2})?\.?$/;

function nodeText(node) {
  if (!node) return "";
  if (node.type === "text") return node.text || "";
  if (node.type === "hardBreak") return " ";
  return Array.isArray(node.content) ? node.content.map(nodeText).join("") : "";
}

function nodeLink(node) {
  if (!node) return "";
  const link = node.marks?.find((mark) => mark.type === "link")?.attrs?.href;
  if (link) return link;
  if (!Array.isArray(node.content)) return "";
  return node.content.map(nodeLink).find(Boolean) || "";
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

export function parseLegacyConcertGroups(richText) {
  const paragraphs = Array.isArray(richText?.content) ? richText.content : [];
  const groups = [];
  let currentGroup = null;
  let currentDate = "";

  const ensureGroup = () => {
    if (!currentGroup) {
      currentGroup = { label: "Korábbi tanévek", events: [] };
      groups.push(currentGroup);
    }
    return currentGroup;
  };

  paragraphs.forEach((paragraph) => {
    const text = normalizeText(nodeText(paragraph));
    if (!text) return;

    const yearMatch = text.match(YEAR_PATTERN);
    if (yearMatch) {
      currentGroup = { label: `${yearMatch[1]}/${yearMatch[2]}`, events: [] };
      groups.push(currentGroup);
      currentDate = "";
      return;
    }

    if (DATE_PATTERN.test(text)) {
      currentDate = text.replace(/\.$/, "");
      return;
    }

    const url = nodeLink(paragraph);
    if (!currentDate && !url) return;

    ensureGroup().events.push({
      date: currentDate,
      title: text,
      location: "",
      description: "",
      imageUrl: "",
      linkUrl: url,
      buttonText: url ? "Felvétel megtekintése" : "",
      visible: true,
    });
  });

  return groups.filter((group) => group.events.length > 0);
}

export function isConcertArchiveContent(content = {}) {
  if (Array.isArray(content.groups)) return true;
  return /^ZENEISKOLAI KONCERTJEINK/i.test(normalizeText(content.heading));
}

export function normalizeConcertArchiveContent(content = {}) {
  const groups = Array.isArray(content.groups) && content.groups.length > 0
    ? content.groups
    : parseLegacyConcertGroups(content.richText);
  const legacyHeading = normalizeText(content.heading);
  const heading = /^ZENEISKOLAI KONCERTJEINK/i.test(legacyHeading)
    ? "Zeneiskolai koncertjeink"
    : legacyHeading || "Zeneiskolai koncertjeink";

  return {
    ...content,
    heading,
    intro: content.intro || "Hangversenyeink, iskolai rendezvényeink és növendékeink fellépéseinek felvételei tanévenként.",
    groups,
  };
}

