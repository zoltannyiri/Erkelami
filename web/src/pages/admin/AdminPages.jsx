import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    return <div classsName="pp-8">Betöltés...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-6xl px-8">

        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Adminisztráció
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-slate-950">
              Oldalak
            </h1>
          </div>

          <Link
            to="/admin/pages/new"
            className="bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            + Új oldal
          </Link>
        </div>

        <div className="overflow-hidden border border-slate-200 bg-white">
          {pages.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              Még nincs létrehozott oldal.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between p-6"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-semibold text-slate-950">
                        {page.title}
                      </h2>

                      <span
                        className={
                          page.published
                            ? "bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
                            : "bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500"
                        }
                      >
                        {page.published ? "Publikált" : "Piszkozat"}
                      </span>
                    </div>

                    <div className="mt-2 flex gap-4 text-sm text-slate-500">
                      <span>/{page.slug}</span>

                      <span>
                        {page._count?.sections ?? 0} blokk
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {page.published && (
                      <Link
                        to={`/${page.slug}`}
                        target="_blank"
                        className="px-4 py-2 text-sm text-slate-600 hover:text-slate-950"
                      >
                        Megtekintés
                      </Link>
                    )}

                    <Link
                      to={`/admin/pages/${page.id}`}
                      className="border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Szerkesztés
                    </Link>

                    <button
                      onClick={() => handleDelete(page)}
                      className="px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Törlés
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}