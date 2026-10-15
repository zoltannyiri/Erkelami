import { Link } from "react-router-dom";

const cards = [
  { title: "Főoldal", description: "Csempék, kiemelések és a nyitóoldal tartalmi sorrendje.", to: "/admin/home", number: "01", color: "from-amber-400 to-orange-500", tint: "bg-amber-50 text-amber-700" },
  { title: "Oldalak", description: "Dinamikus oldalak és vizuálisan szerkeszthető tartalmi blokkok.", to: "/admin/pages", number: "02", color: "from-sky-400 to-blue-600", tint: "bg-sky-50 text-sky-700" },
  { title: "Navigáció", description: "Főmenüpontok, almenük és a teljes menühierarchia kezelése.", to: "/admin/navigation", number: "03", color: "from-violet-400 to-indigo-600", tint: "bg-violet-50 text-violet-700" },
];

export default function AdminDashboard() {
  return (
    <main className="mx-auto max-w-7xl">
      <section className="relative mb-7 overflow-hidden rounded-[2rem] bg-[#101828] px-6 py-9 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] sm:px-10 sm:py-11">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(251,191,36,0.20),transparent_24%),radial-gradient(circle_at_5%_100%,rgba(59,130,246,0.13),transparent_30%)]" />
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10" />
        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Admin központ</div>
            <h1 className="max-w-2xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Jó munkát!</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">Innen egy helyen eléred az iskola weboldalának minden szerkeszthető tartalmát.</p>
          </div>
          <Link to="/admin/pages/new" className="inline-flex w-fit items-center gap-3 rounded-2xl bg-amber-400 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-950/20 transition hover:-translate-y-0.5 hover:bg-amber-300"><span className="text-lg leading-none">+</span> Új oldal létrehozása</Link>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.to} to={card.to} className="group relative overflow-hidden rounded-3xl border border-white bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.11)]">
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.color} opacity-75 transition group-hover:h-1.5 group-hover:opacity-100`} />
            <div className="flex items-start justify-between gap-5"><span className={`grid h-12 w-12 place-items-center rounded-2xl text-sm font-black ${card.tint}`}>{card.number}</span><span className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-400 transition group-hover:border-slate-950 group-hover:bg-slate-950 group-hover:text-white">↗</span></div>
            <h2 className="mt-8 text-xl font-semibold tracking-tight text-slate-950">{card.title}</h2>
            <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">{card.description}</p>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-slate-900">Megnyitás <span className="transition group-hover:translate-x-1">→</span></div>
          </Link>
        ))}
      </div>

      <section className="mt-7 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)] sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Gyors elérés</p><h2 className="mt-2 text-lg font-semibold text-slate-950">Gyakori műveletek</h2></div>
          <div className="flex flex-wrap gap-2.5"><Link to="/admin/home" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white hover:shadow-sm">Főoldal szerkesztése</Link><Link to="/admin/navigation" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white hover:shadow-sm">Navigáció kezelése</Link></div>
        </div>
      </section>
    </main>
  );
}
