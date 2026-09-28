import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SectionEditForm({ section, onClose, onSaved }) {
  const [content, setContent] = useState(section.content || {});
  const [visible, setVisible] = useState(section.visible);
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setContent((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/sections/${section.id}`, { content, visible }
      );

      await onSaved();
    } catch (error) {
      console.error("Blokk módosítási hiba:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 border border-slate-300 bg-slate-50 p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Blokk szerkesztése
        </h3>

        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {section.type}
        </span>
      </div>

      {section.type === "TEXT" && (
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Cím
            </label>

            <input
              name="heading"
              value={content.heading || ""}
              onChange={handleChange}
              className="w-full border border-slate-300 bg-white px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Szöveg
            </label>

            <textarea
              name="text"
              value={content.text || ""}
              onChange={handleChange}
              rows={8}
              className="w-full resize-none border border-slate-300 bg-white px-4 py-3"
            />
          </div>
        </div>
      )}

      {section.type === "IMAGE" && (
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Kép URL
            </label>

            <input
              name="imageUrl"
              value={content.imageUrl || ""}
              onChange={handleChange}
              className="w-full border border-slate-300 bg-white px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Alt szöveg
            </label>

            <input
              name="alt"
              value={content.alt || ""}
              onChange={handleChange}
              className="w-full border border-slate-300 bg-white px-4 py-3"
            />
          </div>
        </div>
      )}

      <label className="mt-5 flex items-center gap-3">
        <input
          type="checkbox"
          checked={visible}
          onChange={(event) => setVisible(event.target.checked)}
          className="cursor-pointer"
        />

        <span className="text-sm">Látható</span>
      </label>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer px-5 py-3 text-sm text-slate-600"
        >
          Mégse
        </button>

        <button
          type="submit"
          disabled={saving}
          className="cursor-pointer bg-slate-950 px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "Mentés..." : "Mentés"}
        </button>
      </div>
    </form>
  );
}