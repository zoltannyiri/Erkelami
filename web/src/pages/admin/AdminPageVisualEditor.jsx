import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import VisualEditorPanel from "../../components/admin/page-editor/VisualEditorPanel";
import VisualSectionWrapper from "../../components/admin/page-editor/VisualSectionWrapper";

const sectionState = (section) => ({
  content: section?.content || {},
  visible: Boolean(section?.visible),
});

const sectionFingerprint = (section) => JSON.stringify(sectionState(section));
const savedStateMap = (sections = []) => Object.fromEntries(
  sections.map((section) => [section.id, sectionState(section)])
);

export default function AdminPageVisualEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [savedSections, setSavedSections] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/pages/${id}`)
      .then((response) => {
        if (ignore) return;
        setPage(response.data);
        setSavedSections(savedStateMap(response.data.sections));
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
  const isSectionDirty = (section) => Boolean(
    section && sectionFingerprint(section) !== JSON.stringify(savedSections[section.id] || {})
  );
  const selectedDirty = isSectionDirty(selectedSection);
  const isDirty = Boolean(page?.sections?.some(isSectionDirty));

  useEffect(() => {
    if (!isDirty) return undefined;
    const warnBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [isDirty]);

  const markChanged = () => {
    setSaveFeedback(false);
    setError(null);
  };

  const updateSelected = (updates) => {
    markChanged();
    setPage((current) => ({
      ...current,
      sections: current.sections.map((section) => section.id === selectedId ? { ...section, ...updates } : section),
    }));
  };

  const updateSectionContent = (sectionId, content) => {
    markChanged();
    setPage((current) => ({
      ...current,
      sections: current.sections.map((section) => section.id === sectionId ? { ...section, content } : section),
    }));
  };

  const refreshSections = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/pages/${id}`);
    setPage(response.data);
    setSavedSections(savedStateMap(response.data.sections));
    if (!response.data.sections.some((section) => section.id === selectedId)) {
      setSelectedId(response.data.sections?.[0]?.id || null);
    }
  };

  const restoreSelected = () => {
    const saved = savedSections[selectedId];
    if (!saved) return;
    setPage((current) => ({
      ...current,
      sections: current.sections.map((section) => section.id === selectedId ? { ...section, ...saved } : section),
    }));
  };

  const confirmDiscard = () => window.confirm(
    "A kijelölt blokk nem mentett módosításokat tartalmaz. Eldobod ezeket a változtatásokat?"
  );

  const handleSelect = (nextId) => {
    if (nextId === selectedId) return;
    if (selectedDirty && !confirmDiscard()) return;
    if (selectedDirty) restoreSelected();
    setSelectedId(nextId);
    setSaveFeedback(false);
    setError(null);
  };

  const handleBack = () => {
    if (isDirty && !confirmDiscard()) return;
    navigate(`/admin/pages/${id}`);
  };

  const handleSave = async (event) => {
    event?.preventDefault();
    if (!selectedSection || !selectedDirty) return;
    setSaving(true);
    setError(null);
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/sections/${selectedSection.id}`,
        sectionState(selectedSection)
      );
      setSavedSections((current) => ({ ...current, [selectedSection.id]: sectionState(selectedSection) }));
      setSaveFeedback(true);
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
    const message = isSectionDirty(section)
      ? "Ez a blokk nem mentett módosításokat tartalmaz. Biztosan törlöd a blokkot?"
      : "Biztosan törölni szeretnéd ezt a blokkot?";
    if (!window.confirm(message)) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/sections/${section.id}`);
      const remaining = page.sections.filter((item) => item.id !== section.id);
      setPage((current) => ({ ...current, sections: remaining }));
      setSavedSections((current) => {
        const next = { ...current };
        delete next[section.id];
        return next;
      });
      if (selectedId === section.id) setSelectedId(remaining[0]?.id || null);
    } catch (requestError) {
      console.error(requestError);
      setError("A blokk nem törölhető.");
    }
  };

  if (loading) return <div className="p-8">Betöltés...</div>;
  if (!page) return <div className="p-8">{error || "Az oldal nem található."}</div>;

  const startsWithHero = page.sections?.[0]?.type === "HERO";
  const statusText = selectedDirty ? "Nem mentett módosítások" : saveFeedback ? "Mentve" : "Nincs módosítás";

  return (
    <main className="-m-8 min-h-[calc(100vh-4rem)] bg-slate-100">
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-6 py-4 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <button type="button" onClick={handleBack} className="shrink-0 text-sm font-medium text-slate-600 transition hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950">← Vissza</button>
            <div className="min-w-0 border-l border-slate-200 pl-4">
              <p className="truncate font-semibold text-slate-950">{page.title}</p>
              <p className="truncate text-xs text-slate-500">/{page.slug}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <div className="flex border border-slate-300 bg-slate-50 p-1" aria-label="Előnézet szélessége">
              {[["desktop", "Asztali"], ["mobile", "Mobil"]].map(([value, label]) => (
                <button key={value} type="button" aria-pressed={previewMode === value} onClick={() => setPreviewMode(value)} className={`px-3 py-1.5 text-xs font-semibold transition ${previewMode === value ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>{label}</button>
              ))}
            </div>
            {page.published ? (
              <Link to={`/${page.slug}`} target="_blank" className="border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950">Publikus előnézet ↗</Link>
            ) : (
              <span title="Az oldal még nincs publikálva" className="cursor-not-allowed border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-400">Nincs publikálva</span>
            )}
            <span aria-live="polite" className={`text-sm font-medium ${selectedDirty ? "text-amber-700" : saveFeedback ? "text-emerald-700" : "text-slate-500"}`}>{statusText}</span>
            <button type="button" onClick={handleSave} disabled={!selectedDirty || saving} className="bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950">{saving ? "Mentés..." : "Mentés"}</button>
          </div>
        </div>
      </div>

      <div className="grid items-start gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="min-w-0 overflow-x-auto rounded-sm border border-slate-200 bg-slate-200/70 p-3 sm:p-6">
          <div className={`mx-auto overflow-hidden bg-white shadow-[0_18px_55px_rgba(15,23,42,0.12)] transition-[max-width] duration-300 ${previewMode === "mobile" ? "max-w-[390px]" : "max-w-[1440px]"}`}>
            {!startsWithHero && (
              <header className="border-b border-stone-200 bg-gradient-to-br from-stone-50 via-white to-amber-50/30 py-9 sm:py-12">
                <div className="mx-auto max-w-5xl px-5 sm:px-8">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-800">Erkel Ferenc Alapfokú Művészeti Iskola</p>
                  <h1 className="max-w-4xl text-3xl font-semibold tracking-[-0.025em] text-slate-950 sm:text-5xl">{page.title}</h1>
                </div>
              </header>
            )}
            {page.sections.length === 0 && <div className="p-12 text-center text-sm leading-6 text-slate-500">Az oldal még nem tartalmaz blokkot. Új blokkot a strukturált szerkesztőben adhatsz hozzá.</div>}
            {page.sections.map((section, index) => (
              <VisualSectionWrapper
                key={section.id}
                section={section}
                pageTitle={index === 0 ? page.title : undefined}
                selected={selectedId === section.id}
                first={index === 0}
                last={index === page.sections.length - 1}
                onSelect={() => handleSelect(section.id)}
                onMove={(direction) => handleMove(index, direction)}
                onDelete={() => handleDelete(section)}
                onContentChange={(content) => updateSectionContent(section.id, content)}
                previewMode={previewMode}
              />
            ))}
          </div>
        </div>

        <VisualEditorPanel
          key={selectedSection?.id || "empty"}
          section={selectedSection}
          onContentChange={(content) => updateSelected({ content })}
          onVisibleChange={(visible) => updateSelected({ visible })}
          onSave={handleSave}
          saving={saving}
          dirty={selectedDirty}
          statusText={statusText}
          error={error}
        />
      </div>
    </main>
  );
}
