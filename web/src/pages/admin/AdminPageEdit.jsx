import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import AdminPageHeader from "../../components/admin/AdminPageHeader";
import NewSectionForm from "../../components/admin/NewSectionForm";
import SectionEditForm from "../../components/admin/SectionEditForm";
import SectionList from "../../components/admin/SectionList";

const pageToForm = (page) => ({
  title: page.title || "",
  slug: page.slug || "",
  published: page.published || false,
  metaTitle: page.metaTitle || "",
  metaDescription: page.metaDescription || "",
});

export default function AdminPageEdit() {
  const { id } = useParams();
  const [page, setPage] = useState(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    published: false,
    metaTitle: "",
    metaDescription: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [showNewBlock, setShowNewBlock] = useState(false);

  useEffect(() => {
    let ignore = false;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/pages/${id}`)
      .then((response) => {
        if (ignore) return;
        setPage(response.data);
        setForm(pageToForm(response.data));
      })
      .catch((requestError) => {
        if (ignore) return;
        console.error(requestError);
        setError("Az oldal nem tölthető be.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const refreshPage = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/pages/${id}`
    );
    setPage(response.data);
    setForm(pageToForm(response.data));
  };

  const handleMoveSection = async (index, direction) => {
    const sections = [...page.sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= sections.length) return;

    [sections[index], sections[targetIndex]] = [sections[targetIndex], sections[index]];
    setPage((current) => ({ ...current, sections }));

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/pages/${id}/sections/reorder`,
        { sectionIds: sections.map((section) => section.id) }
      );
    } catch (requestError) {
      console.error("Sorrend módosítási hiba:", requestError);
      await refreshPage();
    }
  };

  const handlePageChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSavePage = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/pages/${id}`,
        form
      );
      await refreshPage();
    } catch (requestError) {
      console.error(requestError);
      setError(
        requestError.response?.data?.message ||
          requestError.response?.data?.error ||
          "Hiba történt az oldal mentésekor."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCreateBlock = async ({ type, content }) => {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/admin/pages/${id}/sections`,
      { type, content, visible: true }
    );
    await refreshPage();
    setShowNewBlock(false);
  };

  const handleDeleteSection = async (section) => {
    if (!window.confirm("Biztosan törölni szeretnéd ezt a blokkot?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/sections/${section.id}`
      );
      if (editingSection?.id === section.id) setEditingSection(null);
      await refreshPage();
    } catch (requestError) {
      console.error("Blokk törlési hiba:", requestError);
    }
  };

  if (loading) return <div className="p-8">Betöltés...</div>;
  if (error && !page) return <div className="p-8">{error}</div>;

  return (
    <main className="mx-auto max-w-7xl">
      <AdminPageHeader
        title={page.title}
        description={`/${page.slug}`}
        backTo="/admin/pages"
        backLabel="Vissza az oldalakhoz"
      >
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Link
            to={`/admin/pages/${id}/visual`}
            className="bg-amber-100 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-200"
          >
            Vizuális szerkesztés
          </Link>
          {page.published && (
            <Link
              to={`/${page.slug}`}
              target="_blank"
              className="border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Oldal megtekintése ↗
            </Link>
          )}
        </div>
      </AdminPageHeader>

      <form onSubmit={handleSavePage} className="mb-8 border border-slate-200 bg-white p-8">
        <h2 className="mb-6 text-xl font-semibold text-slate-950">Oldal beállításai</h2>
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Cím</label>
            <input name="title" value={form.title} onChange={handlePageChange} className="w-full border border-slate-300 px-4 py-3 outline-none focus:border-slate-950" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Slug</label>
            <input name="slug" value={form.slug} onChange={handlePageChange} className="w-full border border-slate-300 px-4 py-3 outline-none focus:border-slate-950" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Meta cím</label>
            <input name="metaTitle" value={form.metaTitle} onChange={handlePageChange} className="w-full border border-slate-300 px-4 py-3 outline-none focus:border-slate-950" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Meta leírás</label>
            <textarea name="metaDescription" value={form.metaDescription} onChange={handlePageChange} rows={3} className="w-full resize-none border border-slate-300 px-4 py-3 outline-none focus:border-slate-950" />
          </div>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="published" checked={form.published} onChange={handlePageChange} className="cursor-pointer" />
            <span className="text-sm font-medium text-slate-700">Publikált</span>
          </label>
          {error && <div className="bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="cursor-pointer bg-slate-950 px-6 py-3 text-sm font-medium text-white disabled:opacity-50">
              {saving ? "Mentés..." : "Változtatások mentése"}
            </button>
          </div>
        </div>
      </form>

      <div className="border border-slate-200 bg-white p-8">
        <div className="gap-4 sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Tartalmi blokkok</h2>
            <p className="mt-1 text-sm text-slate-500">Ezekből épül fel az oldal tartalma.</p>
          </div>
          <button type="button" onClick={() => setShowNewBlock((current) => !current)} className="mt-4 bg-slate-950 px-5 py-3 text-sm font-medium text-white sm:mt-0">
            + Új blokk
          </button>
        </div>

        {showNewBlock && (
          <NewSectionForm onCancel={() => setShowNewBlock(false)} onCreate={handleCreateBlock} />
        )}

        <div className="mt-8 space-y-3">
          <SectionList
            sections={page.sections || []}
            onMove={handleMoveSection}
            onEdit={setEditingSection}
            onDelete={handleDeleteSection}
          />
        </div>

        {editingSection && (
          <SectionEditForm
            key={editingSection.id}
            section={editingSection}
            onClose={() => setEditingSection(null)}
            onSaved={async () => {
              setEditingSection(null);
              await refreshPage();
            }}
          />
        )}
      </div>
    </main>
  );
}
