import { getSectionTone } from "../../config/pageSectionStyles";
import LazyRichTextEditor from "../admin/page-editor/LazyRichTextEditor";
import PageSectionContainer from "./PageSectionContainer";
import RichTextContent from "./RichTextContent";

const defaults = { width: "narrow", spacing: "normal" };

export default function TextSection({ content = {}, editorMode = false, imageResizeEnabled = editorMode, onContentChange }) {
  const tone = getSectionTone(content.style, defaults);
  const directEditing = editorMode && imageResizeEnabled;

  return (
    <PageSectionContainer content={content} defaults={defaults}>
      {content.heading && (
        <h2 className={`mb-5 text-2xl font-semibold tracking-tight sm:text-4xl ${tone.heading}`}>
          {content.heading}
        </h2>
      )}
      {directEditing ? (
        <div className={tone.body}>
          <LazyRichTextEditor
            variant="canvas"
            value={content.richText}
            fallbackText={content.text}
            onChange={(richText) => onContentChange?.({ ...content, richText })}
          />
        </div>
      ) : (
        <RichTextContent
          document={content.richText}
          fallbackText={content.text}
          className={tone.body}
        />
      )}
    </PageSectionContainer>
  );
}
