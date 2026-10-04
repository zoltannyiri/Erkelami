import { useState } from "react";

import { createEmptySectionContent, PAGE_SECTION_TYPES } from "../../config/pageSectionTypes";
import SectionFields from "./SectionFields";

export default function NewSectionForm({ onCancel, onCreate }) {
  const [type, setType] = useState("TEXT");
  const [content, setContent] = useState(() => createEmptySectionContent("TEXT"));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleTypeChange = (event) => {
    const nextType = event.target.value;
    setType(nextType);
    setContent(createEmptySectionContent(nextType));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onCreate({ type, content });
    } catch (error) {
      console.error("Blokk létrehozási hiba:", error);
      setError(error.response?.data?.message || error.response?.data?.error || "A blokk nem hozható létre.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 border border-slate-200 bg-slate-50 p-6">
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">Blokk típusa</label>
        <select value={type} onChange={handleTypeChange} className="w-full border border-slate-300 bg-white px-4 py-3">
          {PAGE_SECTION_TYPES.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <SectionFields type={type} content={content} onChange={setContent} />
      {error && <div className="mt-5 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-5 py-3 text-sm text-slate-600">Mégse</button>
        <button type="submit" disabled={saving} className="bg-slate-950 px-5 py-3 text-sm font-medium text-white disabled:opacity-50">{saving ? "Hozzáadás..." : "Blokk hozzáadása"}</button>
      </div>
    </form>
  );
}
