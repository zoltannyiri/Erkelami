import { getSectionDisplayName } from "../../config/pageSectionTypes";

export default function SectionList({ sections, onMove, onEdit, onDelete }) {
  if (sections.length === 0) {
    return <div className="border border-dashed border-slate-300 p-10 text-center text-slate-500">Ehhez az oldalhoz még nincs tartalmi blokk.</div>;
  }

  return sections.map((section, index) => (
    <div key={section.id} className="gap-4 border border-slate-200 p-5 sm:flex sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-slate-100 text-sm font-medium text-slate-500">{index + 1}</div>
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-950">{getSectionDisplayName(section)}</p>
          <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">{section.type}{section.visible ? "" : " · rejtett"}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-0 sm:flex-nowrap">
        <button type="button" onClick={() => onMove(index, "up")} disabled={index === 0} className="border border-slate-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-30" title="Mozgatás felfelé">↑</button>
        <button type="button" onClick={() => onMove(index, "down")} disabled={index === sections.length - 1} className="border border-slate-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-30" title="Mozgatás lefelé">↓</button>
        <button type="button" onClick={() => onEdit(section)} className="border border-slate-300 px-4 py-2 text-sm">Szerkesztés</button>
        <button type="button" onClick={() => onDelete(section)} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50">Törlés</button>
      </div>
    </div>
  ));
}
