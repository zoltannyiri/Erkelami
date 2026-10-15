import { getSectionDisplayName, getSectionTypeLabel } from "../../config/pageSectionTypes";

export default function SectionList({ sections, onMove, onEdit, onDelete }) {
  if (sections.length === 0) {
    return <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-10 text-center text-slate-500">Ehhez az oldalhoz még nincs tartalmi blokk.</div>;
  }

  return sections.map((section, index) => (
    <div key={section.id} className="gap-4 rounded-2xl border border-slate-200/80 p-5 transition hover:border-slate-300 hover:bg-slate-50/70 hover:shadow-sm sm:flex sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white shadow-sm">{index + 1}</div>
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-950">{getSectionDisplayName(section)}</p>
          <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">{getSectionTypeLabel(section.type)}{section.visible ? "" : " · rejtett"}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-0 sm:flex-nowrap">
        <button type="button" onClick={() => onMove(index, "up")} disabled={index === 0} className="h-9 w-9 rounded-xl border border-slate-200 bg-white text-sm shadow-sm disabled:cursor-not-allowed disabled:opacity-30" title="Mozgatás felfelé">↑</button>
        <button type="button" onClick={() => onMove(index, "down")} disabled={index === sections.length - 1} className="h-9 w-9 rounded-xl border border-slate-200 bg-white text-sm shadow-sm disabled:cursor-not-allowed disabled:opacity-30" title="Mozgatás lefelé">↓</button>
        <button type="button" onClick={() => onEdit(section)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition hover:border-slate-300">Szerkesztés</button>
        <button type="button" onClick={() => onDelete(section)} className="rounded-xl px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Törlés</button>
      </div>
    </div>
  ));
}
