import PageSectionRenderer from "../../page/PageSectionRenderer";

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
}) {
  return (
    <div
      onClick={(event) => {
        if (event.target.closest("a")) event.preventDefault();
        onSelect();
      }}
      className={`group relative cursor-pointer transition ${
        selected ? "z-10 ring-2 ring-inset ring-amber-500" : "hover:ring-2 hover:ring-inset hover:ring-slate-400"
      }`}
    >
      <div className={`absolute right-3 top-3 z-30 flex items-center gap-1 border bg-white/95 p-1 shadow-lg transition ${selected ? "border-amber-500 opacity-100" : "border-slate-200 opacity-0 group-hover:opacity-100"}`}>
        <span className="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          {section.type}{section.visible ? "" : " · rejtett"}
        </span>
        <button type="button" onClick={(event) => { event.stopPropagation(); onSelect(); }} className="bg-slate-950 px-2.5 py-1.5 text-xs font-medium text-white">Szerkesztés</button>
        <button type="button" disabled={first} onClick={(event) => { event.stopPropagation(); onMove("up"); }} className="border border-slate-200 px-2 py-1 text-sm disabled:opacity-30">↑</button>
        <button type="button" disabled={last} onClick={(event) => { event.stopPropagation(); onMove("down"); }} className="border border-slate-200 px-2 py-1 text-sm disabled:opacity-30">↓</button>
        <button type="button" onClick={(event) => { event.stopPropagation(); onDelete(); }} className="px-2 py-1 text-xs font-medium text-red-600">Törlés</button>
      </div>
      <PageSectionRenderer
        section={section}
        pageTitle={pageTitle}
        editorMode
        onContentChange={onContentChange}
      />
    </div>
  );
}
