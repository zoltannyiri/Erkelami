import { PAGE_TEMPLATE_OPTIONS } from "../../config/pageTemplates";

function Lines({ short = false }) {
  return (
    <div className="flex-1 space-y-1">
      <div className="h-1.5 w-3/4 rounded-full bg-current opacity-45" />
      <div className={`h-1 rounded-full bg-current opacity-20 ${short ? "w-1/2" : "w-full"}`} />
      <div className="h-1 w-5/6 rounded-full bg-current opacity-20" />
    </div>
  );
}

function PreviewSection({ type }) {
  if (type === "IMAGE") {
    return <div className="h-8 rounded-sm bg-current opacity-20" />;
  }

  if (type === "HERO") {
    return (
      <div className="flex h-9 items-end rounded-sm bg-current p-1 opacity-25">
        <div className="h-1.5 w-1/2 rounded-full bg-white" />
      </div>
    );
  }

  if (type === "TEXT_IMAGE" || type === "TEXT_IMAGE_REVERSED") {
    const image = <div className="h-8 w-2/5 shrink-0 rounded-sm bg-current opacity-20" />;
    return (
      <div className="flex items-center gap-2">
        {type === "TEXT_IMAGE_REVERSED" && <Lines short />}
        {image}
        {type === "TEXT_IMAGE" && <Lines short />}
      </div>
    );
  }

  if (type === "CARD_GRID" || type === "GALLERY") {
    return (
      <div className="grid grid-cols-3 gap-1.5">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-7 rounded-sm bg-current opacity-20" />
        ))}
      </div>
    );
  }

  if (type === "CTA") {
    return (
      <div className="flex items-center justify-between rounded-sm bg-current/10 p-2">
        <div className="h-1.5 w-1/2 rounded-full bg-current opacity-35" />
        <div className="h-3 w-1/4 rounded-sm bg-current opacity-30" />
      </div>
    );
  }

  return <Lines />;
}

function TemplatePreview({ template }) {
  if (template.previewSections.length === 0) {
    return (
      <div className="flex h-28 items-center justify-center rounded-sm border border-dashed border-current/30 text-xs opacity-60">
        Üres vászon
      </div>
    );
  }

  return (
    <div className="flex h-28 flex-col justify-center gap-2 rounded-sm border border-current/10 bg-white/75 p-3">
      {template.previewSections.map((type, index) => (
        <PreviewSection key={`${type}-${index}`} type={type} />
      ))}
    </div>
  );
}

export default function PageTemplateSelector({ value, onChange }) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-slate-700">Oldalsablon</legend>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        A sablon csak a kezdeti elrendezést hozza létre. Az oldal tartalma később szabadon módosítható.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PAGE_TEMPLATE_OPTIONS.map((template) => {
          const selected = value === template.key;

          return (
            <label
              key={template.key}
              className={`cursor-pointer border p-4 transition ${
                selected
                  ? "border-slate-950 bg-slate-100 text-slate-950 ring-1 ring-slate-950"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
              }`}
            >
              <input
                type="radio"
                name="templateKey"
                value={template.key}
                checked={selected}
                onChange={(event) => onChange(event.target.value)}
                className="sr-only"
              />

              <TemplatePreview template={template} />

              <span className="mt-4 block font-semibold">{template.name}</span>
              <span className="mt-1 block text-sm leading-5 opacity-75">
                {template.description}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
