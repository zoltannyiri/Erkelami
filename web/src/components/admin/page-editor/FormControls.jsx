export const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10";

export function TextField({ label, value, onChange, placeholder = "" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input value={value || ""} onChange={(event) => onChange(event.target.value)} className={inputClassName} placeholder={placeholder} />
    </label>
  );
}

export function TextAreaField({ label, value, onChange, rows = 4 }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <textarea value={value || ""} onChange={(event) => onChange(event.target.value)} rows={rows} className={`${inputClassName} resize-y`} />
    </label>
  );
}

export function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClassName}>
        {options.map((option) => {
          const normalized = typeof option === "string" ? { value: option, label: option } : option;
          return <option key={normalized.value} value={normalized.value}>{normalized.label}</option>;
        })}
      </select>
    </label>
  );
}

export function TextAlignField({ label = "Cím igazítása", value = "center", onChange }) {
  const options = [
    { value: "left", label: "Balra" },
    { value: "center", label: "Középre" },
  ];

  return (
    <div className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          const isSelected = (value || "center") === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                isSelected
                  ? "border-amber-500 bg-amber-500 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {opt.value === "left" ? (
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="13" y2="12" />
                  <line x1="3" y1="18" x2="18" y2="18" />
                </svg>
              ) : (
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="7" y1="12" x2="17" y2="12" />
                  <line x1="5" y1="18" x2="19" y2="18" />
                </svg>
              )}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function EditorGroup({ title, description, children }) {
  return (
    <div className="border-t border-slate-200 pt-6 first:border-t-0 first:pt-0">
      <h4 className="font-semibold text-slate-950">{title}</h4>
      {description && <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}
