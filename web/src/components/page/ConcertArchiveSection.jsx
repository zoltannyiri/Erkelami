import { useMemo, useState } from "react";

import { normalizeConcertArchiveContent } from "../../config/concertArchive";
import { sanitizeImageUrl, sanitizeLinkUrl } from "../../config/pageSectionStyles";
import PageSectionContainer from "./PageSectionContainer";

const defaults = { background: "white", width: "wide", spacing: "large" };
const monthNames = ["JAN", "FEB", "MÁR", "ÁPR", "MÁJ", "JÚN", "JÚL", "AUG", "SZE", "OKT", "NOV", "DEC"];
const accents = ["bg-amber-700", "bg-rose-700", "bg-teal-700", "bg-indigo-700"];

function getDateParts(value) {
  const match = String(value || "").match(/^(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})(?:\s*[-–]\s*(?:\d{4}\.\s*\d{1,2}\.)?(\d{1,2}))?/);
  if (!match) return { day: "—", month: "", year: "" };
  return {
    day: match[4] ? `${match[3]}–${match[4]}` : match[3],
    month: monthNames[Number(match[2]) - 1] || "",
    year: match[1],
  };
}

function ConcertCard({ event, index }) {
  const date = getDateParts(event.date);
  const imageUrl = sanitizeImageUrl(event.imageUrl);
  const linkUrl = sanitizeLinkUrl(event.linkUrl);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_8px_28px_rgba(51,39,24,0.06)] transition duration-300 hover:-translate-y-1 hover:border-amber-700/30 hover:shadow-[0_20px_46px_rgba(51,39,24,0.11)]">
      {imageUrl ? (
        <div className="aspect-[16/9] overflow-hidden bg-stone-100">
          <img src={imageUrl} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" />
        </div>
      ) : (
        <div className={`h-1.5 ${accents[index % accents.length]}`} aria-hidden="true" />
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 shrink-0 border-r border-stone-200 pr-4 text-center">
            <span className="block text-2xl font-semibold leading-none tabular-nums text-slate-950">{date.day}</span>
            <span className="mt-1.5 block text-[10px] font-bold tracking-[0.16em] text-amber-800">{date.month}</span>
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">{event.date || date.year || "Esemény"}</p>
            <h3 className="mt-2 text-lg font-semibold leading-snug tracking-[-0.02em] text-slate-950">{event.title}</h3>
          </div>
        </div>

        {event.location && <p className="mt-5 border-t border-stone-100 pt-4 text-sm font-medium text-slate-500">{event.location}</p>}
        {event.description && <p className="mt-3 text-sm leading-6 text-slate-600">{event.description}</p>}

        {linkUrl && (
          <a href={linkUrl} target="_blank" rel="noreferrer" className="mt-auto inline-flex self-start border-b border-stone-300 pt-6 pb-1 text-sm font-semibold text-slate-700 transition group-hover:border-amber-700 group-hover:text-amber-800">
            {event.buttonText || "Felvétel megtekintése"}
            <span aria-hidden="true" className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </a>
        )}
      </div>
    </article>
  );
}

export default function ConcertArchiveSection({ content = {} }) {
  const normalized = useMemo(() => normalizeConcertArchiveContent(content), [content]);
  const groups = normalized.groups.filter((group) => Array.isArray(group.events) && group.events.some((event) => event.visible !== false && event.title?.trim()));
  const [activeYear, setActiveYear] = useState(groups[0]?.label || "");

  if (groups.length === 0) return null;

  const selectedYear = groups.some((group) => group.label === activeYear) ? activeYear : groups[0].label;
  const activeGroup = groups.find((group) => group.label === selectedYear) || groups[0];
  const events = activeGroup.events.filter((event) => event.visible !== false && event.title?.trim());
  const totalEvents = groups.reduce((sum, group) => sum + group.events.filter((event) => event.visible !== false && event.title?.trim()).length, 0);

  return (
    <PageSectionContainer content={normalized} defaults={defaults}>
      <header className="border-b border-stone-200 pb-8 sm:pb-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-800">Hangversenyarchívum</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.035em] text-slate-950 sm:text-5xl">{normalized.heading}</h2>
            {normalized.intro && <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{normalized.intro}</p>}
          </div>
          <p className="shrink-0 text-sm tabular-nums text-slate-500">{totalEvents} felvétel</p>
        </div>
      </header>

      <div className="mt-7 flex gap-2 overflow-x-auto pb-2 sm:mt-9" aria-label="Tanév kiválasztása">
        {groups.map((group) => (
          <button key={group.label} type="button" onClick={() => setActiveYear(group.label)} aria-pressed={activeGroup.label === group.label} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${activeGroup.label === group.label ? "border-slate-950 bg-slate-950 text-white" : "border-stone-300 bg-white/60 text-slate-600 hover:border-amber-700 hover:text-amber-800"}`}>
            {group.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-baseline justify-between gap-5">
        <h3 className="text-xl font-semibold text-slate-950 sm:text-2xl">{activeGroup.label} tanév</h3>
        <span className="text-xs font-medium text-slate-400">{events.length} esemény</span>
      </div>

      <div className="mt-5 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event, index) => <ConcertCard key={`${event.date}-${event.title}-${index}`} event={event} index={index} />)}
      </div>
    </PageSectionContainer>
  );
}

