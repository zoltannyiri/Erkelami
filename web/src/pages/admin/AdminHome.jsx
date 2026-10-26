import { useEffect, useState } from "react";
import axios from "axios";

import HomeItemForm from "../../components/admin/HomeItemForm";
import AdminPageHeader from "../../components/admin/AdminPageHeader";

const sectionLabels = {
  HIGHLIGHTS: "Főoldali csempék",
  FEATURED: "Kiemelt tartalmak",
};

const isPdfUrl = (url) =>
  Boolean(url && (/\.pdf($|\?)/i.test(url) || url.includes("/documents/")));

export default function AdminHome() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingItem, setEditingItem] = useState(null);
  const [creatingForSection, setCreatingForSection] = useState(null);

  const refreshHome = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/home`
    );

    setSections(response.data);
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/home`)
      .then((response) => {
        setSections(response.data);
      })
      .catch((error) => {
        console.error("Home admin betöltési hiba:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Biztosan törölni szeretnéd?\n\n${item.title}`
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/home/items/${item.id}`
      );

      await refreshHome();
    } catch (error) {
      console.error("Csempe törlési hiba:", error);
    }
  };

  const handleMove = async (section, index, direction) => {
    const items = [...section.items];

    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= items.length
    ) {
      return;
    }

    [items[index], items[targetIndex]] = [
      items[targetIndex],
      items[index],
    ];

    setSections((current) =>
      current.map((currentSection) =>
        currentSection.id === section.id
          ? {
              ...currentSection,
              items,
            }
          : currentSection
      )
    );

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/home/sections/${section.id}/items/reorder`,
        {
          itemIds: items.map((item) => item.id),
        }
      );
    } catch (error) {
      console.error("Sorrend módosítási hiba:", error);

      await refreshHome();
    }
  };

  if (loading) {
    return <div className="mx-auto h-72 max-w-7xl animate-pulse rounded-3xl bg-white shadow-sm" />;
  }

  return (
    <main className="mx-auto max-w-7xl">
      <AdminPageHeader
        title="Főoldal"
        description="A főoldalon megjelenő csempék, linkek, láthatóság és sorrend kezelése."
      />

      <div className="space-y-8">
        {sections.map((section) => (
          <section
            key={section.id}
            className="overflow-hidden rounded-3xl border border-white bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  {sectionLabels[section.key] || "Főoldali tartalmak"}
                </h2>

                <p className="mt-1.5 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {section.key}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setCreatingForSection(section);
                }}
                className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                + Új csempe
              </button>
            </div>

            {section.items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-10 text-center text-sm text-slate-500">
                Ebben a szekcióban még nincs csempe.
              </div>
            ) : (
              <div className="space-y-3">
                {section.items.map((item, index) => {
                  const isPdf = isPdfUrl(item.linkUrl);

                  return (
                    <div
                      key={item.id}
                      className="group flex flex-col gap-4 rounded-2xl border border-slate-200/80 p-4 transition hover:border-slate-300 hover:bg-slate-50/70 hover:shadow-sm sm:flex-row sm:items-center sm:gap-5"
                    >
                      <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-20 sm:w-28">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-slate-400">
                            Nincs kép
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <h3 className="font-medium text-slate-950">
                            {item.title}
                          </h3>

                          {isPdf && (
                            <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-rose-700">
                              PDF
                            </span>
                          )}

                          {!item.visible && (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                              Rejtett
                            </span>
                          )}
                        </div>

                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                          {isPdf && <span aria-hidden="true">📄</span>}
                          <p className="truncate">
                            {item.linkUrl || "Nincs link"}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() =>
                            handleMove(section, index, "up")
                          }
                          className="h-9 w-9 rounded-xl border border-slate-200 bg-white text-sm shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          ↑
                        </button>

                        <button
                          type="button"
                          disabled={
                            index === section.items.length - 1
                          }
                          onClick={() =>
                            handleMove(section, index, "down")
                          }
                          className="h-9 w-9 rounded-xl border border-slate-200 bg-white text-sm shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          ↓
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setCreatingForSection(null);
                            setEditingItem(item);
                          }}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300"
                        >
                          Szerkesztés
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="rounded-xl px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Törlés
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {creatingForSection?.id === section.id && (
              <HomeItemForm
                key={`create-${section.id}`}
                sectionId={section.id}
                onClose={() =>
                  setCreatingForSection(null)
                }
                onSaved={async () => {
                  setCreatingForSection(null);
                  await refreshHome();
                }}
              />
            )}

            {editingItem?.sectionId === section.id && (
              <HomeItemForm
                key={editingItem.id}
                sectionId={section.id}
                item={editingItem}
                onClose={() =>
                  setEditingItem(null)
                }
                onSaved={async () => {
                  setEditingItem(null);
                  await refreshHome();
                }}
              />
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
