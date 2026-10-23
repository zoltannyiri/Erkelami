import TextSection from "./TextSection";
import ImageSection from "./ImageSection";
import TextImageSection from "./TextImageSection";
import CardGridSection from "./CardGridSection";
import GallerySection from "./GallerySection";
import HeroSection from "./HeroSection";
import CtaSection from "./CtaSection";
import DownloadsSection from "./DownloadsSection";
import PdfViewerSection from "./PdfViewerSection";
import StaffDirectorySection from "./StaffDirectorySection";
import ContactInfoSection from "./ContactInfoSection";
import LinkDirectorySection from "./LinkDirectorySection";
import ConcertArchiveSection from "./ConcertArchiveSection";
import { resolveSectionType } from "../../config/pageSectionTypes";

const renderers = {
  TEXT: TextSection,
  IMAGE: ImageSection,
  TEXT_IMAGE: TextImageSection,
  CARD_GRID: CardGridSection,
  GALLERY: GallerySection,
  HERO: HeroSection,
  CTA: CtaSection,
  DOWNLOADS: DownloadsSection,
  PDF_VIEWER: PdfViewerSection,
  STAFF_DIRECTORY: StaffDirectorySection,
  CONTACT_INFO: ContactInfoSection,
  LINK_DIRECTORY: LinkDirectorySection,
  CONCERT_ARCHIVE: ConcertArchiveSection,
};

export default function PageSectionRenderer({ section, pageTitle, editorMode = false, imageResizeEnabled = editorMode, previewMode, onContentChange }) {
  const Renderer = renderers[resolveSectionType(section.type, section.content)];
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
