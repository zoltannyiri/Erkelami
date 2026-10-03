import { Link } from "react-router-dom";

const cards = [
  {
    title: "Főoldal",
    description:
      "Főoldali csempék, linkek, láthatóság és sorrend kezelése.",
    to: "/admin/home",
  },
  {
    title: "Oldalak",
    description:
      "Dinamikus oldalak létrehozása és tartalmi blokkok szerkesztése.",
    to: "/admin/pages",
  },
  {
    title: "Navigáció",
    description:
      "Menüpontok, almenük és az oldalakhoz tartozó navigáció kezelése.",
    to: "/admin/navigation",
  },
];

export default function AdminDashboard() {
  return (
    <main className="mx-auto max-w-7xl">
      <div className="mb-10">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          Adminisztráció
        </p>

        <h1 className="mt-2 text-3xl font-semibold text-slate-950">
          Áttekintés
        </h1>

        <p className="mt-2 max-w-2xl text-slate-500">
          Innen kezelheted az iskola weboldalának tartalmát és
          navigációját.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="group border border-slate-200 bg-white p-7 transition hover:border-slate-400 hover:shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-950">
              {card.title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {card.description}
            </p>

            <div className="mt-6 text-sm font-medium text-slate-950">
              Megnyitás
              <span className="ml-2 inline-block transition group-hover:translate-x-1">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 border border-slate-200 bg-white p-7">
        <h2 className="text-lg font-semibold text-slate-950">
          Gyors műveletek
        </h2>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/admin/pages/new"
            className="bg-slate-950 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            + Új oldal
          </Link>

          <Link
            to="/admin/home"
            className="border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Főoldal szerkesztése
          </Link>

          <Link
            to="/admin/navigation"
            className="border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Navigáció kezelése
          </Link>
        </div>
      </div>
    </main>
  );
}