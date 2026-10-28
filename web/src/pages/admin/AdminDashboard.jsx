import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const modules = [
  {
    key: "home",
    tag: "01 · Nyitóoldal",
    title: "Kezdőlap kiemelések",
    description: "A nyitóoldal 4:3-as csempéi, plakátjai, PDF felhívásai és a tartalmi sorrend átrendezése.",
    to: "/admin/home",
    actionLabel: "Csempék kezelése",
    accentBorder: "border-amber-200 hover:border-amber-400",
    accentBar: "bg-amber-600",
    accentBadge: "bg-amber-50 text-amber-800 border-amber-200",
    iconBg: "bg-amber-100/70 text-amber-800",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <path d="m3 11 9-8 9 8M5.5 9.5V21h13V9.5M9 21v-7h6v7" />
      </svg>
    ),
  },
  {
    key: "pages",
    tag: "02 · Tartalmak",
    title: "Oldalak & Dokumentumok",
    description: "Tanszaki bemutatók, szabályzatok, beágyazott PDF dokumentumok és dinamikus oldalak vizuális szerkesztése.",
    to: "/admin/pages",
    actionLabel: "Oldalak szerkesztése",
    accentBorder: "border-rose-200 hover:border-rose-400",
    accentBar: "bg-rose-700",
    accentBadge: "bg-rose-50 text-rose-800 border-rose-200",
    iconBg: "bg-rose-100/70 text-rose-800",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <path d="M6 3.5h8l4 4V21H6V3.5Zm8 0v4h4M9 12h6M9 16h6" />
      </svg>
    ),
  },
  {
    key: "navigation",
    tag: "03 · Menürendszer",
    title: "Fejléc és navigáció",
    description: "A weboldal főmenüi, legördülő almenüi, a tanszaki fa és a közvetlen intézményi hivatkozások.",
    to: "/admin/navigation",
    actionLabel: "Menüstruktúra",
    accentBorder: "border-indigo-200 hover:border-indigo-400",
    accentBar: "bg-indigo-700",
    accentBadge: "bg-indigo-50 text-indigo-800 border-indigo-200",
    iconBg: "bg-indigo-100/70 text-indigo-800",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <path d="M4 6h16M4 12h10M4 18h13M18 10l2 2-2 2" />
      </svg>
    ),
  },
  {
    key: "calendar",
    tag: "04 · Időpontok",
    title: "Események & Naptár",
    description: "Hangversenyek, növendékhangversenyek, versenyek, felvételik és iskolai időpontok nyilvános naptára.",
    to: "/admin/calendar",
    actionLabel: "Naptár megnyitása",
    accentBorder: "border-teal-200 hover:border-teal-400",
    accentBar: "bg-teal-700",
    accentBadge: "bg-teal-50 text-teal-800 border-teal-200",
    iconBg: "bg-teal-100/70 text-teal-800",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
        <path d="M6 3v3M18 3v3M4 9h16M5 5h14a2 2 0 0 1 2 2v13H3V7a2 2 0 0 1 2-2ZM7.5 13h3M13.5 13h3M7.5 17h3" />
      </svg>
    ),
  },
];

function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("hu-HU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d);
  } catch {
    return "";
  }
}

