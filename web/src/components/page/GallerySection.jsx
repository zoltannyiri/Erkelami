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

export default function GallerySection({ content = {}, previewMode }) {
  const images = Array.isArray(content.images) ? content.images.filter((image) => image.imageUrl) : [];
  const layout = ["grid", "masonry", "featured"].includes(content.layout) ? content.layout : "grid";
  const columns = ["2", "3", "4"].includes(String(content.columns)) ? String(content.columns) : "3";
  const imageRatio = Object.hasOwn(ratios, content.imageRatio) ? content.imageRatio : "4:3";
  const gap = Object.hasOwn(gaps, content.gap) ? content.gap : "normal";
  const tone = getSectionTone(content.style, defaults);
  const imageClasses = getImageClassNames(content.imageStyle, { aspectRatio: imageRatio, height: "auto", radius: "small" });

  if (images.length === 0 && !content.heading) return null;

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

      {images.length > 0 && layout === "grid" && (
        <div className={`grid grid-cols-1 ${previewMode === "mobile" ? "" : gridColumns[columns]} ${gaps[gap]}`}>
          {images.map((image, index) => imageElement(image, index))}
        </div>
      )}

      {images.length > 0 && layout === "masonry" && (
        <div className={`${previewMode === "mobile" ? "" : masonryColumns[columns]} ${gaps[gap]}`}>
          {images.map((image, index) => imageElement(image, index, `break-inside-avoid ${marginGaps[gap]}`))}
        </div>
      )}

      {images.length > 0 && layout === "featured" && (
        <div className={`grid grid-cols-1 ${previewMode === "mobile" ? "" : "sm:grid-cols-2 lg:grid-cols-3"} ${gaps[gap]}`}>
          {images.map((image, index) => imageElement(image, index, index === 0 ? "sm:col-span-2 sm:row-span-2 h-full" : ""))}
        </div>
      )}
    </PageSectionContainer>
  );
}
