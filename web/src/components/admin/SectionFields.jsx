import SectionStyleControls from "./page-editor/SectionStyleControls";
import CardGridEditor from "./page-editor/editors/CardGridEditor";
import CtaEditor from "./page-editor/editors/CtaEditor";
import GalleryEditor from "./page-editor/editors/GalleryEditor";
import HeroEditor from "./page-editor/editors/HeroEditor";
import ImageEditor from "./page-editor/editors/ImageEditor";
import TextEditor from "./page-editor/editors/TextEditor";
import TextImageEditor from "./page-editor/editors/TextImageEditor";
import DownloadsEditor from "./page-editor/editors/DownloadsEditor";
import PdfViewerEditor from "./page-editor/editors/PdfViewerEditor";
import StaffDirectoryEditor from "./page-editor/editors/StaffDirectoryEditor";
import ContactInfoEditor from "./page-editor/editors/ContactInfoEditor";
import LinkDirectoryEditor from "./page-editor/editors/LinkDirectoryEditor";
import ConcertArchiveEditor from "./page-editor/editors/ConcertArchiveEditor";
import { resolveSectionType } from "../../config/pageSectionTypes";
import { normalizeConcertArchiveContent } from "../../config/concertArchive";

const editors = {
  TEXT: TextEditor,
  IMAGE: ImageEditor,
  TEXT_IMAGE: TextImageEditor,
  CARD_GRID: CardGridEditor,
  GALLERY: GalleryEditor,
  HERO: HeroEditor,
  CTA: CtaEditor,
  DOWNLOADS: DownloadsEditor,
  PDF_VIEWER: PdfViewerEditor,
  STAFF_DIRECTORY: StaffDirectoryEditor,
  CONTACT_INFO: ContactInfoEditor,
  LINK_DIRECTORY: LinkDirectoryEditor,
  CONCERT_ARCHIVE: ConcertArchiveEditor,
};

export default function SectionFields({ type, content = {}, onChange }) {
  const resolvedType = resolveSectionType(type, content);
  const Editor = editors[resolvedType];
  const changeBase = resolvedType === "CONCERT_ARCHIVE"
    ? normalizeConcertArchiveContent(content)
    : content;
  const updateField = (field, value) => onChange({ ...changeBase, [field]: value });

  if (!Editor) return null;

  return (
    <div className="space-y-6">
      <Editor content={content} updateField={updateField} />
      <SectionStyleControls
        type={resolvedType}
        value={content.style}
        onChange={(style) => updateField("style", style)}
      />
    </div>
  );
}
