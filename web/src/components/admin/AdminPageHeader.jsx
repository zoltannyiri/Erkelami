import { Link } from "react-router-dom";

export default function AdminPageHeader({ title, description, backTo, backLabel = "Vissza", children }) {
  return (
    <div className="mb-8 sm:mb-10">
      {backTo && (
        <Link to={backTo} className="mb-5 inline-flex items-center gap-2 rounded-xl px-1 py-1 text-sm font-semibold text-slate-500 transition hover:text-slate-950">
          <span className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 bg-white shadow-sm">←</span>{backLabel}
        </Link>
      )}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-2"><span className="h-1.5 w-7 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" /><span className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-700">Tartalomkezelés</span></div>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">{title}</h1>
          {description && <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">{description}</p>}
        </div>
        {children && <div className="shrink-0">{children}</div>}
      </div>
    </div>
  );
}
