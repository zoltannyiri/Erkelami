import { useState } from "react";
import axios from "axios";
import FileUploadField from "./FileUploadField";

const isPdfUrl = (url) =>
  Boolean(url && (/\.pdf($|\?)/i.test(url) || url.includes("/documents/")));

const isPosterUrl = (url, imageUrl) =>
  Boolean(
    (url && imageUrl && url === imageUrl) ||
      url === "#poster" ||
      (url && /\.(jpg|jpeg|png|webp)($|\?)/i.test(url))
  );

export default function HomeItemForm({ sectionId, item = null, onClose, onSaved }) {
  const isEditing = Boolean(item);

  const [form, setForm] = useState({
    title: item?.title || "",
    imageUrl: item?.imageUrl || "",
    linkUrl: item?.linkUrl || "",
    visible: item?.visible ?? true,
  });

  const [targetType, setTargetType] = useState(() => {
    if (isPosterUrl(item?.linkUrl, item?.imageUrl)) return "poster";
    if (isPdfUrl(item?.linkUrl)) return "pdf";
    return "url";
  });

  const [saving, setSaving] = useState(false);
  const [generatingCover, setGeneratingCover] = useState(false);
  const [coverNotice, setCoverNotice] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectTargetType = (type) => {
    setTargetType(type);
    if (type === "poster") {
      setForm((current) => ({
        ...current,
        linkUrl: current.imageUrl || "#poster",
      }));
    } else if (targetType === "poster" && form.linkUrl === (form.imageUrl || "#poster")) {
      setForm((current) => ({
        ...current,
        linkUrl: "",
      }));
    }
  };

  const generateAndSetCoverFromPdf = async (pdfSource) => {
    if (!pdfSource) return;

    setGeneratingCover(true);
    setCoverNotice(null);

    try {
      const { generatePdfThumbnailBlob } = await import("../../utils/pdfThumbnail");
      const imageBlob = await generatePdfThumbnailBlob(pdfSource);

      const formData = new FormData();
      formData.append("file", imageBlob, "pdf-cover.jpg");
      formData.append("category", "image");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/uploads`,
        formData
      );

      if (response.data?.url) {
        setForm((current) => ({
          ...current,
          imageUrl: response.data.url,
          ...(targetType === "poster" ? { linkUrl: response.data.url } : {}),
        }));
        setCoverNotice("A borítókép sikeresen elkészült a PDF 1. oldalából.");
      }
    } catch (err) {
      console.error("PDF borítókép generálási hiba:", err);
      setCoverNotice("Nem sikerült a borítóképet kinyerni a PDF-ből. Tölts fel egy képet kézzel.");
    } finally {
      setGeneratingCover(false);
    }
  };

  const handlePdfUploaded = async (uploadedFile, rawFile) => {
    setForm((current) => ({
      ...current,
      linkUrl: uploadedFile.url,
    }));

    if (!form.imageUrl) {
      await generateAndSetCoverFromPdf(rawFile || uploadedFile.url);
    }
  };

  const handleImageUploaded = (uploadedFile) => {
    setForm((current) => ({
      ...current,
      imageUrl: uploadedFile.url,
      ...(targetType === "poster" ? { linkUrl: uploadedFile.url } : {}),
    }));
    setCoverNotice(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError(null);

    try {
      const payload = {
        ...form,
        linkUrl:
          targetType === "poster"
            ? form.imageUrl || "#poster"
            : form.linkUrl,
      };

      if (isEditing) {
        await axios.patch(`${import.meta.env.VITE_API_URL}/api/admin/home/items/${item.id}`, payload);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/home/sections/${sectionId}/items`, payload);
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
      className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-inner"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-950">
          {isEditing ? "Csempe szerkesztése" : "Új csempe"}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          A főoldalon megjelenő csempe adatai, képe és hivatkozása.
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
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
            placeholder="pl. Tavaszi Hangverseny 2026"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700">
              Kép / Plakát
            </label>

            {isPdfUrl(form.linkUrl) && (
              <button
                type="button"
                disabled={generatingCover}
                onClick={() => generateAndSetCoverFromPdf(form.linkUrl)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-950 disabled:opacity-50"
              >
                {generatingCover
                  ? "Generálás..."
                  : form.imageUrl
                  ? "Kép újragenerálása PDF-ből"
                  : "Kép kinyerése a PDF 1. oldalából"}
              </button>
            )}
          </div>

          <FileUploadField
            category="image"
            accept=".jpg,.jpeg,.png,.webp"
            label="Kép vagy plakát feltöltése"
            onUploaded={handleImageUploaded}
          />

          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={(e) => {
              handleChange(e);
              if (targetType === "poster") {
                setForm((current) => ({
                  ...current,
                  imageUrl: e.target.value,
                  linkUrl: e.target.value || "#poster",
                }));
              }
            }}
            className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
            placeholder="/uploads/images/... vagy https://..."
          />

          <p className="mt-2 text-xs text-slate-500">
            Feltölthetsz fotót, álló plakátot, vagy PDF esetén automatikusan létrejön az 1. oldalból.
          </p>

          {generatingCover && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-900 animate-pulse">
              <span>A PDF első oldalának feldolgozása borítóképnek...</span>
            </div>
          )}

          {coverNotice && (
            <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-900">
              {coverNotice}
            </div>
          )}
        </div>

        {form.imageUrl && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">
                Kép előnézete
              </p>
              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    imageUrl: "",
                    ...(targetType === "poster" ? { linkUrl: "" } : {}),
                  }))
                }
                className="text-xs font-semibold text-red-600 hover:text-red-800"
              >
                Kép eltávolítása
              </button>
            </div>

            <div className="h-44 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 p-1 shadow-sm">
              <img
                src={form.imageUrl}
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <label className="mb-1 block text-sm font-medium text-slate-800">
            Hivatkozás / Cél
          </label>
          <p className="mb-3 text-xs text-slate-500">
            Válaszd ki, hogy mi történjen, ha a látogató a csempére kattint a főoldalon.
          </p>

          <div className="mb-4 inline-flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => handleSelectTargetType("url")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                targetType === "url"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Oldal vagy külső link
            </button>
            <button
              type="button"
              onClick={() => handleSelectTargetType("pdf")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                targetType === "pdf"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              PDF dokumentum
            </button>
            <button
              type="button"
              onClick={() => handleSelectTargetType("poster")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                targetType === "poster"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Plakát nagyítása
            </button>
          </div>

          {targetType === "poster" ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-950">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded bg-amber-200/80 px-2 py-0.5 font-bold tracking-wider text-amber-900">
                  PLAKÁT
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">
                    Kattintásra felugró Lightbox nézet
                  </p>
                  <p className="leading-relaxed text-amber-900/90">
                    A feltöltött borítókép a főoldalon levágás nélkül jelenik meg. Amikor a látogató rákattint, a plakát egy elegáns, nagy felbontású felugró ablakban nyílik meg.
                  </p>
                  {!form.imageUrl && (
                    <p className="mt-2 font-medium text-amber-800">
                      Figyelem: tölts fel egy plakátképet a fenti Kép / Plakát mezőben!
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : targetType === "pdf" ? (
            <div className="space-y-3">
              <FileUploadField
                category="document"
                accept=".pdf"
                label="PDF dokumentum feltöltése a csempéhez"
                onUploaded={handlePdfUploaded}
              />

              {form.linkUrl && isPdfUrl(form.linkUrl) && (
                <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-900">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="font-bold shrink-0">Csatolt PDF:</span>
                    <span className="truncate">{form.linkUrl}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 ml-2">
                    <a
                      href={form.linkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold underline hover:text-emerald-950"
                    >
                      Megnyitás
                    </a>
                    <button
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, linkUrl: "" }))}
                      className="font-medium text-red-600 hover:text-red-800"
                    >
                      Törlés
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Vagy közvetlen PDF link:
                </label>
                <input
                  name="linkUrl"
                  value={form.linkUrl}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                  placeholder="/uploads/documents/... vagy https://...pdf"
                />
              </div>
            </div>
          ) : (
            <div>
              <input
                name="linkUrl"
                value={form.linkUrl}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                placeholder="/szolfezs vagy https://..."
              />
              <p className="mt-2 text-xs text-slate-500">
                Például: <code className="bg-slate-100 px-1 py-0.5 rounded">/zeneiskola</code> (belső oldal) vagy <code className="bg-slate-100 px-1 py-0.5 rounded">https://example.com</code> (külső oldal). Üresen hagyva a csempe nem lesz kattintható.
              </p>
            </div>
          )}
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
            className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Mégse
          </button>

          <button
            type="submit"
            disabled={saving || generatingCover}
            className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800 disabled:opacity-50"
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
