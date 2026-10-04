import { getImageClassNames, getSectionTone } from "../../config/pageSectionStyles";
import PageSectionContainer from "./PageSectionContainer";
import ResizableImageFrame from "./ResizableImageFrame";
import RichTextContent from "./RichTextContent";

const sectionDefaults = { width: "wide", spacing: "normal" };
const imageDefaults = { aspectRatio: "16:9", height: "medium", radius: "medium" };

export default function ImageSection({ content = {}, editorMode = false, onContentChange }) {
  const imageClasses = getImageClassNames(content.imageStyle, imageDefaults);
  const adjacentItems = Array.isArray(content.adjacentItems) ? content.adjacentItems : [];
  const hasCustomWidth = Number.isFinite(Number(content.imageStyle?.widthPercent));
  const tone = getSectionTone(content.style, sectionDefaults);

  const updateSize = (dimensions) => {
    onContentChange?.({
      ...content,
      imageStyle: { ...(content.imageStyle || {}), ...dimensions },
    });
  };

  return (
    <PageSectionContainer content={content} defaults={sectionDefaults}>
      <div className={adjacentItems.length > 0 ? "flex flex-col gap-6 md:flex-row md:items-stretch" : ""}>
        <ResizableImageFrame
          editorMode={editorMode}
          onResize={updateSize}
          widthPercent={content.imageStyle?.widthPercent}
          heightPx={content.imageStyle?.heightPx}
          className={`mx-auto shrink-0 overflow-hidden bg-slate-100 ${imageClasses.wrapper} ${adjacentItems.length > 0 && !hasCustomWidth ? "md:w-1/2" : ""}`}
        >
          {content.imageUrl ? (
            <img src={content.imageUrl} alt={content.alt || ""} className={`h-full w-full ${imageClasses.image}`} />
          ) : (
            <div className="flex h-full min-h-52 items-center justify-center text-sm text-slate-400">Kép helye</div>
          )}
        </ResizableImageFrame>

        {adjacentItems.length > 0 && (
          <div className={`grid min-w-0 flex-1 gap-6 ${adjacentItems.length > 1 ? "sm:grid-cols-2" : ""}`}>
            {adjacentItems.map((item, index) =>
              item.type === "IMAGE" ? (
                <div key={index} className={`overflow-hidden bg-slate-100 ${imageClasses.radius}`}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.alt || ""} className={`h-full min-h-52 w-full ${imageClasses.fit} ${imageClasses.position}`} />
                  ) : (
                    <div className="flex h-full min-h-52 items-center justify-center text-sm text-slate-400">További kép helye</div>
                  )}
                </div>
              ) : (
                <div key={index} className="flex flex-col justify-center p-3 sm:p-5">
                  {item.heading && <h3 className={`text-2xl font-semibold tracking-tight ${tone.heading}`}>{item.heading}</h3>}
                  <RichTextContent document={item.richText} fallbackText={item.text} className={`mt-4 ${tone.body}`} />
                </div>
              )
            )}
          </div>
        )}
      </div>
    </PageSectionContainer>
  );
}
