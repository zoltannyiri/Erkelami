import SectionFields from "../../admin/SectionFields";

export default function VisualEditorPanel({ section, onContentChange, onVisibleChange, onSave, saving, error }) {
  if (!section) {
    return (
      <aside className="border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-500 xl:sticky xl:top-4">
        Jelölj ki egy blokkot az előnézetben a tartalom és a megjelenés szerkesztéséhez.
      </aside>
    );
  }

  return (
    <aside className="border border-slate-200 bg-white xl:sticky xl:top-4 xl:max-h-[calc(100vh-2rem)] xl:overflow-y-auto">
      <form onSubmit={onSave}>
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Kijelölt blokk</p>
              <h2 className="mt-1 font-semibold text-slate-950">{section.type}</h2>
            </div>
            <button type="submit" disabled={saving} className="bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
              {saving ? "Mentés..." : "Mentés"}
            </button>
          </div>
        </div>

        <div className="space-y-6 p-5">
          <SectionFields type={section.type} content={section.content || {}} onChange={onContentChange} />

          <label className="flex items-center gap-3 border-t border-slate-200 pt-5">
            <input type="checkbox" checked={section.visible} onChange={(event) => onVisibleChange(event.target.checked)} />
            <span className="text-sm font-medium text-slate-700">A blokk látható</span>
          </label>

          {error && <div className="bg-red-50 p-4 text-sm text-red-700">{error}</div>}

          <button type="submit" disabled={saving} className="w-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
            {saving ? "Mentés..." : "Blokk mentése"}
          </button>
        </div>
      </form>
    </aside>
  );
}
