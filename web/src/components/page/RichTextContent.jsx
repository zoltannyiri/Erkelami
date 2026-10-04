import { Fragment } from "react";

import { sanitizeLinkUrl } from "../../config/pageSectionStyles";

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
      return <p key={key}>{children}</p>;
    case "heading": {
      const level = node.attrs?.level === 3 ? 3 : 2;
      return level === 3
        ? <h3 key={key}>{children}</h3>
        : <h2 key={key}>{children}</h2>;
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
