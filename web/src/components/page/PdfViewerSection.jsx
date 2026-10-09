import { getSectionTone } from "../../config/pageSectionStyles";
import PageSectionContainer from "./PageSectionContainer";
import SmartLink from "../common/SmartLink";

const defaults = {
  background: "white",
  width: "wide",
  spacing: "normal",
  textAlign: "left",
};

const heightClasses = {
  medium: "h-[500px] sm:h-[600px]",
  large: "h-[650px] sm:h-[800px]",
  extraLarge: "h-[800px] sm:h-[1000px]",
};

export default function PdfViewerSection({ content = {}, editorMode = false }) {
  const tone = getSectionTone(content.style, defaults);
  const hasHeading = Boolean(content.heading && content.heading.trim());
  const hasDescription = Boolean(content.description && content.description.trim());
  const hasUrl = Boolean(content.pdfUrl && content.pdfUrl.trim());
  const height = heightClasses[content.height] ? content.height : "large";

  if (!hasUrl && !hasHeading && !hasDescription) {
    if (editorMode) {
      return (
        <PageSectionContainer content={content} defaults={defaults}>
          <div className="border border-dashed border-slate-300 p-12 text-center text-sm text-slate-400">
            PDF megjelenítő blokk (még nincs megadva cím vagy PDF URL)
          </div>
        </PageSectionContainer>
      );
    }
    return null;
  }

  return (
    <PageSectionContainer content={content} defaults={defaults}>
      {(hasHeading || hasDescription) && (
        <div className="mb-6 sm:mb-8">
          {hasHeading && (
            <h2
              className={`text-2xl font-semibold tracking-tight sm:text-3xl ${tone.heading}`}
            >
              {content.heading}
            </h2>
          )}
          {hasDescription && (
            <p className={`mt-2 text-base leading-7 ${tone.body}`}>
              {content.description}
            </p>
          )}
        </div>
      )}

      {hasUrl ? (
        <div className="space-y-3">

          <div className="overflow-hidden rounded-b-sm border border-slate-200 bg-white shadow-sm">
            <iframe
              src={content.pdfUrl.trim()}
              className={`w-full border-0 ${heightClasses[height]}`}
              title={content.heading || "PDF dokumentum"}
            />
          </div>
        </div>
      ) : editorMode ? (
        <div className="rounded border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-sm text-slate-500">
          A PDF megjelenítő be van illesztve, de még nincs megadva PDF URL vagy feltöltött fájl.
        </div>
      ) : null}
    </PageSectionContainer>
  );
}
