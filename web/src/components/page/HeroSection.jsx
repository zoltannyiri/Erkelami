import { sanitizeLinkUrl } from "../../config/pageSectionStyles";
import PageSectionContainer from "./PageSectionContainer";

const defaults = { background: "dark", width: "full", spacing: "compact" };
const heights = {
  medium: "min-h-[26rem]",
  large: "min-h-[38rem]",
  viewport: "min-h-[calc(100vh-5rem)]",
};
const overlays = {
  light: [0.28, 0.42],
  medium: [0.5, 0.66],
  dark: [0.68, 0.82],
};

export default function HeroSection({ content = {}, pageTitle }) {
  const height = Object.hasOwn(heights, content.height) ? content.height : "large";
  const overlay = Object.hasOwn(overlays, content.overlay) ? content.overlay : "medium";
  const textPosition = content.textPosition === "center" ? "center" : "left";
  const imagePosition = ["left", "center", "right"].includes(content.imageStyle?.position) ? content.imageStyle.position : "center";
  const [topOpacity, bottomOpacity] = overlays[overlay];
  const sectionStyle = content.imageUrl
    ? { backgroundImage: `linear-gradient(rgba(15, 23, 42, ${topOpacity}), rgba(15, 23, 42, ${bottomOpacity})), url(${content.imageUrl})` }
    : undefined;
  const href = sanitizeLinkUrl(content.linkUrl);

  return (
    <PageSectionContainer
      content={content}
      defaults={defaults}
      className={`!py-0 bg-cover ${imagePosition === "left" ? "bg-left" : imagePosition === "right" ? "bg-right" : "bg-center"} ${content.imageUrl ? "" : "bg-gradient-to-br from-slate-950 via-slate-800 to-slate-700"}`}
      innerClassName="!max-w-none !px-0"
      sectionStyle={sectionStyle}
    >
      <div className={`mx-auto flex max-w-7xl items-center px-5 py-16 sm:px-8 ${heights[height]}`}>
        <div className={`w-full max-w-4xl ${textPosition === "center" ? "mx-auto text-center" : ""}`}>
          {(content.heading || pageTitle) && (
            <h1 className="text-4xl font-semibold tracking-[-0.025em] text-white sm:text-6xl lg:text-7xl">
              {content.heading || pageTitle}
            </h1>
          )}
          {content.subheading && <p className={`mt-6 text-lg leading-8 text-slate-200 sm:text-xl ${textPosition === "center" ? "mx-auto max-w-3xl" : "max-w-2xl"}`}>{content.subheading}</p>}
          {content.buttonText && href && (
            <a href={href} className="mt-8 inline-flex bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-50">{content.buttonText}</a>
          )}
        </div>
      </div>
    </PageSectionContainer>
  );
}
