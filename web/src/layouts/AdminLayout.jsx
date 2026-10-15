import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

const icons = {
  overview: <path d="M4 13h6V4H4v9Zm0 7h6v-4H4v4Zm10 0h6v-9h-6v9Zm0-16v4h6V4h-6Z" />,
  home: <path d="m3 11 9-8 9 8M5.5 9.5V21h13V9.5M9 21v-7h6v7" />,
  pages: <path d="M6 3.5h8l4 4V21H6V3.5Zm8 0v4h4M9 12h6M9 16h6" />,
  navigation: <path d="M4 6h16M4 12h10M4 18h13M18 10l2 2-2 2" />,
};

const navItems = [
  { label: "Áttekintés", to: "/admin", end: true, icon: "overview" },
  { label: "Főoldal", to: "/admin/home", icon: "home" },
  { label: "Oldalak", to: "/admin/pages", icon: "pages" },
  { label: "Navigáció", to: "/admin/navigation", icon: "navigation" },
];

function Icon({ name, className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill={name === "overview" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

function Sidebar({ open, onClose }) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-hidden bg-[#101828] text-white shadow-2xl shadow-slate-950/20 transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(217,119,6,0.18),transparent_28%),linear-gradient(180deg,transparent_60%,rgba(255,255,255,0.025))]" />
      <div className="relative flex h-24 items-center gap-3 border-b border-white/8 px-6">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-sm font-black tracking-tight text-slate-950 shadow-lg shadow-amber-950/30">EF</div>
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-300/80">Tatabányai Erkel Ferenc</p>
          <p className="mt-0.5 text-base font-semibold tracking-tight text-white">Tartalomkezelő</p>
        </div>
        <button type="button" onClick={onClose} className="ml-auto grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden" aria-label="Menü bezárása">×</button>
      </div>

      <nav className="relative flex-1 space-y-1.5 px-4 py-7" aria-label="Adminisztrációs navigáció">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Kezelés</p>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} onClick={onClose} className={({ isActive }) => `group flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${isActive ? "bg-white text-slate-950 shadow-lg shadow-black/20" : "text-slate-300 hover:bg-white/7 hover:text-white"}`}>
            {({ isActive }) => (
              <>
                <span className={`grid h-9 w-9 place-items-center rounded-xl transition ${isActive ? "bg-amber-100 text-amber-700" : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-amber-300"}`}><Icon name={item.icon} className="h-[18px] w-[18px]" /></span>
                <span>{item.label}</span>
                {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-500" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="relative m-4 rounded-2xl border border-white/8 bg-white/[0.035] p-3">
        <Link to="/" onClick={onClose} className="group flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/7 hover:text-white">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-lg transition group-hover:bg-amber-400 group-hover:text-slate-950">←</span>
          <span>Vissza a weboldalra</span>
        </Link>
      </div>
    </aside>
  );
}

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentItem = [...navItems].reverse().find((item) => item.end ? location.pathname === item.to : location.pathname.startsWith(item.to));

  return (
    <div className="admin-shell min-h-screen bg-[#f4f6f8] text-slate-900">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <button type="button" aria-label="Menü bezárása" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden" />}

      <div className="min-h-screen lg:ml-72">
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setSidebarOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden" aria-label="Menü megnyitása">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </button>
            <div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Adminisztráció</p><p className="mt-0.5 text-sm font-semibold text-slate-800">{currentItem?.label || "Tartalomkezelő"}</p></div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:flex"><span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" /> Rendszer elérhető</span>
            <Link to="/" target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:px-4"><span className="hidden sm:inline">Weboldal megnyitása</span><span aria-hidden="true">↗</span></Link>
          </div>
        </header>

        <div className="relative p-4 sm:p-6 lg:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_15%_10%,rgba(245,158,11,0.07),transparent_32%),radial-gradient(circle_at_85%_0%,rgba(59,130,246,0.05),transparent_30%)]" />
          <div className="relative"><Outlet /></div>
        </div>
      </div>
    </div>
  );
}
