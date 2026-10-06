import { useState } from "react";
import axios from "axios";
import FileUploadField from "./FileUploadField";

export default function HomeItemForm({ sectionId, item = null, onClose, onSaved }) {
  const isEditing = Boolean(item);

  const [form, setForm] = useState({
    title: item?.title || "",
    imageUrl: item?.imageUrl || "",
    linkUrl: item?.linkUrl || "",
    visible: item?.visible ?? true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError(null);

    try {
      if (isEditing) {
        await axios.patch(`${import.meta.env.VITE_API_URL}/api/admin/home/items/${item.id}`, form);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/home/sections/${sectionId}/items`, form);
      }

      await onSaved();
    } catch (error) {
      console.error("Homepage elem mentési hiba:", error);
      setError(error.response?.data?.message || error.response?.data?.error || "Hiba történt a mentés során.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 border border-slate-300 bg-slate-50 p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-950">
          {isEditing ? "Csempe szerkesztése" : "Új csempe"}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          A főoldalon megjelenő csempe adatai.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Cím
          </label>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-950"
            placeholder="pl. Szolfézs csoportok és órarend"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Kép
          </label>

          <FileUploadField
            category="image"
            accept=".jpg,.jpeg,.png,.webp"
            label="Kép feltöltése"
            onUploaded={(uploadedFile) => {
              setForm((current) => ({
                ...current,
                imageUrl: uploadedFile.url,
              }));
            }}
          />

          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className="mt-4 w-full border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-950"
            placeholder="/uploads/images/... vagy https://..."
          />

          <p className="mt-2 text-xs text-slate-500">
            Feltölthetsz képet, vagy megadhatsz egy kép URL-t kézzel.
          </p>
        </div>

        {form.imageUrl && (
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">
              Előnézet
            </p>

            <div className="h-40 w-64 overflow-hidden border border-slate-200 bg-white">
              <img
                src={form.imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Link
          </label>

          <input
            name="linkUrl"
            value={form.linkUrl}
            onChange={handleChange}
            className="w-full border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-950"
            placeholder="/szolfezs vagy https://..."
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            name="visible"
            checked={form.visible}
            onChange={handleChange}
          />

          <span className="text-sm font-medium text-slate-700">
            Látható a főoldalon
          </span>
        </label>

        {error && (
          <div className="bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 text-sm font-medium text-slate-600"
          >
            Mégse
          </button>

          <button
            type="submit"
            disabled={saving}
            className="bg-slate-950 px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving
              ? "Mentés..."
              : isEditing
                ? "Változtatások mentése"
                : "Csempe létrehozása"}
          </button>
        </div>
      </div>
    </form>
  );
}