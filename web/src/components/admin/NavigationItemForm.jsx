import { useState } from "react";
import axios from "axios";

import { PAGE_TEMPLATE_OPTIONS } from "../../config/pageTemplates";

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
    value: "new",
    label: "Új oldal",
    description: "Az oldal és a menüpont egyszerre jön létre.",
  },
  {
    value: "external",
    label: "Külső hivatkozás",
    description: "Másik weboldalra vagy külső dokumentumra mutat.",
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
    effectiveMenuKey === "SUCCESSES" ? "SUCCESS_RESULT" : "SIMPLE_INFO";

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

    const payload = {
      label: form.label,
      menuKey: form.menuKey,
      parentId: form.parentId,
      pageId: targetType === "existing" ? form.pageId : null,
      externalUrl: targetType === "external" ? form.externalUrl || null : null,
      visible: form.visible,
      ...(!isEditing && targetType === "new" && {
        newPage: {
          title: newPage.title,
          slug: newPage.slug,
          templateKey: newPage.templateKey,
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
        pageCreated: !isEditing && targetType === "new",
        openEditor:
          !isEditing &&
          targetType === "new" &&
          submitIntent === "create-and-edit",
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

  const availableTargetOptions = isEditing
    ? targetOptions.filter((option) => option.value !== "new")
    : targetOptions;

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
            className="w-full border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-950"
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
              className="w-full border border-slate-300 bg-white px-4 py-3"
            >
              <option value="TOP_LEVEL">Fő navigáció</option>
              <option value="SUCCESSES">Sikereink</option>
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
            {availableTargetOptions.map((option) => {
              const selected = targetType === option.value;

              return (
                <label
                  key={option.value}
                  className={`cursor-pointer border p-4 transition ${
                    selected
                      ? "border-slate-950 bg-white ring-1 ring-slate-950"
                      : "border-slate-200 bg-white/60 hover:border-slate-400"
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
              className="w-full border border-slate-300 bg-white px-4 py-3"
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

        {!isEditing && targetType === "new" && (
          <div className="space-y-5 border-l-2 border-amber-700 bg-white p-5">
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
                className="w-full border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-950"
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
                className="w-full border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-950"
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
                className="w-full border border-slate-300 bg-white px-4 py-3"
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
              className="w-full border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-950"
            />
          </div>
        )}

        <div className="border border-slate-200 bg-white p-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="visible"
              checked={form.visible}
              onChange={handleChange}
            />
            <span className="text-sm font-medium">Menüpont látható</span>
          </label>
          {!isEditing && targetType === "new" && (
            <p className="mt-2 pl-7 text-xs leading-5 text-slate-500">
              {form.visible
                ? "Az új oldal is publikált állapotban jön létre."
                : "Az új oldal piszkozatként, a menüpont pedig rejtetten jön létre."}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 p-4 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-5">
          <button type="button" onClick={onClose} className="px-5 py-3 text-sm">
            Mégse
          </button>

          {!isEditing && targetType === "new" ? (
            <>
              <button
                type="submit"
                value="save"
                disabled={saving}
                className="border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 disabled:opacity-50"
              >
                {saving ? "Mentés..." : "Csak létrehozás"}
              </button>
              <button
                type="submit"
                value="create-and-edit"
                disabled={saving}
                className="bg-slate-950 px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
              >
                {saving ? "Létrehozás..." : "Létrehozás és szerkesztés"}
              </button>
            </>
          ) : (
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
          )}
        </div>
      </div>
    </form>
  );
}
