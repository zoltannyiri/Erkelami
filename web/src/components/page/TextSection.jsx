import { getSectionTone } from "../../config/pageSectionStyles";
import PageSectionContainer from "./PageSectionContainer";
import RichTextContent from "./RichTextContent";

const defaults = { width: "narrow", spacing: "normal" };

export default function TextSection({ content = {} }) {
  const tone = getSectionTone(content.style, defaults);

  return (
    <PageSectionContainer content={content} defaults={defaults}>
      {content.heading && (
        <h2 className={`mb-5 text-2xl font-semibold tracking-tight sm:text-4xl ${tone.heading}`}>
          {content.heading}
        </h2>
      )}
      <RichTextContent
        document={content.richText}
        fallbackText={content.text}
        className={tone.body}
      />
    </PageSectionContainer>
  );
}
