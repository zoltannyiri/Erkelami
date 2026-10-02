import { useState } from "react";
import axios from "axios";

export default function NavigationItemForm({ item = null, parent = null, menuKey = "TOP_LEVEL", pages = [], navigationItems = [], onClose, onSaved }) {
  const isEditing = Boolean(item);

  const [form, setForm] = useState(() => ({
    label: item?.label || "",
    menuKey: item?.menuKey || menuKey,
    parentId: item?.parentId || parent?.id || null,
    pageId: item?.pageId || null,
    externalUrl: item?.externalUrl || "",
    visible: item?.visible ?? true,
  }));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value === ""
            ? null
            : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError(null);

    const payload = {
      label: form.label,
      menuKey: form.menuKey,
      parentId: form.parentId,
      pageId: form.pageId,
      externalUrl: form.externalUrl || null,
      visible: form.visible,
    };

    try {
      if (isEditing) {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/api/admin/navigation/${item.id}`,
          payload
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/admin/navigation`,
          payload
        );
      }

      await onSaved();
    } catch (error) {
      console.error("Navigáció mentési hiba:", error);

      setError(
        error.response?.data?.message ||
          "Hiba történt a menüpont mentésekor."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 border border-slate-300 bg-slate-50 p-6"
    >
      <h3 className="mb-6 text-lg font-semibold">
        {isEditing
          ? "Menüpont szerkesztése"
          : parent
            ? `Új menüpont: ${parent.label} alatt`
            : "Új menüpont"}
      </h3>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Megnevezés
          </label>

          <input
            name="label"
            value={form.label || ""}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 bg-white px-4 py-3"
          />
        </div>

        {!form.parentId && (
          <div>
            <label className="mb-2 block text-sm font-medium">
              Menü
            </label>

            <select
              name="menuKey"
              value={form.menuKey}
              onChange={handleChange}
              className="w-full border border-slate-300 bg-white px-4 py-3"
            >
              <option value="TOP_LEVEL">Fő navigáció</option>
              <option value="SUCCESSES">Sikereink</option>
            </select>
          </div>
        )}

        {isEditing && (
          <div>
            <label className="mb-2 block text-sm font-medium">
              Szülő menüpont
            </label>

            <select
              name="parentId"
              value={form.parentId || ""}
              onChange={handleChange}
              className="w-full border border-slate-300 bg-white px-4 py-3"
            >
              <option value="">Nincs szülő</option>

              {navigationItems
                .filter(
                  (navigationItem) =>
                    navigationItem.id !== item?.id &&
                    navigationItem.menuKey === form.menuKey
                )
                .map((navigationItem) => (
                  <option
                    key={navigationItem.id}
                    value={navigationItem.id}
                  >
                    {navigationItem.label}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Dinamikus oldal
          </label>

          <select
            name="pageId"
            value={form.pageId || ""}
            onChange={handleChange}
            className="w-full border border-slate-300 bg-white px-4 py-3"
          >
            <option value="">Nincs oldal</option>

            {pages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.title} (/{page.slug})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Külső link
          </label>

          <input
            name="externalUrl"
            value={form.externalUrl || ""}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full border border-slate-300 bg-white px-4 py-3"
          />

          <p className="mt-2 text-xs text-slate-500">
            Ha dinamikus oldalt választasz, ezt hagyd üresen.
          </p>
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="visible"
            checked={form.visible}
            onChange={handleChange}
          />

          <span className="text-sm font-medium">
            Látható
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
            className="px-5 py-3 text-sm"
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
                : "Menüpont létrehozása"}
          </button>
        </div>
      </div>
    </form>
  );
}