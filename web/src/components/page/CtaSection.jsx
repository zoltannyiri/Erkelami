import { sanitizeLinkUrl } from "../../config/pageSectionStyles";
import PageSectionContainer from "./PageSectionContainer";
import RichTextContent from "./RichTextContent";

const defaults = { width: "wide", spacing: "large" };
const variants = {
  light: "border border-stone-200 bg-white text-slate-950 shadow-sm",
  dark: "bg-gradient-to-br from-slate-950 to-slate-800 text-white shadow-lg",
  accent: "border border-amber-200/70 bg-amber-100/70 text-slate-950",
};

export default function CtaSection({ content = {}, previewMode }) {
  const variant = Object.hasOwn(variants, content.variant) ? content.variant : "dark";
  const centered = content.alignment === "center";
  const secondary = content.buttonStyle === "secondary";
  const href = sanitizeLinkUrl(content.linkUrl);
  const buttonClasses = secondary
    ? variant === "dark" ? "border border-white/50 text-white hover:bg-white/10" : "border border-slate-400 text-slate-900 hover:bg-slate-50"
    : variant === "dark" ? "bg-white text-slate-950 hover:bg-amber-50" : "bg-slate-950 text-white hover:bg-slate-800";

  return (
    <PageSectionContainer content={content} defaults={defaults}>
      <div className={`rounded-sm px-7 py-10 sm:px-12 sm:py-14 ${variants[variant]} ${centered ? "text-center" : previewMode === "mobile" ? "" : "md:flex md:items-center md:justify-between md:gap-10"}`}>
        <div className={centered ? "mx-auto max-w-3xl" : "max-w-3xl"}>
          {content.heading && <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{content.heading}</h2>}
          <RichTextContent document={content.richText} fallbackText={content.text} className={`mt-4 ${variant === "dark" ? "text-slate-300" : "text-slate-600"}`} />
        </div>
        {content.buttonText && href && (
          <a href={href} className={`mt-7 inline-flex shrink-0 items-center px-6 py-3 font-semibold transition ${buttonClasses} ${!centered ? "md:mt-0" : ""}`}>{content.buttonText}</a>
        )}
      </div>
    </PageSectionContainer>
  );
}
