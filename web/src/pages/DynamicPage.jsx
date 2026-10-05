import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import PageSectionRenderer from "../components/page/PageSectionRenderer";

export default function DynamicPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/pages/${slug}`)
      .then((response) => {
        setPage(response.data);
      })
      .catch((error) => {
        console.error(error);
        setError("Az oldal nem található.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return null;
  }

  if (error) {
    return <div>{error}</div>
  }

  const startsWithHero = page.sections?.[0]?.type === "HERO";

  return (
    <main className="bg-[#fffefa]">
      {!startsWithHero && (
        <header className="border-b border-stone-200 bg-gradient-to-br from-stone-50 via-white to-amber-50/30 py-9 sm:py-12">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-800">Erkel Ferenc Alapfokú Művészeti Iskola</p>
            <h1 className="max-w-4xl text-3xl font-semibold tracking-[-0.025em] text-slate-950 sm:text-5xl">{page.title}</h1>
          </div>
        </header>
      )}

      {page.sections?.map((section, index) => (
        <PageSectionRenderer
          key={section.id}
          section={section}
          pageTitle={index === 0 ? page.title : undefined}
        />
      ))}
    </main>
  );
}
