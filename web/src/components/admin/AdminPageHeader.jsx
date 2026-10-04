import { Link } from "react-router-dom";

export default function AdminPageHeader({ title, description, backTo, backLabel = "Vissza", children }) {
  return (
    <div className="mb-8">
      {backTo && (
        <Link
          to={backTo}
          className="mb-4 inline-block text-sm font-medium text-slate-500 transition hover:text-slate-950"
        >
          ← {backLabel}
        </Link>
      )}

      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">
            {title}
          </h1>

          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {description}
            </p>
          )}
        </div>

        {children && (
          <div className="shrink-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}