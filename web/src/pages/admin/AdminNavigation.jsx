import { useEffect, useState } from "react";
import axios from "axios";
import NavigationItemForm from "../../components/admin/NavigationItemForm";
import AdminPageHeader from "../../components/admin/AdminPageHeader";

const flattenItems = (items) =>
  items.flatMap((item) => [
    item,
    ...flattenItems(item.children || []),
  ]);

function NavigationTree({ items, pages, allItems, onEdit, onAddChild, onDelete, onMove, level = 0 }) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={item.id}>
          <div
            className="flex items-center gap-4 border border-slate-200 bg-white p-4"
            style={{
              marginLeft: `${level * 32}px`,
            }}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <span className="font-medium">
                  {item.label}
                </span>

                {!item.visible && (
                  <span className="bg-slate-100 px-2 py-1 text-xs text-slate-500">
                    Rejtett
                  </span>
                )}
              </div>

              <div className="mt-1 text-sm text-slate-500">
                {item.page
                  ? `/${item.page.slug}`
                  : item.externalUrl || "Csak csoport"}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={index === 0}
                onClick={() =>
                  onMove(items, index, "up")
                }
                className="border border-slate-300 px-3 py-2 disabled:opacity-30"
              >
                ↑
              </button>

              <button
                type="button"
                disabled={index === items.length - 1}
                onClick={() =>
                  onMove(items, index, "down")
                }
                className="border border-slate-300 px-3 py-2 disabled:opacity-30"
              >
                ↓
              </button>

              <button
                type="button"
                onClick={() => onAddChild(item)}
                className="border border-slate-300 px-3 py-2 text-sm"
              >
                + Gyerek
              </button>

              <button
                type="button"
                onClick={() => onEdit(item)}
                className="border border-slate-300 px-3 py-2 text-sm"
              >
                Szerkesztés
              </button>

              <button
                type="button"
                onClick={() => onDelete(item)}
                className="px-3 py-2 text-sm text-red-600"
              >
                Törlés
              </button>
            </div>
          </div>

          {item.children?.length > 0 && (
            <NavigationTree
              items={item.children}
              pages={pages}
              allItems={allItems}
              onEdit={onEdit}
              onAddChild={onAddChild}
              onDelete={onDelete}
              onMove={onMove}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function AdminNavigation() {
  const [groups, setGroups] = useState([]);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingItem, setEditingItem] = useState(null);
  const [creating, setCreating] = useState(null);

  const refreshNavigation = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/navigation`
    );

    setGroups(response.data);
  };

  useEffect(() => {
    Promise.all([
      axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/navigation`
      ),
      axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/pages`
      ),
    ])
      .then(([navigationResponse, pagesResponse]) => {
        setGroups(navigationResponse.data);
        setPages(pagesResponse.data);
      })
      .catch((error) => {
        console.error("Admin navigáció betöltési hiba:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const allItems = groups.flatMap((group) =>
    flattenItems(group.items)
  );

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Biztosan törölni szeretnéd?\n\n${item.label}`
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/navigation/${item.id}`
      );

      await refreshNavigation();
    } catch (error) {
      console.error("Navigáció törlési hiba:", error);
    }
  };

  const handleMove = async (
    siblingItems,
    index,
    direction
  ) => {
    const items = [...siblingItems];

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

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/navigation/reorder`,
        {
          itemIds: items.map((item) => item.id),
        }
      );

      await refreshNavigation();
    } catch (error) {
      console.error("Navigáció rendezési hiba:", error);
    }
  };

  if (loading) {
    return <div className="p-8">Betöltés...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <AdminPageHeader
        title="Navigáció"
        description="A weboldal menüpontjainak, almenüinek és oldalhozzárendeléseinek kezelése."
      />

        <div className="space-y-10">
          {groups.map((group) => (
            <section
              key={group.menuKey}
              className="border border-slate-200 bg-white p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    {group.menuKey === "SUCCESSES"
                      ? "Sikereink"
                      : group.menuKey}
                  </h2>

                  <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                    {group.menuKey}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);

                    setCreating({
                      parent: null,
                      menuKey: group.menuKey,
                    });
                  }}
                  className="bg-slate-950 px-5 py-3 text-sm font-medium text-white"
                >
                  + Új menüpont
                </button>
              </div>

              <NavigationTree
                items={group.items}
                pages={pages}
                allItems={allItems}
                onEdit={(item) => {
                  setCreating(null);
                  setEditingItem(item);
                }}
                onAddChild={(item) => {
                  setEditingItem(null);

                  setCreating({
                    parent: item,
                    menuKey: item.menuKey,
                  });
                }}
                onDelete={handleDelete}
                onMove={handleMove}
              />

              {creating?.menuKey === group.menuKey && (
                <NavigationItemForm
                  parent={creating.parent}
                  menuKey={creating.menuKey}
                  pages={pages}
                  navigationItems={allItems}
                  onClose={() => setCreating(null)}
                  onSaved={async () => {
                    setCreating(null);
                    await refreshNavigation();
                  }}
                />
              )}

              {editingItem?.menuKey === group.menuKey && (
                <NavigationItemForm
                  key={editingItem.id}
                  item={editingItem}
                  pages={pages}
                  navigationItems={allItems}
                  onClose={() => setEditingItem(null)}
                  onSaved={async () => {
                    setEditingItem(null);
                    await refreshNavigation();
                  }}
                />
              )}
            </section>
          ))}
        </div>
    </main>
  );
}