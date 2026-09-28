import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminPageCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    slug: '',
    published: false,
    metaTitle: '',
    metaDescription: '',
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
      navigate(`/admin/pages/${response.data.id}`);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.error || 'Hiba történt az oldal létrehozásakor.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-3xl px-8">

        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            Oldalak
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-slate-950">
            Új oldal
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-slate-200 bg-white p-8"
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
                className="w-full border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
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
                className="w-full border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                placeholder="Automatikusan generálódik, ha üresen hagyod"
              />

              <p className="mt-2 text-xs text-slate-500">
                Például: hegedu-tanszak
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Meta title
              </label>

              <input
                name="metaTitle"
                value={form.metaTitle}
                onChange={handleChange}
                className="w-full border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
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
                className="w-full resize-none border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="published"
                checked={form.published}
                onChange={handleChange}
                className="h-4 w-4"
              />

              <span className="text-sm font-medium text-slate-700">
                Oldal publikálása
              </span>
            </label>

            {error && (
              <div className="bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
              <button
                type="button"
                onClick={() => navigate("/admin/pages")}
                className="px-5 py-3 text-sm font-medium text-slate-600"
              >
                Mégse
              </button>

              <button
                type="submit"
                disabled={saving}
                className="bg-slate-950 px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
              >
                {saving ? "Mentés..." : "Oldal létrehozása"}
              </button>
            </div>

          </div>
        </form>

      </div>
    </main>
  );
}