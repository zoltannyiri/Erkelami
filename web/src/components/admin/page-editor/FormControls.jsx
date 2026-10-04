export const inputClassName =
  "w-full border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-950";

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

export function EditorGroup({ title, description, children }) {
  return (
    <div className="border-t border-slate-200 pt-6 first:border-t-0 first:pt-0">
      <h4 className="font-semibold text-slate-950">{title}</h4>
      {description && <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}
