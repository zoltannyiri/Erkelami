import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import axios from 'axios';

export default function AdminPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPages = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/pages`)
      .then((response) => {
        setPages(response.data);
      })
      .catch((error) => {
        console.error('Hiba az oldalak betöltésekor:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleDelete = async (page) => {
    const confirmed = window.confirm(`Biztosan törölni szeretnéd az oldalt: "${page.title}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/pages/${page.id}`);

      setPages((current) => current.filter((item) => item.id !== page.id));
    } catch (error) {
      console.error('Hiba az oldal törlésekor:', error);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse space-y-5">
        <div className="h-10 w-48 rounded-xl bg-slate-200" />
        <div className="h-64 rounded-3xl bg-white shadow-sm" />
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl">

        <AdminPageHeader
          title="Oldalak"
          description="A weboldal dinamikus oldalainak létrehozása és szerkesztése."
        >
          <Link to="/admin/pages/new" className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800">
            <span className="text-lg leading-none">+</span> Új oldal
          </Link>
        </AdminPageHeader>

        <div className="overflow-hidden rounded-3xl border border-white bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-7">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-100 text-sm font-black text-sky-700">{pages.length}</span>
              <div><p className="text-sm font-semibold text-slate-900">Létrehozott oldalak</p><p className="text-xs text-slate-500">Publikált és piszkozat tartalmak</p></div>
            </div>
          </div>
          {pages.length === 0 ? (
            <div className="p-14 text-center text-slate-500">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-2xl">＋</div>
              <p className="mt-4 text-sm">Még nincs létrehozott oldal.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="group flex flex-col gap-5 px-5 py-5 transition hover:bg-slate-50/80 sm:flex-row sm:items-center sm:justify-between sm:px-7"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="hidden h-9 w-1 rounded-full bg-gradient-to-b from-amber-400 to-orange-500 transition group-hover:h-11 sm:block" />
                      <h2 className="truncate font-semibold text-slate-950">
                        {page.title}
                      </h2>

                      <span
                        className={
                          page.published
                            ? "rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700"
                            : "rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500"
                        }
                      >
                        {page.published ? "Publikált" : "Piszkozat"}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:ml-4">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono">/{page.slug}</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-medium">
                        {page._count?.sections ?? 0} blokk
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                    {page.published && (
                      <Link
                        to={`/${page.slug}`}
                        target="_blank"
                        className="rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-slate-950 hover:shadow-sm"
                      >
                        Megtekintés
                      </Link>
                    )}

                    <Link
                      to={`/admin/pages/${page.id}`}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                    >
                      Szerkesztés
                    </Link>

                    <button
                      onClick={() => handleDelete(page)}
                      className="rounded-xl px-3.5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Törlés
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

    </main>
  );
}
