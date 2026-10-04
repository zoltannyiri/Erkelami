import { getImageClassNames, getSectionTone } from "../../config/pageSectionStyles";
import PageSectionContainer from "./PageSectionContainer";

const defaults = { width: "wide", spacing: "large" };
const gridColumns = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};
const masonryColumns = {
  2: "sm:columns-2",
  3: "sm:columns-2 lg:columns-3",
  4: "sm:columns-2 lg:columns-4",
};
const ratios = {
  auto: "",
  "16:9": "aspect-video",
  "4:3": "aspect-[4/3]",
  "1:1": "aspect-square",
};
const gaps = { small: "gap-2", normal: "gap-4", large: "gap-7" };
const marginGaps = { small: "mb-2", normal: "mb-4", large: "mb-7" };

export default function GallerySection({ content = {} }) {
  const images = Array.isArray(content.images) ? content.images.filter((image) => image.imageUrl) : [];
  const layout = ["grid", "masonry", "featured"].includes(content.layout) ? content.layout : "grid";
  const columns = ["2", "3", "4"].includes(String(content.columns)) ? String(content.columns) : "3";
  const imageRatio = Object.hasOwn(ratios, content.imageRatio) ? content.imageRatio : "4:3";
  const gap = Object.hasOwn(gaps, content.gap) ? content.gap : "normal";
  const tone = getSectionTone(content.style, defaults);
  const imageClasses = getImageClassNames(content.imageStyle, { aspectRatio: imageRatio, height: "auto", radius: "small" });

  const imageElement = (image, index, extraClass = "") => (
    <img
      key={`${image.imageUrl}-${index}`}
      src={image.imageUrl}
      alt={image.alt || ""}
      className={`w-full bg-slate-100 ${ratios[imageRatio]} ${imageClasses.fit} ${imageClasses.position} ${imageClasses.radius} ${extraClass}`}
    />
  );

  return (
    <PageSectionContainer content={content} defaults={defaults}>
      {content.heading && <h2 className={`mb-8 text-3xl font-semibold tracking-tight sm:text-4xl ${tone.heading}`}>{content.heading}</h2>}

      {images.length === 0 && !content.heading && (
        <div className={`border border-dashed border-current/20 px-6 py-10 text-center text-sm ${tone.body}`}>A galéria képei hamarosan érkeznek.</div>
      )}

      {images.length > 0 && layout === "grid" && (
        <div className={`grid grid-cols-1 ${gridColumns[columns]} ${gaps[gap]}`}>
          {images.map((image, index) => imageElement(image, index))}
        </div>
      )}

      {images.length > 0 && layout === "masonry" && (
        <div className={`${masonryColumns[columns]} ${gaps[gap]}`}>
          {images.map((image, index) => imageElement(image, index, `break-inside-avoid ${marginGaps[gap]}`))}
        </div>
      )}

      {images.length > 0 && layout === "featured" && (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${gaps[gap]}`}>
          {images.map((image, index) => imageElement(image, index, index === 0 ? "sm:col-span-2 sm:row-span-2 h-full" : ""))}
        </div>
      )}
    </PageSectionContainer>
  );
}
