import { useEffect, useState } from "react";
import axios from "axios";
import NavigationItemForm from "../../components/admin/NavigationItemForm";
import AdminPageHeader from "../../components/admin/AdminPageHeader";

const flattenItems = (items) =>
  items.flatMap((item) => [
    item,
    ...flattenItems(item.children || []),
  ]);

const getGroupLabel = (menuKey) => {
  if (menuKey === "SUCCESSES") {
    return "Sikereink";
  }

  return menuKey;
};

const getItemType = (item) => {
  if (item.page) {
    return {
      label: "Oldal",
      target: `/${item.page.slug}`,
    };
  }

  if (item.externalUrl) {
    return {
      label: "Külső link",
      target: item.externalUrl,
    };
  }

  return {
    label: "Csoport",
    target: null,
  };
};

function NavigationPreviewItem({ item, siblings, index, level = 0, selectedItem, onSelect, onAddChild, onDelete, onMove }) {
  const [expanded, setExpanded] = useState(false);
  const type = getItemType(item);
  const selected = selectedItem?.id === item.id;
  const hasChildren = item.children?.length > 0;

  return (
    <div>
      <div
        className={`group flex items-center gap-3 border-l-2 px-4 py-3 transition ${
          selected
            ? "border-slate-950 bg-slate-100"
            : "border-transparent hover:bg-slate-50"
        }`}
      >
        <button
          type="button"
          onClick={() => onSelect(item)}
          className="min-w-0 flex-1 cursor-pointer text-left"
        >
          <div className="flex flex-wrap items-center gap-2">
            {hasChildren && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setExpanded((current) => !current);
                }}
                className="flex h-7 w-7 shrink-0 items-center justify-center text-xs text-slate-500 hover:bg-slate-100"
                title={expanded ? "Almenü bezárása" : "Almenü megnyitása"}
              >
                {expanded ? "▼" : "▶"}
              </button>
            )}
            {!hasChildren && (
              <span className="h-7 w-7 shrink-0" />
            )}

            <span
              className={`font-medium ${
                item.visible
                  ? "text-slate-950"
                  : "text-slate-400"
              }`}
            >
              {item.label}
            </span>

            {!item.visible && (
              <span className="bg-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                Rejtett
              </span>
            )}
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <span>{type.label}</span>

            {type.target && (
              <>
                <span>•</span>
                <span className="truncate">
                  {type.target}
                </span>
              </>
            )}
          </div>
        </button>

        <div
          className={`flex shrink-0 items-center gap-1 transition ${
            selected
              ? "opacity-100"
              : "opacity-40 group-hover:opacity-100"
          }`}
        >
          <button
            type="button"
            disabled={index === 0}
            onClick={() =>
              onMove(siblings, index, "up")
            }
            title="Mozgatás felfelé"
            className="h-9 w-9 border border-slate-200 bg-white text-sm disabled:opacity-20"
          >
            ↑
          </button>

          <button
            type="button"
            disabled={
              index === siblings.length - 1
            }
            onClick={() =>
              onMove(siblings, index, "down")
            }
            title="Mozgatás lefelé"
            className="h-9 w-9 border border-slate-200 bg-white text-sm disabled:opacity-20"
          >
            ↓
          </button>

          <button
            type="button"
            onClick={() => onAddChild(item)}
            className="border border-slate-200 bg-white px-3 py-2 text-xs font-medium"
          >
            + Almenüpont
          </button>

          <button
            type="button"
            onClick={() => onSelect(item)}
            className="border border-slate-200 bg-white px-3 py-2 text-xs font-medium"
          >
            Szerkesztés
          </button>

          <button
            type="button"
            onClick={() => onDelete(item)}
            className="px-3 py-2 text-xs font-medium text-red-600"
          >
            Törlés
          </button>
        </div>
      </div>

      {hasChildren && expanded && (
        <div className="border-l border-slate-200">
          {item.children.map(
            (child, childIndex) => (
              <NavigationPreviewItem
                key={child.id}
                item={child}
                siblings={item.children}
                index={childIndex}
                level={level + 1}
                selectedItem={selectedItem}
                onSelect={onSelect}
                onAddChild={onAddChild}
                onDelete={onDelete}
                onMove={onMove}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminNavigation() {
  const [groups, setGroups] = useState([]);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingItem, setEditingItem] =
    useState(null);

  const [creating, setCreating] =
    useState(null);

  const [selectedMenuKey, setSelectedMenuKey] =
    useState("SUCCESSES");

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
      .then(
        ([
          navigationResponse,
          pagesResponse,
        ]) => {
          setGroups(
            navigationResponse.data
          );

          setPages(
            pagesResponse.data
          );
        }
      )
      .catch((error) => {
        console.error(
          "Admin navigáció betöltési hiba:",
          error
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const allItems = groups.flatMap((group) =>
    flattenItems(group.items)
  );

  const activeGroup =
    groups.find(
      (group) =>
        group.menuKey === selectedMenuKey
    ) || groups[0];

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Biztosan törölni szeretnéd?\n\n${item.label}`
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/navigation/${item.id}`
      );

      if (
        editingItem?.id === item.id
      ) {
        setEditingItem(null);
      }

      await refreshNavigation();
    } catch (error) {
      console.error(
        "Navigáció törlési hiba:",
        error
      );
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
          itemIds: items.map(
            (item) => item.id
          ),
        }
      );

      await refreshNavigation();
    } catch (error) {
      console.error(
        "Navigáció rendezési hiba:",
        error
      );
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        Betöltés...
      </div>
    );
  }

  if (!activeGroup) {
    return (
      <main className="min-h-screen bg-slate-50 py-12">
        <AdminPageHeader
          title="Navigáció"
          description="A weboldal menüjének kezelése."
        />

        <div className="border border-slate-200 bg-white p-8 text-sm text-slate-500">
          Nincs szerkeszthető navigáció.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <AdminPageHeader
        title="Navigáció"
        description="Kattints arra a menüpontra, amelyet módosítani szeretnél."
      />

      <div className="space-y-8">
        <section className="overflow-hidden border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-7 py-5">
            <div className="flex items-center justify-between gap-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Menü előnézet
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  A szerkezet ugyanabban a
                  hierarchiában jelenik meg,
                  ahogy a látogatók számára is.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);

                  setCreating({
                    parent: null,
                    menuKey:
                      activeGroup.menuKey,
                  });
                }}
                className="bg-slate-950 px-5 py-3 text-sm font-medium text-white"
              >
                + Fő almenüpont
              </button>
            </div>
          </div>

          <div className="bg-slate-950 px-8">
            <nav className="flex min-h-16 items-center gap-8">
              {groups.map((group) => {
                const active =
                  group.menuKey ===
                  activeGroup.menuKey;

                return (
                  <button
                    key={group.menuKey}
                    type="button"
                    onClick={() => {
                      setSelectedMenuKey(
                        group.menuKey
                      );

                      setEditingItem(
                        null
                      );

                      setCreating(null);
                    }}
                    className={`relative h-16 text-sm font-medium transition ${
                      active
                        ? "text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {getGroupLabel(
                        group.menuKey
                      )}

                      <span className="text-xs">
                        ▾
                      </span>
                    </span>

                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="bg-slate-100 p-8">
            <div className="mx-auto max-w-4xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-950">
                      {getGroupLabel(
                        activeGroup.menuKey
                      )}
                    </h3>

                    {activeGroup.menuKey ===
                      "SUCCESSES" && (
                      <span className="bg-slate-100 px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                        Fix főmenüpont
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Az alatta lévő elemek
                    szerkeszthetők.
                  </p>
                </div>
              </div>

              <div className="p-3">
                {activeGroup.items.length >
                0 ? (
                  activeGroup.items.map(
                    (item, index) => (
                      <NavigationPreviewItem
                        key={item.id}
                        item={item}
                        siblings={
                          activeGroup.items
                        }
                        index={index}
                        selectedItem={
                          editingItem
                        }
                        onSelect={(
                          selectedItem
                        ) => {
                          setCreating(
                            null
                          );

                          setEditingItem(
                            selectedItem
                          );
                        }}
                        onAddChild={(
                          parent
                        ) => {
                          setEditingItem(
                            null
                          );

                          setCreating({
                            parent,
                            menuKey:
                              parent.menuKey,
                          });
                        }}
                        onDelete={
                          handleDelete
                        }
                        onMove={
                          handleMove
                        }
                      />
                    )
                  )
                ) : (
                  <div className="p-8 text-center text-sm text-slate-500">
                    Még nincs menüpont
                    ebben a menüben.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {(creating ||
          editingItem) && (
          <section className="border border-slate-200 bg-white p-8">
            <div className="mb-6">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                {creating
                  ? "Új menüpont"
                  : "Kijelölt menüpont"}
              </p>

              <h2 className="mt-2 text-xl font-semibold text-slate-950">
                {creating
                  ? creating.parent
                    ? `${creating.parent.label} / Új almenüpont`
                    : "Új menüpont"
                  : editingItem.label}
              </h2>
            </div>

            {creating && (
              <NavigationItemForm
                parent={
                  creating.parent
                }
                menuKey={
                  creating.menuKey
                }
                pages={pages}
                navigationItems={
                  allItems
                }
                onClose={() =>
                  setCreating(null)
                }
                onSaved={async () => {
                  setCreating(null);

                  await refreshNavigation();
                }}
              />
            )}

            {editingItem && (
              <NavigationItemForm
                key={editingItem.id}
                item={editingItem}
                pages={pages}
                navigationItems={
                  allItems
                }
                onClose={() =>
                  setEditingItem(null)
                }
                onSaved={async () => {
                  setEditingItem(null);

                  await refreshNavigation();
                }}
              />
            )}
          </section>
        )}

        {!creating &&
          !editingItem && (
            <div className="border border-dashed border-slate-300 bg-white p-8 text-center">
              <p className="font-medium text-slate-700">
                Válassz ki egy menüpontot
                a szerkesztéshez.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                A menüben kattints arra az
                elemre, amelynek a nevét,
                célját vagy láthatóságát
                módosítani szeretnéd.
              </p>
            </div>
          )}
      </div>
    </main>
  );
}