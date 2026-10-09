import { EditorGroup, SelectField, TextAreaField, TextField } from "../FormControls";
import FileUploadField from "../../FileUploadField";

const HEIGHT_OPTIONS = [
  { value: "medium", label: "Normál (600px)" },
  { value: "large", label: "Nagy (800px)" },
  { value: "extraLarge", label: "Extra nagy (1000px)" },
];

export default function PdfViewerEditor({ content, updateField }) {
  const height = content.height || "large";

  return (
    <>
      <EditorGroup
        title="PDF megjelenítő fejléc"
        description="A PDF dokumentum fölött megjelenő cím és opcionális leírás."
      >
        <TextField
          label="Cím"
          value={content.heading}
          onChange={(value) => updateField("heading", value)}
          placeholder="pl. Versenykiírás 2026/2027"
        />

        <TextAreaField
          label="Leírás (opcionális)"
          value={content.description}
          onChange={(value) => updateField("description", value)}
          rows={3}
          placeholder="Rövid bevezető a dokumentumhoz..."
        />
      </EditorGroup>

      <EditorGroup
        title="PDF dokumentum"
        description="Tölts fel egy PDF fájlt a tárhelyre, vagy adj meg egy közvetlen PDF linket."
      >
        <FileUploadField
          category="document"
          accept=".pdf"
          label="PDF fájl feltöltése"
          onUploaded={(uploaded) => {
            updateField("pdfUrl", uploaded.url);
          }}
        />

        {content.pdfUrl && (
          <div className="flex items-center justify-between rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <div className="flex items-center gap-2">
              <span className="font-semibold">PDF beágyazva:</span>
              <span className="max-w-xs truncate text-xs text-emerald-700 sm:max-w-sm">
                {content.pdfUrl}
              </span>
            </div>
            <a
              href={content.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline hover:text-emerald-950"
            >
              Megnyitás ↗
            </a>
          </div>
        )}

        <TextField
          label="PDF URL"
          value={content.pdfUrl}
          onChange={(value) => updateField("pdfUrl", value)}
          placeholder="/uploads/documents/... vagy https://..."
        />

        <SelectField
          label="Megjelenítő magassága"
          value={height}
          onChange={(value) => updateField("height", value)}
          options={HEIGHT_OPTIONS}
        />
      </EditorGroup>
    </>
  );
}
