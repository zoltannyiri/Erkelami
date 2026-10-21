import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import NewSectionForm from "../../components/admin/NewSectionForm";
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
  const [showNewBlock, setShowNewBlock] = useState(false);
  const [dragState, setDragState] = useState({ sourceIndex: null, targetIndex: null });

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

  const refreshSections = async (preferredSelectedId = selectedId) => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/pages/${id}`);
    setPage(response.data);
    setSavedSections(savedStateMap(response.data.sections));
    const nextSelectedId = response.data.sections.some((section) => section.id === preferredSelectedId)
      ? preferredSelectedId
      : response.data.sections?.[0]?.id || null;
    setSelectedId(nextSelectedId);
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

  const persistOrder = async (sections) => {
    await axios.patch(`${import.meta.env.VITE_API_URL}/api/admin/pages/${id}/sections/reorder`, {
      sectionIds: sections.map((section) => section.id),
    });
  };

  const moveSection = async (sourceIndex, targetIndex) => {
    if (sourceIndex === targetIndex || sourceIndex < 0 || targetIndex < 0) return;
    const sections = [...page.sections];
    if (sourceIndex >= sections.length || targetIndex >= sections.length) return;
    const [movedSection] = sections.splice(sourceIndex, 1);
    sections.splice(targetIndex, 0, movedSection);
    setPage((current) => ({ ...current, sections }));
    try {
      await persistOrder(sections);
    } catch (requestError) {
      console.error(requestError);
      setError("A blokkok sorrendje nem menthető.");
      await refreshSections();
    }
  };

  const handleMove = (index, direction) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= page.sections.length) return;
    moveSection(index, targetIndex);
  };

  const handleDrop = (targetIndex) => {
    const sourceIndex = dragState.sourceIndex;
    setDragState({ sourceIndex: null, targetIndex: null });
    if (sourceIndex === null) return;
    moveSection(sourceIndex, targetIndex);
  };

  const handleOpenNewBlock = () => {
    if (selectedDirty) {
      setError("Új blokk hozzáadása előtt mentsd el a kijelölt blokk módosításait.");
      return;
    }
    setShowNewBlock(true);
    setError(null);
  };

  const handleCreateBlock = async (payload) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/admin/pages/${id}/sections`,
      payload
    );
    await refreshSections(response.data.id);
    setShowNewBlock(false);
    setSaveFeedback(false);
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
    <main className="-m-4 min-h-[calc(100vh-5rem)] bg-slate-100 sm:-m-6 lg:-m-8">
      <div className="sticky top-20 z-30 border-b border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <button type="button" onClick={handleBack} className="shrink-0 text-sm font-medium text-slate-600 transition hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950">← Vissza</button>
            <div className="min-w-0 border-l border-slate-200 pl-4">
              <p className="truncate font-semibold text-slate-950">{page.title}</p>
              <p className="truncate text-xs text-slate-500">/{page.slug}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <button type="button" onClick={handleOpenNewBlock} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950">+ Új blokk</button>
            <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1" aria-label="Előnézet szélessége">
              {[["desktop", "Asztali"], ["mobile", "Mobil"]].map(([value, label]) => (
                <button key={value} type="button" aria-pressed={previewMode === value} onClick={() => setPreviewMode(value)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${previewMode === value ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>{label}</button>
              ))}
            </div>
            {page.published ? (
              <Link to={`/${page.slug}`} target="_blank" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950">Publikus előnézet ↗</Link>
            ) : (
              <span title="Az oldal még nincs publikálva" className="cursor-not-allowed border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-400">Nincs publikálva</span>
            )}
            <span aria-live="polite" className={`text-sm font-medium ${selectedDirty ? "text-amber-700" : saveFeedback ? "text-emerald-700" : "text-slate-500"}`}>{statusText}</span>
            <button type="button" onClick={handleSave} disabled={!selectedDirty || saving} className="rounded-xl bg-slate-950 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950">{saving ? "Mentés..." : "Mentés"}</button>
          </div>
        </div>
      </div>

      <div className="grid items-start gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="min-w-0 overflow-x-auto rounded-sm border border-slate-200 bg-slate-200/70 p-3 sm:p-6">
          <div className={`mx-auto overflow-hidden bg-[#f8f1e8] shadow-[0_18px_55px_rgba(15,23,42,0.12)] transition-[max-width] duration-300 ${previewMode === "mobile" ? "w-full max-w-[390px]" : "w-full min-w-[1024px] max-w-[1440px]"}`}>
            {/*

              {!startsWithHero && (
                <header className="border-b border-stone-200 bg-gradient-to-br from-[#f8f1e8] via-[#fffaf3] to-amber-50/40 py-9 sm:py-12">
                  <div className="mx-auto max-w-5xl px-5 sm:px-8">
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-800">Tatabányai Erkel Ferenc Alapfokú Művészeti Iskola</p>
                    <h1 className="max-w-4xl text-3xl font-semibold tracking-[-0.025em] text-slate-950 sm:text-5xl">{page.title}</h1>
                  </div>
                </header>
              )}
            */}
            {!startsWithHero && <h1 className="sr-only">{page.title}</h1>}
            {page.sections.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-sm leading-6 text-slate-500">Az oldal még nem tartalmaz blokkot.</p>
                <button type="button" onClick={handleOpenNewBlock} className="mt-5 bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">+ Első blokk hozzáadása</button>
              </div>
            )}
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
                dragging={dragState.sourceIndex === index}
                dragOver={dragState.sourceIndex !== null && dragState.sourceIndex !== index && dragState.targetIndex === index}
                onDragStart={() => setDragState({ sourceIndex: index, targetIndex: index })}
                onDragOver={() => setDragState((current) => current.sourceIndex === null || current.targetIndex === index ? current : { ...current, targetIndex: index })}
                onDrop={() => handleDrop(index)}
                onDragEnd={() => setDragState({ sourceIndex: null, targetIndex: null })}
              />
            ))}
            {page.sections.length > 0 && (
              <div className="border-t border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                <button type="button" onClick={handleOpenNewBlock} className="border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100">+ Új blokk hozzáadása</button>
              </div>
            )}
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

      {showNewBlock && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="new-block-title">
          <div className="max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 id="new-block-title" className="text-2xl font-semibold text-slate-950">Új blokk hozzáadása</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Válassz blokkot, majd a vásznon húzd a kívánt helyre.</p>
              </div>
              <button type="button" onClick={() => setShowNewBlock(false)} aria-label="Ablak bezárása" className="border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Bezárás</button>
            </div>
            <NewSectionForm onCancel={() => setShowNewBlock(false)} onCreate={handleCreateBlock} />
          </div>
        </div>
      )}
    </main>
  );
}
