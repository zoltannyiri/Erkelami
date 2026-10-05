import { getImageClassNames, getSectionTone } from "../../config/pageSectionStyles";
import PageSectionContainer from "./PageSectionContainer";
import ResizableImageFrame from "./ResizableImageFrame";
import RichTextContent from "./RichTextContent";

const sectionDefaults = { background: "soft", width: "wide", spacing: "large" };
const imageDefaults = { aspectRatio: "4:3", height: "medium", width: "full" };

const columnClasses = {
  imageLeft: {
    40: "md:grid-cols-[2fr_3fr]",
    50: "md:grid-cols-2",
    60: "md:grid-cols-[3fr_2fr]",
  },
  imageRight: {
    40: "md:grid-cols-[3fr_2fr]",
    50: "md:grid-cols-2",
    60: "md:grid-cols-[2fr_3fr]",
  },
};

function SectionCopy({ content, tone, inverse = false }) {
  return (
    <div className={inverse ? "text-white" : ""}>
      {content.heading && (
        <h2 className={`text-3xl font-semibold tracking-tight sm:text-4xl ${inverse ? "text-white" : tone.heading}`}>
          {content.heading}
        </h2>
      )}
      <RichTextContent
        document={content.richText}
        fallbackText={content.text}
        className={`mt-5 ${inverse ? "text-slate-100" : tone.body}`}
      />
    </div>
  );
}

function SectionImage({ content, editorMode, imageResizeEnabled, onContentChange }) {
  const classes = getImageClassNames(content.imageStyle, imageDefaults);

  if (!content.imageUrl && !editorMode) return null;

  const updateSize = (dimensions) => {
    onContentChange?.({
      ...content,
      imageStyle: { ...(content.imageStyle || {}), ...dimensions },
    });
  };

  return (
    <ResizableImageFrame
      editorMode={imageResizeEnabled}
      onResize={updateSize}
      widthPercent={content.imageStyle?.widthPercent}
      heightPx={content.imageStyle?.heightPx}
      className={`overflow-hidden bg-slate-200 ${classes.wrapper}`}
    >
      {content.imageUrl ? (
        <img src={content.imageUrl} alt={content.imageAlt || ""} className={`h-full w-full ${classes.image}`} />
      ) : (
        <div className="flex h-full min-h-60 items-center justify-center text-sm text-slate-400">Kép helye</div>
      )}
    </ResizableImageFrame>
  );
}

export default function TextImageSection({ content = {}, editorMode = false, imageResizeEnabled = editorMode, previewMode, onContentChange }) {
  const legacyLayout = content.imagePosition === "left" ? "imageLeft" : "imageRight";
  const layout = ["imageLeft", "imageRight", "imageTop", "imageBackground"].includes(content.layout)
    ? content.layout
    : legacyLayout;
  const imageWidth = ["40", "50", "60"].includes(String(content.imageWidth))
    ? String(content.imageWidth)
    : "50";
  const tone = getSectionTone(content.style, sectionDefaults);
  const hasImage = Boolean(content.imageUrl) || editorMode;
  const forceMobile = previewMode === "mobile";

  if (layout === "imageBackground") {
    const backgroundStyle = content.imageUrl
      ? { backgroundImage: `linear-gradient(rgba(15, 23, 42, .66), rgba(15, 23, 42, .76)), url(${content.imageUrl})` }
      : undefined;

    return (
      <PageSectionContainer content={content} defaults={{ ...sectionDefaults, background: "dark" }}>
        <div style={backgroundStyle} className="flex min-h-[26rem] items-center bg-slate-900 bg-cover bg-center px-7 py-14 sm:px-12">
          <div className="max-w-2xl"><SectionCopy content={content} tone={tone} inverse /></div>
        </div>
      </PageSectionContainer>
    );
  }

  if (layout === "imageTop") {
    return (
      <PageSectionContainer content={content} defaults={sectionDefaults}>
        <div className={hasImage ? "space-y-8" : ""}>
          {hasImage && <SectionImage content={content} editorMode={editorMode} imageResizeEnabled={imageResizeEnabled} onContentChange={onContentChange} />}
          <div className="mx-auto max-w-3xl"><SectionCopy content={content} tone={tone} /></div>
        </div>
      </PageSectionContainer>
    );
  }

  const imageFirst = layout === "imageLeft";
  const alignClass = content.verticalAlign === "top" ? "items-start" : "items-center";

  if (!hasImage) {
    return (
      <PageSectionContainer content={content} defaults={sectionDefaults}>
        <div className="mx-auto max-w-3xl"><SectionCopy content={content} tone={tone} /></div>
      </PageSectionContainer>
    );
  }

  return (
    <PageSectionContainer content={content} defaults={sectionDefaults}>
      <div className={`grid gap-8 ${forceMobile ? "" : `md:gap-12 ${columnClasses[layout][imageWidth]}`} ${alignClass}`}>
        <div className={forceMobile ? "" : imageFirst ? "md:order-1" : "md:order-2"}><SectionImage content={content} editorMode={editorMode} imageResizeEnabled={imageResizeEnabled} onContentChange={onContentChange} /></div>
        <div className={forceMobile ? "" : imageFirst ? "md:order-2" : "md:order-1"}><SectionCopy content={content} tone={tone} /></div>
      </div>
    </PageSectionContainer>
  );
}
