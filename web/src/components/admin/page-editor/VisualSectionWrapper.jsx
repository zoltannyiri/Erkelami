import PageSectionRenderer from "../../page/PageSectionRenderer";
import { getSectionTypeLabel } from "../../../config/pageSectionTypes";

export default function VisualSectionWrapper({
  section,
  pageTitle,
  selected,
  first,
  last,
  onSelect,
  onMove,
  onDelete,
  onContentChange,
  previewMode,
}) {
  return (
    <div
      onClick={(event) => {
        if (event.target.closest("a")) event.preventDefault();
        onSelect();
      }}
      role="group"
      tabIndex={0}
      aria-label={`${section.type} blokk${selected ? ", kijelölve" : ""}`}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      className={`group relative cursor-pointer transition ${
        selected ? "z-10 ring-2 ring-inset ring-amber-600" : "hover:ring-1 hover:ring-inset hover:ring-slate-400 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-700 focus-visible:outline-none"
      }`}
    >
      <div className={`absolute right-2 top-2 z-30 flex max-w-[calc(100%-1rem)] flex-wrap items-center justify-end gap-1 border bg-white/90 p-1 shadow-sm backdrop-blur transition ${selected ? "border-amber-600 opacity-100" : "border-slate-200 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"}`}>
        <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-600">
          {getSectionTypeLabel(section.type)}{section.visible ? "" : " · rejtett"}
        </span>
        <button type="button" onClick={(event) => { event.stopPropagation(); onSelect(); }} className="bg-slate-950 px-2.5 py-1.5 text-xs font-medium text-white">Kijelölés</button>
        <button type="button" disabled={first} onClick={(event) => { event.stopPropagation(); onMove("up"); }} className="border border-slate-200 px-2 py-1 text-sm disabled:opacity-30">↑</button>
        <button type="button" disabled={last} onClick={(event) => { event.stopPropagation(); onMove("down"); }} className="border border-slate-200 px-2 py-1 text-sm disabled:opacity-30">↓</button>
        <button type="button" onClick={(event) => { event.stopPropagation(); onDelete(); }} className="px-2 py-1 text-xs font-medium text-red-600">Törlés</button>
      </div>
      <PageSectionRenderer
        section={section}
        pageTitle={pageTitle}
        editorMode
        imageResizeEnabled={selected}
        previewMode={previewMode}
        onContentChange={onContentChange}
      />
    </div>
  );
}