export default function AdminDashboard() {
  const [pages, setPages] = useState([]);
  const [homeSections, setHomeSections] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const apiUrl = import.meta.env.VITE_API_URL;

    Promise.all([
      axios.get(`${apiUrl}/api/admin/pages`).catch(() => ({ data: [] })),
      axios.get(`${apiUrl}/api/admin/home`).catch(() => ({ data: [] })),
      axios.get(`${apiUrl}/api/admin/calendar`).catch(() => ({ data: [] })),
    ])
      .then(([pagesRes, homeRes, calRes]) => {
        if (ignore) return;
        setPages(Array.isArray(pagesRes.data) ? pagesRes.data : []);
        setHomeSections(Array.isArray(homeRes.data) ? homeRes.data : []);
        setCalendarEvents(Array.isArray(calRes.data) ? calRes.data : []);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const totalPages = pages.length;
  const publishedPages = pages.filter((p) => p.published).length;
  const totalHomeTiles = homeSections.reduce(
    (sum, section) => sum + (Array.isArray(section.items) ? section.items.length : 0),
    0
  );
  const totalEvents = calendarEvents.length;

  const recentPages = [...pages]
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    .slice(0, 5);

  const getModuleBadge = (key) => {
    if (loading) return "Betöltés...";
    switch (key) {
      case "home":
        return `${totalHomeTiles} csempe`;
      case "pages":
        return `${publishedPages} publikált (${totalPages})`;
      case "navigation":
        return "Fő- és almenük";
      case "calendar":
        return `${totalEvents} esemény`;
      default:
        return "";
    }
  };

  return (
    <main className="mx-auto max-w-7xl space-y-8">
      {/* ── ERKEL INTÉZMÉNYI FEJLÉC ── */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#27101f] via-[#1a1422] to-[#121c27] px-6 py-9 text-white shadow-[0_16px_40px_rgba(24,14,28,0.18)] sm:px-10 sm:py-11">
        {/* Klasszikus kotta vonalak a háttérben - a zeneiskola zenei identitása */}
        <div aria-hidden="true" className="pointer-events-none absolute right-0 top-1/4 hidden w-1/3 opacity-20 lg:block">
          {[0, 1, 2, 3, 4].map((line) => (
            <div key={line} className="mt-3.5 h-px bg-gradient-to-r from-transparent via-amber-200/40 to-amber-100/70" />
          ))}
        </div>

        {/* Finom meleg borostyánfény a sarokban */}
        <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-amber-600/15 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-amber-200/90 sm:text-xs">
              <span className="h-px w-7 bg-amber-400" />
              Tatabányai Erkel Ferenc AMI
            </div>

            <h1 className="font-serif text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
              Tartalomkezelő Központ
            </h1>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/admin/pages/new"
                className="inline-flex items-center gap-2.5 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-400"
              >
                <span className="text-base font-bold leading-none">+</span>
                Új oldal létrehozása
              </Link>

              <Link
                to="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-medium text-stone-200 backdrop-blur-sm transition hover:border-white/35 hover:bg-white/10 hover:text-white"
              >
                <span>Publikus oldal megtekintése</span>
              </Link>
            </div>
          </div>

          {/* Valós összesítő számlálók */}
          <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-6 sm:gap-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center backdrop-blur-sm">
              <span className="font-serif text-2xl font-bold text-amber-300 sm:text-3xl">
                {loading ? "…" : publishedPages}
              </span>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                Publikált oldal
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center backdrop-blur-sm">
              <span className="font-serif text-2xl font-bold text-amber-300 sm:text-3xl">
                {loading ? "…" : totalHomeTiles}
              </span>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                Nyitó csempe
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center backdrop-blur-sm">
              <span className="font-serif text-2xl font-bold text-amber-300 sm:text-3xl">
                {loading ? "…" : totalEvents}
              </span>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">
                Naptár esemény
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 FŐ MODULKÁRTYA ── */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
              Kezelés & Szerkesztés
            </p>
            <h2 className="mt-1 font-serif text-xl font-semibold text-slate-900 sm:text-2xl">
              Főbb feladatkörök
            </h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {modules.map((mod) => (
            <Link
              key={mod.key}
              to={mod.to}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-6 shadow-[0_4px_20px_rgba(51,39,24,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(51,39,24,0.11)] ${mod.accentBorder}`}
            >
              {/* Vékony elegáns díszcsík felül */}
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 top-0 h-1 ${mod.accentBar} transition-all duration-300 group-hover:h-1.5`}
              />

              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className={`grid h-11 w-11 place-items-center rounded-xl ${mod.iconBg}`}>
                    {mod.icon}
                  </span>
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase ${mod.accentBadge}`}>
                    {getModuleBadge(mod.key)}
                  </span>
                </div>

                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  {mod.tag}
                </p>

                <h3 className="mt-1 font-serif text-xl font-semibold text-slate-900 transition-colors group-hover:text-amber-900">
                  {mod.title}
                </h3>

                <p className="mt-2.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                  {mod.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4 text-xs font-semibold text-slate-900">
                <span>{mod.actionLabel}</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-slate-700 transition group-hover:translate-x-1 group-hover:bg-amber-600 group-hover:text-white">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── ALSÓ KÉTHARMADOS RÉSZLET: VALÓS TARTALMAK & GYORS MŰVELETEK ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Bal oldal (2 oszlop): Legutóbb módosított oldalak */}
        <section className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-[0_4px_20px_rgba(51,39,24,0.04)] lg:col-span-2 sm:p-7">
          <div className="mb-5 flex flex-col justify-between gap-2 border-b border-stone-100 pb-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Tartalmi előzmények
              </p>
              <h3 className="mt-1 font-serif text-lg font-semibold text-slate-900 sm:text-xl">
                Legutóbb módosított oldalak
              </h3>
            </div>

            <Link
              to="/admin/pages"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 transition hover:text-amber-900 hover:underline"
            >
              Összes oldal megtekintése ({totalPages}) →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3 py-6 text-center text-sm text-slate-400 animate-pulse">
              Oldalak betöltése...
            </div>
          ) : recentPages.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Még nem hozott létre egyetlen oldalt sem.
            </p>
          ) : (
            <div className="divide-y divide-stone-100">
              {recentPages.map((page) => (
                <div
                  key={page.id}
                  className="group flex flex-col justify-between gap-3 py-3.5 sm:flex-row sm:items-center transition hover:bg-amber-50/30 -mx-3 px-3 rounded-xl"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h4 className="font-semibold text-slate-900 group-hover:text-amber-900">
                        {page.title}
                      </h4>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${
                          page.published
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {page.published ? "Publikált" : "Vázlat"}
                      </span>
                    </div>

                    <p className="mt-1 font-mono text-xs text-slate-400">
                      /{page.slug}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-xs text-slate-400">
                      {formatDate(page.updatedAt)}
                    </span>

                    <Link
                      to={`/admin/pages/${page.id}/visual`}
                      className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900"
                    >
                      Szerkesztés
                    </Link>

                    <Link
                      to={`/${page.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-transparent p-1.5 text-slate-400 transition hover:bg-stone-100 hover:text-slate-700"
                      title="Publikus megtekintés"
                    >
                      ↗
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Jobb oldal (1 oszlop): Gyorsműveletek & Iskolai információk */}
        <div className="space-y-6">
          {/* Gyors műveletek */}
          <section className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-[0_4px_20px_rgba(51,39,24,0.04)] sm:p-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Gyors elérés
            </p>
            <h3 className="mt-1 font-serif text-lg font-semibold text-slate-900">
              Gyakori műveletek
            </h3>

            <div className="mt-5 space-y-2.5">
              <Link
                to="/admin/pages/new"
                className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs font-semibold text-amber-900 transition hover:border-amber-400 hover:bg-amber-100"
              >
                <span className="flex items-center gap-2">
                  <span className="text-base font-bold leading-none">+</span>
                  Új oldal létrehozása
                </span>
                <span>→</span>
              </Link>

              <Link
                to="/admin/home"
                className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50/60 p-3 text-xs font-semibold text-slate-700 transition hover:border-stone-300 hover:bg-white hover:shadow-sm"
              >
                <span>Főoldali csempék és plakátok</span>
                <span>→</span>
              </Link>

              <Link
                to="/admin/navigation"
                className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50/60 p-3 text-xs font-semibold text-slate-700 transition hover:border-stone-300 hover:bg-white hover:shadow-sm"
              >
                <span>Navigációs menüpontok</span>
                <span>→</span>
              </Link>

              <Link
                to="/admin/calendar"
                className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50/60 p-3 text-xs font-semibold text-slate-700 transition hover:border-stone-300 hover:bg-white hover:shadow-sm"
              >
                <span>Új naptári esemény rögzítése</span>
                <span>→</span>
              </Link>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
