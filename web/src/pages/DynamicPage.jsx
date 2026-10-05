import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import PageSectionRenderer from "../components/page/PageSectionRenderer";
import NotFoundPage from "./NotFoundPage";

const DEFAULT_TITLE = "Erkel Ferenc Alapfokú Művészeti Iskola";

export default function DynamicPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let ignore = false;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/pages/${slug}`)
      .then((response) => {
        if (ignore) return;
        setPage(response.data);
        setErrorStatus(null);
      })
      .catch((err) => {
        if (ignore) return;
        console.error("DynamicPage betöltési hiba:", err);
        setErrorStatus(err.response?.status || 500);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [slug, reloadCount]);

  const handleRetry = () => {
    setLoading(true);
    setErrorStatus(null);
    setReloadCount((count) => count + 1);
  };

  // SEO document title and meta description sync
  useEffect(() => {
    if (!page) return;

    const pageTitle = page.metaTitle?.trim()
      ? page.metaTitle.trim()
      : `${page.title} | ${DEFAULT_TITLE}`;

    document.title = pageTitle;

    let metaTag = document.querySelector('meta[name="description"]');
    const createdMetaTag = !metaTag;
    const previousContent = metaTag?.getAttribute("content") || null;

    if (page.metaDescription?.trim()) {
      if (!metaTag) {
        metaTag = document.createElement("meta");
        metaTag.name = "description";
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute("content", page.metaDescription.trim());
    } else if (metaTag && previousContent === null) {
      metaTag.remove();
    }

    return () => {
      document.title = DEFAULT_TITLE;
      if (createdMetaTag && metaTag && metaTag.parentNode) {
        metaTag.parentNode.removeChild(metaTag);
      } else if (metaTag && previousContent !== null) {
        metaTag.setAttribute("content", previousContent);
      }
    };
  }, [page]);

  if (loading) {
    return (
      <main className="min-h-[60vh] bg-[#fffefa]">
        <header className="border-b border-stone-200 bg-gradient-to-br from-stone-50 via-white to-amber-50/30 py-9 sm:py-12">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <div className="mb-3 h-3 w-48 animate-pulse rounded bg-amber-200/70" />
            <div className="h-10 w-2/3 animate-pulse rounded bg-slate-200" />
          </div>
        </header>
        <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
          <div className="space-y-4 animate-pulse">
            <div className="h-5 w-1/3 rounded bg-slate-200" />
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-5/6 rounded bg-slate-100" />
            <div className="h-4 w-4/6 rounded bg-slate-100" />
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 animate-pulse">
            <div className="h-24 rounded border border-slate-200 bg-slate-50" />
            <div className="h-24 rounded border border-slate-200 bg-slate-50" />
          </div>
        </div>
      </main>
    );
  }

  if (errorStatus === 404) {
    return (
      <NotFoundPage
        title="404"
        message="Az oldal nem található."
        description="A keresett oldal nem létezik vagy még nem került publikálásra."
      />
    );
  }

  if (errorStatus) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-md text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-600">
            Hiba
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Az oldal betöltése közben hiba történt.
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Kérjük, ellenőrizd az internetkapcsolatot vagy próbáld meg újra később.
          </p>
          <div className="mt-7 flex justify-center">
            <button
              type="button"
              onClick={handleRetry}
              className="cursor-pointer inline-flex items-center justify-center bg-slate-950 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
            >
              Próbáld újra
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!page) {
    return null;
  }

  const startsWithHero = page.sections?.[0]?.type === "HERO";

  return (
    <main className="bg-[#fffefa]">
      {!startsWithHero && (
        <header className="border-b border-stone-200 bg-gradient-to-br from-stone-50 via-white to-amber-50/30 py-9 sm:py-12">
          <div className="mx-auto max-w-5xl px-5 sm:px-8">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-800">
              Erkel Ferenc Alapfokú Művészeti Iskola
            </p>
            <h1 className="max-w-4xl text-3xl font-semibold tracking-[-0.025em] text-slate-950 sm:text-5xl">
              {page.title}
            </h1>
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
