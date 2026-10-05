import { getSectionTone } from "../../config/pageSectionStyles";
import PageSectionContainer from "./PageSectionContainer";

const defaults = {
  background: "soft",
  width: "normal",
  spacing: "normal",
  textAlign: "left",
};

export default function DownloadsSection({ content = {}, editorMode = false }) {
  const files = Array.isArray(content.files) ? content.files : [];
  const tone = getSectionTone(content.style, defaults);
  const hasHeading = Boolean(content.heading && content.heading.trim());
  const hasDescription = Boolean(content.description && content.description.trim());
  const hasFiles = files.length > 0;

  if (!hasFiles && !hasHeading && !hasDescription) {
    if (editorMode) {
      return (
        <PageSectionContainer content={content} defaults={defaults}>
          <div className="border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
            Üres dokumentumok blokk (nincs megadva cím, leírás vagy fájl)
          </div>
        </PageSectionContainer>
      );
    }
    return null;
  }

  const cardBaseStyle = tone.dark
    ? "border border-slate-800 bg-slate-900/90 text-white"
    : "border border-slate-200 bg-white text-slate-900 shadow-sm";

  const cardHoverStyle = tone.dark
    ? "hover:border-slate-600 hover:bg-slate-800/90"
    : "hover:border-slate-400 hover:shadow-md";

  const badgeStyle = tone.dark
    ? "bg-slate-800 text-slate-200 border border-slate-700"
    : "bg-slate-100 text-slate-700 border border-slate-200";

  return (
    <PageSectionContainer content={content} defaults={defaults}>
      {(hasHeading || hasDescription) && (
        <div className="mb-8">
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

      {hasFiles && (
        <div className="grid gap-4">
          {files.map((file, index) => {
            const hasUrl = Boolean(file.fileUrl && file.fileUrl.trim());
            const fileType = (file.fileType || "PDF").toUpperCase();

            const cardInner = (
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-base sm:text-lg">
                      {file.title || "Névtelen dokumentum"}
                    </h3>
                  </div>
                  {file.description && (
                    <p
                      className={`mt-1 text-sm leading-6 ${
                        tone.dark ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {file.description}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-3 self-start sm:self-center">
                  <span
                    className={`rounded px-2.5 py-1 text-xs font-bold tracking-wider ${badgeStyle}`}
                  >
                    {fileType}
                  </span>

                  {hasUrl && (
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform group-hover:translate-y-0.5 ${
                        tone.dark
                          ? "bg-slate-800 text-slate-200"
                          : "bg-slate-100 text-slate-700"
                      }`}
                      title="Letöltés / Megnyitás"
                      aria-label="Letöltés / Megnyitás"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </span>
                  )}
                </div>
              </div>
            );

            if (hasUrl) {
              return (
                <a
                  key={index}
                  href={file.fileUrl.trim()}
                  target="_blank"
                  rel="noreferrer"
                  className={`group block rounded-sm transition duration-200 ${cardBaseStyle} ${cardHoverStyle}`}
                >
                  {cardInner}
                </a>
              );
            }

            return (
              <article
                key={index}
                className={`rounded-sm ${cardBaseStyle}`}
              >
                {cardInner}
              </article>
            );
          })}
        </div>
      )}
    </PageSectionContainer>
  );
}
