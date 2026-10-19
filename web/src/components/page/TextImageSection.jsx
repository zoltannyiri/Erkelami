import { getImageClassNames, getSectionTone } from "../../config/pageSectionStyles";
import LazyRichTextEditor from "../admin/page-editor/LazyRichTextEditor";
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

const wrapWidthClasses = {
  40: "md:w-[40%]",
  50: "md:w-1/2",
  60: "md:w-[60%]",
};

const imageLayoutOptions = [
  ["imageLeft", "Bal oldalon"],
  ["imageRight", "Jobb oldalon"],
  ["imageTop", "Szöveg fölött"],
  ["wrapLeft", "Balra, körbefuttatva"],
  ["wrapRight", "Jobbra, körbefuttatva"],
];

function SectionCopy({ content, tone, inverse = false, directEditing = false, onRichTextChange }) {
  return (
    <div className={inverse ? "text-white" : ""}>
      {content.heading && (
        <h2 className={`text-3xl font-semibold tracking-tight sm:text-4xl ${inverse ? "text-white" : tone.heading}`}>
          {content.heading}
        </h2>
      )}
      <div className="mt-5">
        {directEditing && !inverse ? (
          <div className={tone.body}>
            <LazyRichTextEditor
              variant="canvas"
              value={content.richText}
              fallbackText={content.text}
              onChange={onRichTextChange}
            />
          </div>
        ) : (
          <RichTextContent
            document={content.richText}
            fallbackText={content.text}
            className={inverse ? "text-slate-100" : tone.body}
          />
        )}
      </div>
    </div>
  );
}

function SectionImage({ content, editorMode, imageResizeEnabled, layout, onLayoutChange, onContentChange }) {
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
      {imageResizeEnabled && content.imageUrl && onLayoutChange && (
        <label
          className="absolute left-3 top-3 z-40 flex items-center gap-2 rounded-lg border border-white/80 bg-slate-950/90 px-2.5 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur"
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <span>Kép helye</span>
          <select
            value={layout}
            onChange={(event) => onLayoutChange(event.target.value)}
            className="rounded-md border border-white/25 bg-white px-2 py-1 text-xs font-semibold text-slate-900 outline-none"
          >
            {imageLayoutOptions.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
      )}
    </ResizableImageFrame>
  );
}

export default function TextImageSection({ content = {}, editorMode = false, imageResizeEnabled = editorMode, previewMode, onContentChange }) {
  const legacyLayout = content.imagePosition === "left" ? "imageLeft" : "imageRight";
  const layout = ["imageLeft", "imageRight", "imageTop", "wrapLeft", "wrapRight", "imageBackground"].includes(content.layout)
    ? content.layout
    : legacyLayout;
  const imageWidth = ["40", "50", "60"].includes(String(content.imageWidth))
    ? String(content.imageWidth)
    : "50";
  const tone = getSectionTone(content.style, sectionDefaults);
  const hasImage = Boolean(content.imageUrl) || editorMode;
  const forceMobile = previewMode === "mobile";
  const directEditing = editorMode && imageResizeEnabled;
  const updateLayout = (nextLayout) => onContentChange?.({ ...content, layout: nextLayout });
  const updateRichText = (richText) => onContentChange?.({ ...content, richText });

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
          {hasImage && <SectionImage content={content} editorMode={editorMode} imageResizeEnabled={imageResizeEnabled} layout={layout} onLayoutChange={updateLayout} onContentChange={onContentChange} />}
          <div className="mx-auto max-w-3xl"><SectionCopy content={content} tone={tone} directEditing={directEditing} onRichTextChange={updateRichText} /></div>
        </div>
      </PageSectionContainer>
    );
  }

  if (layout === "wrapLeft" || layout === "wrapRight") {
    const imageOnLeft = layout === "wrapLeft";
    const floatClasses = forceMobile
      ? "mb-7"
      : `mb-5 ${wrapWidthClasses[imageWidth]} ${imageOnLeft ? "md:float-left md:mr-9" : "md:float-right md:ml-9"}`;

    return (
      <PageSectionContainer content={content} defaults={sectionDefaults}>
        <div className="flow-root">
          {hasImage && (
            <div className={floatClasses}>
              <SectionImage content={content} editorMode={editorMode} imageResizeEnabled={imageResizeEnabled} layout={layout} onLayoutChange={updateLayout} onContentChange={onContentChange} />
            </div>
          )}
          <SectionCopy content={content} tone={tone} directEditing={directEditing} onRichTextChange={updateRichText} />
        </div>
      </PageSectionContainer>
    );
  }

  const imageFirst = layout === "imageLeft";
  const alignClass = content.verticalAlign === "top" ? "items-start" : "items-center";

  if (!hasImage) {
    return (
      <PageSectionContainer content={content} defaults={sectionDefaults}>
        <div className="mx-auto max-w-3xl"><SectionCopy content={content} tone={tone} directEditing={directEditing} onRichTextChange={updateRichText} /></div>
      </PageSectionContainer>
    );
  }

  return (
    <PageSectionContainer content={content} defaults={sectionDefaults}>
      <div className={`grid gap-8 ${forceMobile ? "" : `md:gap-12 ${columnClasses[layout][imageWidth]}`} ${alignClass}`}>
        <div className={forceMobile ? "" : imageFirst ? "md:order-1" : "md:order-2"}><SectionImage content={content} editorMode={editorMode} imageResizeEnabled={imageResizeEnabled} layout={layout} onLayoutChange={updateLayout} onContentChange={onContentChange} /></div>
        <div className={forceMobile ? "" : imageFirst ? "md:order-2" : "md:order-1"}><SectionCopy content={content} tone={tone} directEditing={directEditing} onRichTextChange={updateRichText} /></div>
      </div>
    </PageSectionContainer>
  );
}
