import SectionStyleControls from "./page-editor/SectionStyleControls";
import CardGridEditor from "./page-editor/editors/CardGridEditor";
import CtaEditor from "./page-editor/editors/CtaEditor";
import GalleryEditor from "./page-editor/editors/GalleryEditor";
import HeroEditor from "./page-editor/editors/HeroEditor";
import ImageEditor from "./page-editor/editors/ImageEditor";
import TextEditor from "./page-editor/editors/TextEditor";
import TextImageEditor from "./page-editor/editors/TextImageEditor";

const editors = {
  TEXT: TextEditor,
  IMAGE: ImageEditor,
  TEXT_IMAGE: TextImageEditor,
  CARD_GRID: CardGridEditor,
  GALLERY: GalleryEditor,
  HERO: HeroEditor,
  CTA: CtaEditor,
};

export default function SectionFields({ type, content = {}, onChange }) {
  const Editor = editors[type];
  const updateField = (field, value) => onChange({ ...content, [field]: value });

  if (!Editor) return null;

  return (
    <div className="space-y-6">
      <Editor content={content} updateField={updateField} />
      <SectionStyleControls
        type={type}
        value={content.style}
        onChange={(style) => updateField("style", style)}
      />
    </div>
  );
}
