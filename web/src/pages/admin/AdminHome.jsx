import { useEffect, useState } from "react";
import axios from "axios";

import HomeItemForm from "../../components/admin/HomeItemForm";
import AdminPageHeader from "../../components/admin/AdminPageHeader";

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
    return <div className="p-8">Betöltés...</div>;
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
            className="border border-slate-200 bg-white p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  {section.title || section.key}
                </h2>

                <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                  {section.key}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setCreatingForSection(section);
                }}
                className="bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                + Új csempe
              </button>
            </div>

            {section.items.length === 0 ? (
              <div className="border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
                Ebben a szekcióban még nincs csempe.
              </div>
            ) : (
              <div className="space-y-3">
                {section.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-5 border border-slate-200 p-4"
                  >
                    <div className="h-20 w-28 shrink-0 overflow-hidden bg-slate-100">
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
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-slate-950">
                          {item.title}
                        </h3>

                        {!item.visible && (
                          <span className="bg-slate-100 px-2 py-1 text-xs text-slate-500">
                            Rejtett
                          </span>
                        )}
                      </div>

                      <p className="mt-1 truncate text-sm text-slate-500">
                        {item.linkUrl || "Nincs link"}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() =>
                          handleMove(section, index, "up")
                        }
                        className="border border-slate-300 bg-white px-3 py-2 text-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
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
                        className="border border-slate-300 bg-white px-3 py-2 text-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        ↓
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setCreatingForSection(null);
                          setEditingItem(item);
                        }}
                        className="border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Szerkesztés
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Törlés
                      </button>
                    </div>
                  </div>
                ))}
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