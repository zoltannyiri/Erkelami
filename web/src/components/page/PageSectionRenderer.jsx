import TextSection from "./TextSection";
import ImageSection from "./ImageSection";
import TextImageSection from "./TextImageSection";
import CardGridSection from "./CardGridSection";
import GallerySection from "./GallerySection";
import HeroSection from "./HeroSection";
import CtaSection from "./CtaSection";

const renderers = {
  TEXT: TextSection,
  IMAGE: ImageSection,
  TEXT_IMAGE: TextImageSection,
  CARD_GRID: CardGridSection,
  GALLERY: GallerySection,
  HERO: HeroSection,
  CTA: CtaSection,
};

export default function PageSectionRenderer({ section, pageTitle, editorMode = false, imageResizeEnabled = editorMode, previewMode, onContentChange }) {
  const Renderer = renderers[section.type];
  if (!Renderer) return null;

  return (
    <Renderer
      content={section.content || {}}
      pageTitle={pageTitle}
      editorMode={editorMode}
      imageResizeEnabled={imageResizeEnabled}
      previewMode={previewMode}
      onContentChange={onContentChange}
    />
  );
}
