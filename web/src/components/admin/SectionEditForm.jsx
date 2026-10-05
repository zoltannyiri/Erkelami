import { useState } from "react";
import axios from "axios";

import { getSectionTypeLabel } from "../../config/pageSectionTypes";
import SectionFields from "./SectionFields";

export default function SectionEditForm({ section, onClose, onSaved }) {
  const [content, setContent] = useState(() => section.content || {});
  const [visible, setVisible] = useState(() => section.visible);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/sections/${section.id}`,
        { content, visible }
      );
      await onSaved();
    } catch (error) {
      console.error("Blokk módosítási hiba:", error);
      setError(error.response?.data?.message || error.response?.data?.error || "A blokk nem menthető.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 border border-slate-300 bg-slate-50 p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Blokk szerkesztése</h3>
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">{getSectionTypeLabel(section.type)}</span>
      </div>

      <SectionFields type={section.type} content={content} onChange={setContent} />

      <label className="mt-5 flex items-center gap-3">
        <input type="checkbox" checked={visible} onChange={(event) => setVisible(event.target.checked)} className="cursor-pointer" />
        <span className="text-sm">Látható</span>
      </label>

      {error && <div className="mt-5 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onClose} className="px-5 py-3 text-sm text-slate-600">Mégse</button>
        <button type="submit" disabled={saving} className="bg-slate-950 px-5 py-3 text-sm font-medium text-white disabled:opacity-50">{saving ? "Mentés..." : "Mentés"}</button>
      </div>
    </form>
  );
}
