import { NavLink, Outlet, Link } from "react-router-dom";

const navItems = [
  {
    label: "Áttekintés",
    to: "/admin",
    end: true,
  },
  {
    label: "Főoldal",
    to: "/admin/home",
  },
  {
    label: "Oldalak",
    to: "/admin/pages",
  },
  {
    label: "Navigáció",
    to: "/admin/navigation",
  },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 flex w-64 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            Erkel Ferenc
          </p>

          <h1 className="mt-1 text-xl font-semibold text-slate-950">
            Admin
          </h1>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  "block px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <Link
            to="/"
            className="block px-4 py-3 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-950"
          >
            ← Vissza a weboldalra
          </Link>
        </div>
      </aside>

      <div className="ml-64 min-h-screen">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div>
            <span className="text-sm text-slate-500">
              Tartalomkezelő rendszer
            </span>
          </div>

          <Link
            to="/"
            target="_blank"
            className="text-sm font-medium text-slate-600 hover:text-slate-950"
          >
            Weboldal megnyitása ↗
          </Link>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}