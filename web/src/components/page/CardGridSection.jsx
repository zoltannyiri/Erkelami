import { getImageClassNames, getSectionTone, sanitizeLinkUrl } from "../../config/pageSectionStyles";
import PageSectionContainer from "./PageSectionContainer";

const defaults = { background: "soft", width: "wide", spacing: "large" };
const columnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};
const ratioClasses = {
  "16:9": "aspect-video",
  "4:3": "aspect-[4/3]",
  "1:1": "aspect-square",
};

function StandardCard({ card, cardStyle, imageRatio, imageClasses }) {
  const href = sanitizeLinkUrl(card.linkUrl);
  const styles = {
    simple: "bg-transparent",
    bordered: "border border-slate-200 bg-white",
    elevated: "bg-white shadow-[0_16px_45px_rgba(15,23,42,0.10)]",
  };
  const body = (
    <>
      {card.imageUrl && <img src={card.imageUrl} alt={card.title || ""} className={`w-full ${ratioClasses[imageRatio]} ${imageClasses.fit} ${imageClasses.position} ${imageClasses.radius}`} />}
      <div className={cardStyle === "simple" ? "py-5" : "p-6"}>
        {card.title && <h3 className="text-xl font-semibold text-slate-950">{card.title}</h3>}
        {card.description && <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">{card.description}</p>}
        {href && <span className="mt-5 inline-block text-sm font-semibold text-slate-900">Tovább →</span>}
      </div>
    </>
  );

  return href
    ? <a href={href} className={`group overflow-hidden transition hover:-translate-y-0.5 ${styles[cardStyle]}`}>{body}</a>
    : <article className={`overflow-hidden ${styles[cardStyle]}`}>{body}</article>;
}

function OverlayCard({ card, imageRatio, imageClasses }) {
  const href = sanitizeLinkUrl(card.linkUrl);
  const body = (
    <div className={`relative overflow-hidden bg-slate-800 ${ratioClasses[imageRatio]}`}>
      {card.imageUrl && <img src={card.imageUrl} alt={card.title || ""} className={`h-full w-full opacity-80 ${imageClasses.fit} ${imageClasses.position}`} />}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        {card.title && <h3 className="text-xl font-semibold">{card.title}</h3>}
        {card.description && <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-200">{card.description}</p>}
      </div>
    </div>
  );

  return href ? <a href={href} className="transition hover:-translate-y-0.5">{body}</a> : <article>{body}</article>;
}

export default function CardGridSection({ content = {} }) {
  const cards = Array.isArray(content.cards) ? content.cards : [];
  const columns = ["2", "3", "4"].includes(String(content.columns)) ? String(content.columns) : "3";
  const cardStyle = ["simple", "bordered", "elevated", "imageOverlay"].includes(content.cardStyle) ? content.cardStyle : "bordered";
  const imageRatio = Object.hasOwn(ratioClasses, content.imageRatio) ? content.imageRatio : "4:3";
  const imageClasses = getImageClassNames(content.imageStyle, { aspectRatio: imageRatio, height: "auto", radius: "none" });
  const tone = getSectionTone(content.style, defaults);

  return (
    <PageSectionContainer content={content} defaults={defaults}>
      {content.heading && <h2 className={`mb-8 text-3xl font-semibold tracking-tight sm:text-4xl ${tone.heading}`}>{content.heading}</h2>}
      {cards.length > 0 && (
        <div className={`grid grid-cols-1 gap-6 ${columnClasses[columns]}`}>
          {cards.map((card, index) =>
            cardStyle === "imageOverlay"
              ? <OverlayCard key={index} card={card} imageRatio={imageRatio} imageClasses={imageClasses} />
              : <StandardCard key={index} card={card} cardStyle={cardStyle} imageRatio={imageRatio} imageClasses={imageClasses} />
          )}
        </div>
      )}
    </PageSectionContainer>
  );
}
