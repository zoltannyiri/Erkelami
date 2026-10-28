import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

const icons = {
  overview: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <path d="m3 11 9-8 9 8M5.5 9.5V21h13V9.5M9 21v-7h6v7" />
    </svg>
  ),
  pages: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <path d="M6 3.5h8l4 4V21H6V3.5Zm8 0v4h4M9 12h6M9 16h6" />
    </svg>
  ),
  navigation: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <path d="M4 6h16M4 12h10M4 18h13M18 10l2 2-2 2" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <path d="M6 3v3M18 3v3M4 9h16M5 5h14a2 2 0 0 1 2 2v13H3V7a2 2 0 0 1 2-2ZM7.5 13h3M13.5 13h3M7.5 17h3" />
    </svg>
  ),
};

const navItems = [
  { label: "Áttekintés", to: "/admin", end: true, icon: "overview", hint: "Kezdőlap & statisztikák" },
  { label: "Főoldal csempék", to: "/admin/home", icon: "home", hint: "Csempék, plakátok, sorrend" },
  { label: "Oldalak", to: "/admin/pages", icon: "pages", hint: "Dinamikus tartalmak, PDF-ek" },
  { label: "Navigáció", to: "/admin/navigation", icon: "navigation", hint: "Fejléc és menühierarchia" },
  { label: "Publikus naptár", to: "/admin/calendar", icon: "calendar", hint: "Koncertek, események" },
];

function Sidebar({ open, onClose }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-hidden bg-gradient-to-b from-[#241220] via-[#1a111a] to-[#120d13] text-white shadow-2xl shadow-black/40 transition-transform duration-300 lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Finom meleg borostyánfény a fejléc mögött */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-amber-600/15 blur-3xl"
      />

      {/* ── INTÉZMÉNYI FEJLÉC (A nyilvános oldal dizájnjával azonos motívum) ── */}
      <div className="relative border-b border-white/10 px-6 py-6">
        <div className="flex items-start justify-between gap-3">
          <Link
            to="/admin"
            onClick={onClose}
            className="group flex items-start gap-3 transition"
          >
            {/* A zeneiskola védjegye: a függőleges borostyán sáv */}
            <span
              aria-hidden="true"
              className="mt-1 h-10 w-[3px] rounded-full bg-amber-400 transition-all duration-300 group-hover:h-12 group-hover:bg-amber-300"
            />

            <div className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-200/90">
                Tatabányai
              </span>
              <span className="font-serif text-lg font-semibold leading-tight tracking-[-0.02em] text-white">
                Erkel Ferenc
              </span>
              <span className="mt-0.5 text-[9px] font-medium tracking-[0.12em] text-stone-400">
                Alapfokú Művészeti Iskola
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-stone-400 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Menü bezárása"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Tartalomkezelő
          </span>
        </div>
      </div>

      <div className="px-4 pt-4">
        <Link
          to="/admin/pages/new"
          onClick={onClose}
          className="group flex items-center justify-center gap-2 rounded-xl border border-amber-400/40 bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/15 px-3.5 py-2.5 text-xs font-semibold text-amber-200 shadow-sm transition hover:border-amber-400 hover:bg-amber-400 hover:text-slate-950"
        >
          <span className="text-sm font-bold leading-none transition-transform group-hover:rotate-90">
            +
          </span>
          <span>Új oldal létrehozása</span>
        </Link>
      </div>

      <nav
        className="relative flex-1 space-y-1 overflow-y-auto px-3 py-5"
        aria-label="Adminisztrációs menü"
      >
        <div className="mb-2.5 flex items-center gap-2 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-400">
          <span className="h-px w-3 bg-amber-500/50" />
          <span>Kezelőfelület</span>
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "border border-amber-400/35 bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-transparent text-white shadow-sm"
                  : "border border-transparent text-stone-300 hover:bg-white/[0.06] hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Bal oldali aktív jelző csík */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute -left-1 top-2 bottom-2 w-1 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                  />
                )}

                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors ${
                    isActive
                      ? "bg-amber-400 text-slate-950 font-bold shadow-sm"
                      : "bg-white/[0.06] text-stone-400 group-hover:bg-white/[0.12] group-hover:text-amber-200"
                  }`}
                >
                  {icons[item.icon]}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold leading-tight">
                    {item.label}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-stone-400 group-hover:text-stone-300">
                    {item.hint}
                  </p>
                </div>

                <span
                  className={`text-xs transition-transform ${
                    isActive
                      ? "text-amber-300 translate-x-0.5"
                      : "text-stone-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                  }`}
                  aria-hidden="true"
                >
                  →
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── LÁBRÉSZ: KOTTA VONALAK & KÜLSŐ HIVATKOZÁS ── */}
      <div className="relative border-t border-white/10 p-4">
        {/* Klasszikus 5 kottavonal finoman elhalványítva */}
        <div aria-hidden="true" className="mb-3 space-y-1 px-1 opacity-25">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-px bg-gradient-to-r from-transparent via-amber-200/70 to-transparent"
            />
          ))}
        </div>

        <Link
          to="/"
          target="_blank"
          rel="noreferrer"
          onClick={onClose}
          className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-xs font-semibold text-stone-300 transition hover:border-amber-400/40 hover:bg-white/[0.08] hover:text-white"
        >
          <span className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-white/10 text-stone-300 transition group-hover:bg-amber-400 group-hover:text-slate-950">
              ↗
            </span>
            <span>Weboldal megtekintése</span>
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
            Élő nézet
          </span>
        </Link>

        <p className="mt-2 text-center text-[10px] font-mono text-stone-400">
          Erkel Ferenc AMI · Tatabánya
        </p>
      </div>
    </aside>
  );
}

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentItem = [...navItems]
    .reverse()
    .find((item) =>
      item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
    );

  return (
    <div className="admin-shell min-h-screen bg-[#f8f5ef] text-slate-900">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Menü bezárása"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <div className="min-h-screen lg:ml-72">
        {/* ── FELSŐ FEJLÉC (Meleg elefántcsont tónusban, arany jelöléssel) ── */}
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-stone-200/90 bg-[#fffefa]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-stone-200 bg-white text-slate-700 shadow-sm transition hover:bg-stone-50 lg:hidden"
              aria-label="Menü megnyitása"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-800">
                Tatabányai Erkel Ferenc AMI
              </p>
              <h2 className="mt-0.5 font-serif text-base font-semibold text-slate-900 sm:text-lg">
                {currentItem?.label || "Tartalomkezelő"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]" />
              Adminisztráció aktív
            </span>

            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-400 hover:text-amber-900 hover:shadow-md sm:px-4 sm:text-sm"
            >
              <span className="hidden sm:inline">Weboldal megnyitása</span>
              <span aria-hidden="true" className="text-xs">↗</span>
            </Link>
          </div>
        </header>

        {/* ── TARTALOM TERÜLET ── */}
        <div className="relative p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
