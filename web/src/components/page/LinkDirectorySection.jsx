import { getSectionTone, sanitizeLinkUrl } from "../../config/pageSectionStyles";
import PageSectionContainer from "./PageSectionContainer";

const defaults = { background: "white", width: "wide", spacing: "large" };

function normalizeLinkUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "";

  const normalized = /^(?:https?:|mailto:|tel:)/i.test(url) || url.startsWith("/") || url.startsWith("#")
    ? url
    : `https://${url}`;

  return sanitizeLinkUrl(normalized);
}

function getHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return String(url || "").replace(/^https?:\/\//, "").split("/")[0];
  }
}

export default function LinkDirectorySection({ content = {} }) {
  const tone = getSectionTone(content.style, defaults);
  const links = Array.isArray(content.links)
    ? content.links.filter((link) => link?.title?.trim() || link?.url?.trim())
    : [];

  return (
    <PageSectionContainer content={content} defaults={defaults}>
      <header className="flex flex-col gap-5 border-b border-stone-200 pb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-10 sm:pb-10">
        <div className="max-w-2xl">
          <h2 className={`text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl ${tone.heading}`}>
            {content.heading || "Fontos linkek"}
          </h2>
          {content.intro && <p className={`mt-4 text-base leading-7 ${tone.body}`}>{content.intro}</p>}
        </div>
        <p className="shrink-0 pb-1 text-sm tabular-nums text-slate-500">{links.length} hivatkozás</p>
      </header>

      <div className="mt-7 grid gap-4 sm:mt-9 md:grid-cols-2 lg:grid-cols-3">
        {links.map((link, index) => {
          const href = normalizeLinkUrl(link.url);
          const host = getHost(href || link.url);
          const card = (
            <>
              <div className="flex min-h-7 items-start justify-between gap-5">
                {host && <p className="truncate text-xs font-medium text-slate-500">{host}</p>}
                <span className="shrink-0 text-xs tabular-nums text-slate-300">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="mt-7 flex flex-1 flex-col">
                <h3 className={`text-xl font-semibold leading-snug tracking-[-0.02em] ${tone.heading}`}>{link.title}</h3>
                {link.description && <p className={`mt-3 max-w-lg text-sm leading-6 ${tone.body}`}>{link.description}</p>}
                <span className="mt-auto inline-flex self-start border-b border-stone-300 pt-7 pb-1 text-sm font-semibold text-slate-700 transition group-hover:border-amber-700 group-hover:text-amber-800">
                  Weboldal megnyitása
                  <span aria-hidden="true" className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </>
          );

          const className = "group flex min-h-72 flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.02)] transition duration-300 hover:-translate-y-1 hover:border-amber-700/35 hover:shadow-[0_18px_45px_rgba(51,39,24,0.08)] sm:p-7";

          return href ? (
            <a key={`${link.title}-${index}`} href={href} target="_blank" rel="noreferrer" className={className}>
              {card}
            </a>
          ) : (
            <article key={`${link.title}-${index}`} className={className}>
              {card}
            </article>
          );
        })}
      </div>
    </PageSectionContainer>
  );
}
