import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import AdminPageHeader from "../../components/admin/AdminPageHeader";
import VisualEditorPanel from "../../components/admin/page-editor/VisualEditorPanel";
import VisualSectionWrapper from "../../components/admin/page-editor/VisualSectionWrapper";

export default function AdminPageVisualEditor() {
  const { id } = useParams();
  const [page, setPage] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/pages/${id}`)
      .then((response) => {
        if (ignore) return;
        setPage(response.data);
        setSelectedId(response.data.sections?.[0]?.id || null);
      })
      .catch((requestError) => {
        if (ignore) return;
        console.error(requestError);
        setError("Az oldal nem tölthető be.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => { ignore = true; };
  }, [id]);

  const selectedSection = page?.sections?.find((section) => section.id === selectedId) || null;

  const updateSelected = (updates) => {
    setPage((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === selectedId ? { ...section, ...updates } : section
      ),
    }));
  };

  const updateSectionContent = (sectionId, content) => {
    setPage((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId ? { ...section, content } : section
      ),
    }));
  };

  const refreshSections = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/pages/${id}`);
    setPage(response.data);
    if (!response.data.sections.some((section) => section.id === selectedId)) {
      setSelectedId(response.data.sections?.[0]?.id || null);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!selectedSection) return;
    setSaving(true);
    setError(null);
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/sections/${selectedSection.id}`,
        { content: selectedSection.content, visible: selectedSection.visible }
      );
      await refreshSections();
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.response?.data?.message || requestError.response?.data?.error || "A blokk nem menthető.");
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (index, direction) => {
    const sections = [...page.sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    [sections[index], sections[targetIndex]] = [sections[targetIndex], sections[index]];
    setPage((current) => ({ ...current, sections }));
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/admin/pages/${id}/sections/reorder`, {
        sectionIds: sections.map((section) => section.id),
      });
    } catch (requestError) {
      console.error(requestError);
      await refreshSections();
    }
  };

  const handleDelete = async (section) => {
    if (!window.confirm("Biztosan törölni szeretnéd ezt a blokkot?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/sections/${section.id}`);
      const remaining = page.sections.filter((item) => item.id !== section.id);
      setPage((current) => ({ ...current, sections: remaining }));
      if (selectedId === section.id) setSelectedId(remaining[0]?.id || null);
    } catch (requestError) {
      console.error(requestError);
      setError("A blokk nem törölhető.");
    }
  };

  if (loading) return <div className="p-8">Betöltés...</div>;
  if (!page) return <div className="p-8">{error || "Az oldal nem található."}</div>;

  const startsWithHero = page.sections?.[0]?.type === "HERO";

  return (
    <main className="min-h-screen bg-slate-100 py-8">
      <AdminPageHeader title="Vizuális szerkesztés" description={`${page.title} · /${page.slug}`} backTo={`/admin/pages/${id}`} backLabel="Vissza a strukturált szerkesztőhöz">
        {page.published && <Link to={`/${page.slug}`} target="_blank" className="border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700">Publikus oldal ↗</Link>}
      </AdminPageHeader>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="min-w-0 overflow-hidden border border-slate-300 bg-white shadow-sm">
          {!startsWithHero && (
            <header className="border-b border-slate-200 bg-gradient-to-br from-stone-50 to-white py-12">
              <div className="mx-auto max-w-5xl px-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">Erkel Ferenc Alapfokú Művészeti Iskola</p>
                <h1 className="text-4xl font-semibold tracking-tight text-slate-950">{page.title}</h1>
              </div>
            </header>
          )}

          {page.sections.length === 0 && <div className="p-16 text-center text-slate-500">Az oldal még nem tartalmaz blokkot. Új blokkot a strukturált szerkesztőben adhatsz hozzá.</div>}

          {page.sections.map((section, index) => (
            <VisualSectionWrapper
              key={section.id}
              section={section}
              pageTitle={index === 0 ? page.title : undefined}
              selected={selectedId === section.id}
              first={index === 0}
              last={index === page.sections.length - 1}
              onSelect={() => { setSelectedId(section.id); setError(null); }}
              onMove={(direction) => handleMove(index, direction)}
              onDelete={() => handleDelete(section)}
              onContentChange={(content) => updateSectionContent(section.id, content)}
            />
          ))}
        </div>

        <VisualEditorPanel
          key={selectedSection?.id || "empty"}
          section={selectedSection}
          onContentChange={(content) => updateSelected({ content })}
          onVisibleChange={(visible) => updateSelected({ visible })}
          onSave={handleSave}
          saving={saving}
          error={error}
        />
      </div>
    </main>
  );
}
