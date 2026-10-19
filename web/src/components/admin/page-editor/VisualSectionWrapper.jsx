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
  dragging,
  dragOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) {
  return (
    <div
      onDragOver={(event) => {
        if (event.target.closest(".rich-text-editor")) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        onDragOver();
      }}
      onDrop={(event) => {
        if (event.target.closest(".rich-text-editor")) return;
        event.preventDefault();
        event.stopPropagation();
        onDrop();
      }}
      onClick={(event) => {
        if (event.target.closest("a")) event.preventDefault();
        onSelect();
      }}
      role="group"
      tabIndex={0}
      aria-label={`${section.type} blokk${selected ? ", kijelölve" : ""}`}
      onKeyDown={(event) => {
        if (event.target.closest("[contenteditable='true'], input, textarea, select, button")) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      className={`group relative cursor-pointer transition ${dragging ? "opacity-45" : ""} ${
        dragOver ? "z-20 ring-4 ring-inset ring-sky-500" : selected ? "z-10 ring-2 ring-inset ring-amber-600" : "hover:ring-1 hover:ring-inset hover:ring-slate-400 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-700 focus-visible:outline-none"
      }`}
    >
      <div className={`absolute right-2 top-2 z-30 flex max-w-[calc(100%-1rem)] flex-wrap items-center justify-end gap-1 border bg-white/90 p-1 shadow-sm backdrop-blur transition ${selected ? "border-amber-600 opacity-100" : "border-slate-200 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"}`}>
        <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-600">
          {getSectionTypeLabel(section.type)}{section.visible ? "" : " · rejtett"}
        </span>
        <button type="button" onClick={(event) => { event.stopPropagation(); onSelect(); }} className="bg-slate-950 px-2.5 py-1.5 text-xs font-medium text-white">Kijelölés</button>
        <button
          type="button"
          draggable
          title="Fogd meg, és húzd a blokkot a kívánt helyre"
          onClick={(event) => event.stopPropagation()}
          onDragStart={(event) => {
            event.stopPropagation();
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", section.id);
            onDragStart();
          }}
          onDragEnd={(event) => {
            event.stopPropagation();
            onDragEnd();
          }}
          className="cursor-grab border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 active:cursor-grabbing"
        >
          ⠿ Mozgatás
        </button>
        <button type="button" disabled={first} onClick={(event) => { event.stopPropagation(); onMove("up"); }} className="border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-30">↑ Feljebb</button>
        <button type="button" disabled={last} onClick={(event) => { event.stopPropagation(); onMove("down"); }} className="border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-30">↓ Lejjebb</button>
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
