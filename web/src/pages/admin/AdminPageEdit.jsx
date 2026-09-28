import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import SectionEditForm from "../../components/admin/SectionEditForm.jsx";

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

  const [newBlock, setNewBlock] = useState({
    type: "TEXT",
    heading: "",
    text: "",
    imageUrl: "",
    alt: "",
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/pages/${id}`)
      .then((response) => {
        setPage(response.data);

        setForm({
          title: response.data.title || "",
          slug: response.data.slug || "",
          published: response.data.published || false,
          metaTitle: response.data.metaTitle || "",
          metaDescription: response.data.metaDescription || "",
        });
      })
      .catch((error) => {
        console.error(error);
        setError("Az oldal nem tölthető be.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const refreshPage = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/pages/${id}`
    );

    setPage(response.data);

    setForm({
      title: response.data.title || "",
      slug: response.data.slug || "",
      published: response.data.published || false,
      metaTitle: response.data.metaTitle || "",
      metaDescription: response.data.metaDescription || "",
    });
  };

  const handleMoveSection = async (index, direction) => {
    const sections = [...page.sections];

    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= sections.length
    ) {
      return;
    }

    [sections[index], sections[targetIndex]] = [
      sections[targetIndex],
      sections[index],
    ];

    setPage((current) => ({
      ...current,
      sections,
    }));

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/pages/${id}/sections/reorder`,
        {
          sectionIds: sections.map((section) => section.id),
        }
      );
    } catch (error) {
      console.error("Sorrend módosítási hiba:", error);

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
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Hiba történt az oldal mentésekor."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleBlockChange = (event) => {
    const { name, value } = event.target;

    setNewBlock((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCreateBlock = async (event) => {
    event.preventDefault();

    let content;

    if (newBlock.type === "TEXT") {
      content = {
        heading: newBlock.heading,
        text: newBlock.text,
      };
    }

    if (newBlock.type === "IMAGE") {
      content = {
        imageUrl: newBlock.imageUrl,
        alt: newBlock.alt,
      };
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/pages/${id}/sections`,
        {
          type: newBlock.type,
          content,
          visible: true,
        }
      );

      setNewBlock({
        type: "TEXT",
        heading: "",
        text: "",
        imageUrl: "",
        alt: "",
      });

      setShowNewBlock(false);

      await refreshPage();
    } catch (error) {
      console.error("Blokk létrehozási hiba:", error);
    }
  };

  const handleDeleteSection = async (section) => {
    const confirmed = window.confirm(
      "Biztosan törölni szeretnéd ezt a blokkot?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/sections/${section.id}`
      );

      await refreshPage();
    } catch (error) {
      console.error("Blokk törlési hiba:", error);
    }
  };

  if (loading) {
    return <div className="p-8">Betöltés...</div>;
  }

  if (error && !page) {
    return <div className="p-8">{error}</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-5xl px-8">

        <div className="mb-8">
          <Link
            to="/admin/pages"
            className="text-sm text-slate-500 hover:text-slate-950"
          >
            ← Vissza az oldalakhoz
          </Link>

          <h1 className="mt-4 text-3xl font-semibold text-slate-950">
            {page.title}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Oldal szerkesztése
          </p>
        </div>

        {/* OLDAL BEÁLLÍTÁSAI */}

        <form
          onSubmit={handleSavePage}
          className="mb-8 border border-slate-200 bg-white p-8"
        >
          <h2 className="mb-6 text-xl font-semibold text-slate-950">
            Oldal beállításai
          </h2>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Cím
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handlePageChange}
                className="w-full border border-slate-300 px-4 py-3 outline-none focus:border-slate-950"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Slug
              </label>

              <input
                name="slug"
                value={form.slug}
                onChange={handlePageChange}
                className="w-full border border-slate-300 px-4 py-3 outline-none focus:border-slate-950"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Meta title
              </label>

              <input
                name="metaTitle"
                value={form.metaTitle}
                onChange={handlePageChange}
                className="w-full border border-slate-300 px-4 py-3 outline-none focus:border-slate-950"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Meta description
              </label>

              <textarea
                name="metaDescription"
                value={form.metaDescription}
                onChange={handlePageChange}
                rows={3}
                className="w-full resize-none border border-slate-300 px-4 py-3 outline-none focus:border-slate-950"
              />
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="published"
                checked={form.published}
                onChange={handlePageChange}
                className="cursor-pointer"
              />

              <span className="text-sm font-medium text-slate-700">
                Publikált
              </span>
            </label>

            {error && (
              <div className="bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-slate-950 cursor-pointer px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
              >
                {saving ? "Mentés..." : "Változtatások mentése"}
              </button>
            </div>
          </div>
        </form>

        {/* TARTALMI BLOKKOK */}

        <div className="border border-slate-200 bg-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Tartalmi blokkok
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Ezekből épül fel az oldal tartalma.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowNewBlock((current) => !current)}
              className="bg-slate-950 cursor-pointer px-5 py-3 text-sm font-medium text-white"
            >
              + Új blokk
            </button>
          </div>

          {/* ÚJ BLOKK FORM */}

          {showNewBlock && (
            <form
              onSubmit={handleCreateBlock}
              className="mt-8 border border-slate-200 bg-slate-50 p-6"
            >
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium">
                  Blokk típusa
                </label>

                <select
                  name="type"
                  value={newBlock.type}
                  onChange={handleBlockChange}
                  className="w-full border border-slate-300 bg-white px-4 py-3"
                >
                  <option value="TEXT">Szöveg</option>
                  <option value="IMAGE">Kép</option>
                </select>
              </div>

              {newBlock.type === "TEXT" && (
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Cím
                    </label>

                    <input
                      name="heading"
                      value={newBlock.heading}
                      onChange={handleBlockChange}
                      className="w-full border border-slate-300 bg-white px-4 py-3"
                      placeholder="pl. Bemutatkozás"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Szöveg
                    </label>

                    <textarea
                      name="text"
                      value={newBlock.text}
                      onChange={handleBlockChange}
                      rows={6}
                      className="w-full resize-none border border-slate-300 bg-white px-4 py-3"
                    />
                  </div>
                </div>
              )}

              {newBlock.type === "IMAGE" && (
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Kép URL
                    </label>

                    <input
                      name="imageUrl"
                      value={newBlock.imageUrl}
                      onChange={handleBlockChange}
                      className="w-full border border-slate-300 bg-white px-4 py-3"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Alt szöveg
                    </label>

                    <input
                      name="alt"
                      value={newBlock.alt}
                      onChange={handleBlockChange}
                      className="w-full border border-slate-300 bg-white px-4 py-3"
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewBlock(false)}
                  className="cursor-pointer px-5 py-3 text-sm text-slate-600"
                >
                  Mégse
                </button>

                <button
                  type="submit"
                  className="cursor-pointer bg-slate-950 px-5 py-3 text-sm font-medium text-white"
                >
                  Blokk hozzáadása
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 space-y-3">
            {page.sections?.length === 0 && (
              <div className="border border-dashed border-slate-300 p-10 text-center text-slate-500">
                Ehhez az oldalhoz még nincs tartalmi blokk.
              </div>
            )}

            {page.sections?.map((section, index) => (
              <div
                key={section.id}
                className="flex items-center justify-between border border-slate-200 p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center bg-slate-100 text-sm font-medium text-slate-500">
                    {index + 1}
                  </div>

                  <div>
                    <p className="font-medium text-slate-950">
                      {section.type === "TEXT"
                        ? section.content?.heading || "Szöveges blokk"
                        : section.content?.alt || "Képes blokk"}
                    </p>

                    <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                      {section.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleMoveSection(index, "up")}
                    disabled={index === 0}
                    className="
                      border border-slate-300
                      px-3 py-2 text-sm
                      disabled:cursor-not-allowed
                      disabled:opacity-30
                    "
                    title="Mozgatás felfelé"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveSection(index, "down")}
                    disabled={index === page.sections.length - 1}
                    className="
                      border border-slate-300
                      px-3 py-2 text-sm
                      disabled:cursor-not-allowed
                      disabled:opacity-30
                    "
                    title="Mozgatás lefelé"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingSection(section)}
                    className="border border-slate-300 px-4 py-2 text-sm"
                  >
                    Szerkesztés
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteSection(section)}
                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Törlés
                  </button>
                </div>
              </div>
            ))}
          </div>

          {editingSection && (
            <SectionEditForm
              section={editingSection}
              onClose={() => setEditingSection(null)}
              onSaved={async () => {
                setEditingSection(null);
                await refreshPage();
              }}
            />
          )}
        </div>

      </div>
    </main>
  );
}