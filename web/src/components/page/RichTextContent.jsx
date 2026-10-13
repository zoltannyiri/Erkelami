import { Fragment } from "react";

import { sanitizeImageUrl, sanitizeLinkUrl } from "../../config/pageSectionStyles";

const imageAlignments = new Set(["left", "center", "right", "full"]);
const textAlignments = new Set(["left", "center", "right", "justify"]);

const getTextAlignStyle = (node) => {
  const textAlign = node.attrs?.textAlign;
  return textAlignments.has(textAlign) ? { textAlign } : undefined;
};

function renderMarks(node, key) {
  let rendered = node.text || "";

  for (const mark of node.marks || []) {
    if (mark.type === "bold") rendered = <strong key={`${key}-bold`}>{rendered}</strong>;
    if (mark.type === "italic") rendered = <em key={`${key}-italic`}>{rendered}</em>;
    if (mark.type === "link") {
      const href = sanitizeLinkUrl(mark.attrs?.href);
      if (href) {
        rendered = <a key={`${key}-link`} href={href}>{rendered}</a>;
      }
    }
  }

  return rendered;
}

function renderNode(node, key) {
  if (!node || typeof node !== "object") return null;
  if (node.type === "text") return renderMarks(node, key);
  if (node.type === "hardBreak") return <br key={key} />;

  const children = (node.content || []).map((child, index) =>
    renderNode(child, `${key}-${index}`)
  );

  switch (node.type) {
    case "doc":
      return <Fragment key={key}>{children}</Fragment>;
    case "paragraph":
      return <p key={key} style={getTextAlignStyle(node)}>{children}</p>;
    case "heading": {
      const level = node.attrs?.level === 3 ? 3 : 2;
      return level === 3
        ? <h3 key={key} style={getTextAlignStyle(node)}>{children}</h3>
        : <h2 key={key} style={getTextAlignStyle(node)}>{children}</h2>;
    }
    case "image": {
      const src = sanitizeImageUrl(node.attrs?.src);
      if (!src) return null;
      const align = imageAlignments.has(node.attrs?.align) ? node.attrs.align : "center";
      const rawWidth = Number(node.attrs?.width);
      const width = Number.isFinite(rawWidth) ? Math.min(1200, Math.max(160, rawWidth)) : null;

      return (
        <figure
          key={key}
          className={`rich-text-image rich-text-image--${align}`}
          style={align !== "full" && width ? { width: `${width}px` } : undefined}
        >
          <img src={src} alt={String(node.attrs?.alt || "")} loading="lazy" />
        </figure>
      );
    }
    case "bulletList":
      return <ul key={key}>{children}</ul>;
    case "orderedList":
      return <ol key={key}>{children}</ol>;
    case "listItem":
      return <li key={key}>{children}</li>;
    case "blockquote":
      return <blockquote key={key}>{children}</blockquote>;
    default:
      return <Fragment key={key}>{children}</Fragment>;
  }
}

export default function RichTextContent({ document, fallbackText, className = "" }) {
  if (document?.type === "doc") {
    return <div className={`rich-text ${className}`}>{renderNode(document, "root")}</div>;
  }

  if (!fallbackText) return null;

  return (
    <div className={`rich-text ${className}`}>
      <p className="whitespace-pre-line">{fallbackText}</p>
    </div>
  );
}
