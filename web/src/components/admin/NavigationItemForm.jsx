import { useState } from "react";
import axios from "axios";

import { NAVIGATION_MENU_GROUPS } from "../../config/navigationMenus";
import { PAGE_TEMPLATE_OPTIONS } from "../../config/pageTemplates";
import FileUploadField from "./FileUploadField";

const getInitialTargetType = (item) => {
  if (item?.pageId) return "existing";
  if (item?.externalUrl) return "external";
  return "none";
};

const targetOptions = [
  {
    value: "none",
    label: "Nincs cél",
    description: "Csak csoportként vagy almenük gyűjtőjeként jelenik meg.",
  },
  {
    value: "existing",
    label: "Meglévő oldal",
    description: "Egy már elkészített dinamikus oldalhoz kapcsolódik.",
  },
  {
    value: "external",
    label: "Külső hivatkozás",
    description: "Másik weboldalra vagy külső dokumentumra mutat.",
  },
  {
    value: "new",
    label: "Oldal létrehozása",
    description: "Új oldal jön létre és automatikusan ehhez a menüponthoz kapcsolódik.",
  },
];

export default function NavigationItemForm({
  item = null,
  parent = null,
  menuKey = "TOP_LEVEL",
  pages = [],
  navigationItems = [],
  onClose,
  onSaved,
}) {
  const isEditing = Boolean(item);
  const effectiveMenuKey = item?.menuKey || parent?.menuKey || menuKey;
  const defaultTemplateKey =
    effectiveMenuKey === "SUCCESSES" ? "PDF_DOCUMENT" : "SIMPLE_INFO";

  const [form, setForm] = useState(() => ({
    label: item?.label || "",
    menuKey: item?.menuKey || menuKey,
    parentId: item?.parentId || parent?.id || null,
    pageId: item?.pageId || null,
    externalUrl: item?.externalUrl || "",
    visible: item?.visible ?? true,
  }));
  const [targetType, setTargetType] = useState(() =>
    getInitialTargetType(item)
  );
  const [newPage, setNewPage] = useState({
    title: item?.label || "",
    slug: "",
    templateKey: defaultTemplateKey,
    pdfUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue =
      type === "checkbox" ? checked : value === "" ? null : value;

    if (name === "label") {
      const previousLabel = form.label || "";

      setNewPage((current) => ({
        ...current,
        title:
          targetType === "new" &&
          (!current.title || current.title === previousLabel)
            ? value
            : current.title,
      }));
    }

    if (name === "menuKey") {
      setNewPage((current) => ({
        ...current,
        templateKey:
          value === "SUCCESSES" && current.templateKey === "SIMPLE_INFO"
            ? "SUCCESS_RESULT"
            : value !== "SUCCESSES" &&
                current.templateKey === "SUCCESS_RESULT"
              ? "SIMPLE_INFO"
              : current.templateKey,
      }));
    }

    setForm((current) => ({
      ...current,
      [name]: nextValue,
    }));
  };

  const handleTargetTypeChange = (nextTargetType) => {
    setTargetType(nextTargetType);
    setError(null);

    if (nextTargetType === "new") {
      setNewPage((current) => ({
        ...current,
        title: current.title || form.label || "",
      }));
    }
  };

  const handleNewPageChange = (event) => {
    const { name, value } = event.target;
    setNewPage((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const submitIntent = event.nativeEvent.submitter?.value || "save";
    setSaving(true);
    setError(null);

    const isCreatingPage = targetType === "new";

    const payload = {
      label: form.label,
      menuKey: form.menuKey,
      parentId: form.parentId,
      pageId: targetType === "existing" ? form.pageId : null,
      externalUrl: targetType === "external" ? form.externalUrl || null : null,
      visible: form.visible,
      ...(isCreatingPage && {
        newPage: {
          title: newPage.title,
          slug: newPage.slug,
          templateKey: newPage.templateKey,
          pdfUrl: newPage.pdfUrl || null,
          published: form.visible,
        },
      }),
    };

    try {
      const response = isEditing
        ? await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/admin/navigation/${item.id}`,
            payload
          )
        : await axios.post(
            `${import.meta.env.VITE_API_URL}/api/admin/navigation`,
            payload
          );

      await onSaved(response.data, {
        pageCreated: isCreatingPage,
        openEditor: isCreatingPage && submitIntent === "create-and-edit",
      });
    } catch (requestError) {
      console.error("Navigáció mentési hiba:", requestError);

      setError(
        requestError.response?.data?.message ||
          "Hiba történt a menüpont mentésekor."
      );
    } finally {
      setSaving(false);
    }
  };

  const isPdfTemplate =
    newPage.templateKey === "PDF_DOCUMENT" ||
    newPage.templateKey === "PDF_WITH_TEXT";

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-inner"
    >
      <h3 className="mb-6 text-lg font-semibold">
        {isEditing
          ? "Menüpont szerkesztése"
          : parent
            ? `Új menüpont: ${parent.label} alatt`
            : "Új menüpont"}
      </h3>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="navigation-label">
            Megnevezés
          </label>
          <input
            id="navigation-label"
            name="label"
            value={form.label || ""}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
          />
        </div>

        {!form.parentId && (
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="navigation-menu">
              Menü
            </label>
            <select
              id="navigation-menu"
              name="menuKey"
              value={form.menuKey}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
            >
              {NAVIGATION_MENU_GROUPS.map((menu) => (
                <option key={menu.menuKey} value={menu.menuKey}>
                  {menu.label}
                </option>
              ))}
              {!NAVIGATION_MENU_GROUPS.some(
                (menu) => menu.menuKey === form.menuKey
              ) && (
                <option value={form.menuKey}>{form.menuKey}</option>
              )}
            </select>
          </div>
        )}

        {isEditing && (
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="navigation-parent">
              Szülő menüpont
            </label>
            <select
              id="navigation-parent"
              name="parentId"
              value={form.parentId || ""}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
            >
              <option value="">Nincs szülő</option>
              {navigationItems
                .filter(
                  (navigationItem) =>
                    navigationItem.id !== item?.id &&
                    navigationItem.menuKey === form.menuKey
                )
                .map((navigationItem) => (
                  <option key={navigationItem.id} value={navigationItem.id}>
                    {navigationItem.label}
                  </option>
                ))}
            </select>
          </div>
        )}

        <fieldset>
          <legend className="text-sm font-medium text-slate-800">Menüpont célja</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {targetOptions.map((option) => {
              const selected = targetType === option.value;

              return (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    selected
                      ? "border-amber-400 bg-amber-50/70 ring-2 ring-amber-400/20 shadow-sm"
                      : "border-slate-200 bg-white/60 hover:border-slate-300 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="targetType"
                      value={option.value}
                      checked={selected}
                      onChange={() => handleTargetTypeChange(option.value)}
                    />
                    <span className="font-semibold text-slate-900">{option.label}</span>
                  </span>
                  <span className="mt-2 block text-xs leading-5 text-slate-500">
                    {option.description}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {targetType === "existing" && (
          <div className="border-l-2 border-slate-300 pl-5">
            <label className="mb-2 block text-sm font-medium" htmlFor="navigation-page">
              Dinamikus oldal
            </label>
            <select
              id="navigation-page"
              name="pageId"
              value={form.pageId || ""}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
            >
              <option value="">Válassz oldalt</option>
              {pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.title} (/{page.slug})
                </option>
              ))}
            </select>
          </div>
        )}

        {targetType === "new" && (
          <div className="space-y-5 rounded-2xl border border-amber-200 bg-amber-50/40 p-5 shadow-sm">
            <div>
              <h4 className="font-semibold text-slate-950">Új oldal adatai</h4>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Az oldal és a menüpont egyetlen mentéssel, automatikusan összekapcsolva készül el.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="new-page-title">
                Oldal címe
              </label>
              <input
                id="new-page-title"
                name="title"
                value={newPage.title}
                onChange={handleNewPageChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="new-page-slug">
                Slug
              </label>
              <input
                id="new-page-slug"
                name="slug"
                value={newPage.slug}
                onChange={handleNewPageChange}
                placeholder="Automatikusan generálódik, ha üresen hagyod"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium" htmlFor="new-page-template">
                Oldalsablon
              </label>
              <select
                id="new-page-template"
                name="templateKey"
                value={newPage.templateKey}
                onChange={handleNewPageChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
              >
                {PAGE_TEMPLATE_OPTIONS.map((template) => (
                  <option key={template.key} value={template.key}>
                    {template.name}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                {PAGE_TEMPLATE_OPTIONS.find(
                  (template) => template.key === newPage.templateKey
                )?.description}
              </p>
            </div>

            {isPdfTemplate && (
              <div className="space-y-3 rounded-sm border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">
                    PDF feltöltése az oldalhoz (opcionális)
                  </span>
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                    PDF sablon
                  </span>
                </div>

                <FileUploadField
                  category="document"
                  accept=".pdf"
                  label="PDF fájl feltöltése"
                  onUploaded={(uploaded) => {
                    setNewPage((current) => ({
                      ...current,
                      pdfUrl: uploaded.url,
                    }));
                  }}
                />

                {newPage.pdfUrl && (
                  <div className="flex items-center justify-between rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                    <span className="max-w-xs truncate sm:max-w-md">
                      Feltöltve: {newPage.pdfUrl}
                    </span>
                    <a
                      href={newPage.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-2 font-semibold underline hover:text-emerald-950"
                    >
                      Megnyitás ↗
                    </a>
                  </div>
                )}

                <div>
                  <label
                    className="mb-1 block text-xs font-medium text-slate-600"
                    htmlFor="new-page-pdf-url"
                  >
                    Vagy közvetlen PDF link:
                  </label>
                  <input
                    id="new-page-pdf-url"
                    name="pdfUrl"
                    value={newPage.pdfUrl || ""}
                    onChange={(event) =>
                      setNewPage((current) => ({
                        ...current,
                        pdfUrl: event.target.value,
                      }))
                    }
                    placeholder="/uploads/documents/... vagy https://..."
                    className="w-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-950"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {targetType === "external" && (
          <div className="border-l-2 border-slate-300 pl-5">
            <label className="mb-2 block text-sm font-medium" htmlFor="navigation-external-url">
              Külső hivatkozás
            </label>
            <input
              id="navigation-external-url"
              name="externalUrl"
              value={form.externalUrl || ""}
              onChange={handleChange}
              required
              placeholder="https://..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
            />
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="visible"
              checked={form.visible}
              onChange={handleChange}
            />
            <span className="text-sm font-medium">Menüpont látható</span>
          </label>
          {targetType === "new" && (
            <p className="mt-2 pl-7 text-xs leading-5 text-slate-500">
              {form.visible
                ? "Az új oldal is publikált állapotban jön létre."
                : "Az új oldal piszkozatként, a menüpont pedig rejtetten jön létre."}
            </p>
          )}
        </div>

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5">
          <button type="button" onClick={onClose} className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">
            Mégse
          </button>

          {targetType === "new" ? (
            <>
              <button
                type="submit"
                value="save"
                disabled={saving}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 disabled:opacity-50"
              >
                {saving ? "Mentés..." : "Csak létrehozás"}
              </button>
              <button
                type="submit"
                value="create-and-edit"
                disabled={saving}
                className="cursor-pointer rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800 disabled:opacity-50"
              >
                {saving ? "Létrehozás..." : "Létrehozás és szerkesztés"}
              </button>
            </>
          ) : (
            <button
              type="submit"
              disabled={saving}
              className="cursor-pointer rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800 disabled:opacity-50"
            >
              {saving
                ? "Mentés..."
                : isEditing
                  ? "Változtatások mentése"
                  : "Menüpont létrehozása"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
