import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import PageTemplateSelector from "../../components/admin/PageTemplateSelector";

export default function AdminPageCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    slug: '',
    published: false,
    metaTitle: '',
    metaDescription: '',
    templateKey: 'SIMPLE_INFO',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/pages`, form);
      navigate(`/admin/pages/${response.data.id}/visual`);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          'Hiba történt az oldal létrehozásakor.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl">
      <AdminPageHeader
        title="Új oldal"
        description="Új dinamikus oldal létrehozása."
        backTo="/admin/pages"
        backLabel="Vissza az oldalakhoz"
      />

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-white bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.07)] ring-1 ring-slate-200/70 sm:p-8"
      >
          <div className="space-y-7">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Oldal címe
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                placeholder="pl. Hegedű tanszak"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Slug
              </label>

              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                placeholder="Automatikusan generálódik, ha üresen hagyod"
              />

              <p className="mt-2 text-xs text-slate-500">
                Például: hegedu-tanszak
              </p>
            </div>

            <PageTemplateSelector
              value={form.templateKey}
              onChange={(templateKey) =>
                setForm((current) => ({ ...current, templateKey }))
              }
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Meta title
              </label>

              <input
                name="metaTitle"
                value={form.metaTitle}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Meta description
              </label>

              <textarea
                name="metaDescription"
                value={form.metaDescription}
                onChange={handleChange}
                rows={4}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="published"
                checked={form.published}
                onChange={handleChange}
                className="h-5 w-5 rounded border-slate-300 accent-amber-500"
              />

              <span className="text-sm font-medium text-slate-700">
                Oldal publikálása
              </span>
            </label>

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
              <button
                type="button"
                onClick={() => navigate("/admin/pages")}
                className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Mégse
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-50"
              >
                {saving ? "Mentés..." : "Oldal létrehozása"}
              </button>
            </div>

          </div>
        </form>

    </main>
  );
}
