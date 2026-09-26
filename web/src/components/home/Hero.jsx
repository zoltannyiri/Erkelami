import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto grid min-h-[520px] max-w-[1400px] grid-cols-2 items-center gap-16 px-8 py-20">

        <div>
          <span className="mb-4 block text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
            Tatabánya
          </span>

          <h1 className="max-w-xl text-5xl font-semibold leading-tight tracking-tight text-slate-950">
            Erkel Ferenc Alapfokú Művészeti Iskola
          </h1>

          <div className="mt-8 flex gap-4">
            <Link
              to="/iskolank"
              className="bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Ismerje meg iskolánkat
            </Link>

            <Link
              to="/kapcsolat"
              className="border border-slate-300 px-6 py-3 text-sm font-medium text-slate-800 transition hover:bg-white"
            >
              Kapcsolat
            </Link>
          </div>
        </div>

        <div className="h-[400px] overflow-hidden bg-slate-200">
          {/* később Supabase Storage kép */}
          <div className="flex h-full items-center justify-center text-slate-400">
            Iskolai hero kép
          </div>
        </div>

      </div>
    </section>
  );
}