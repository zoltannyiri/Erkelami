import { EditorGroup, TextAreaField, TextField } from "../FormControls";

const actionClass = "rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30";

export default function LinkDirectoryEditor({ content, updateField }) {
  const links = Array.isArray(content.links) ? content.links : [];

  const updateLink = (index, updates) => {
    const next = [...links];
    next[index] = { ...next[index], ...updates };
    updateField("links", next);
  };

  const moveLink = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= links.length) return;
    const next = [...links];
    [next[index], next[target]] = [next[target], next[index]];
    updateField("links", next);
  };

  return (
    <>
      <EditorGroup title="Oldal bevezetője">
        <TextField label="Blokk címe" value={content.heading} onChange={(value) => updateField("heading", value)} />
        <TextAreaField label="Rövid bevezető" value={content.intro} onChange={(value) => updateField("intro", value)} rows={3} />
      </EditorGroup>

      <EditorGroup title="Linkek" description="A publikus oldalon is az itt beállított sorrend jelenik meg.">
        {links.map((link, index) => (
          <details key={index} className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 marker:content-none">
              <span className="min-w-0 truncate text-sm font-semibold text-slate-950">{index + 1}. {link.title || "Névtelen link"}</span>
              <span className="shrink-0 text-xs font-semibold text-slate-400 transition-transform group-open:rotate-180">⌄</span>
            </summary>
            <div className="space-y-4 border-t border-slate-200 p-4">
              <div className="flex justify-end gap-1.5">
                <button type="button" className={actionClass} disabled={index === 0} onClick={() => moveLink(index, -1)}>↑</button>
                <button type="button" className={actionClass} disabled={index === links.length - 1} onClick={() => moveLink(index, 1)}>↓</button>
                <button type="button" className={`${actionClass} text-red-600`} onClick={() => updateField("links", links.filter((_, itemIndex) => itemIndex !== index))}>Törlés</button>
              </div>
              <TextField label="Megnevezés" value={link.title} onChange={(value) => updateLink(index, { title: value })} />
              <TextField label="Webcím (https:// nélkül is megadható)" value={link.url} onChange={(value) => updateLink(index, { url: value })} placeholder="pelda.hu" />
              <TextAreaField label="Rövid leírás (opcionális)" value={link.description} onChange={(value) => updateLink(index, { description: value })} rows={2} />
            </div>
          </details>
        ))}
        <button
          type="button"
          className="w-full rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-amber-400 hover:text-slate-950"
          onClick={() => updateField("links", [...links, { title: "", url: "", description: "" }])}
        >
          + Új link hozzáadása
        </button>
      </EditorGroup>
    </>
  );
}
