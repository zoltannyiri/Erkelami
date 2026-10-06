import { EditorGroup, SelectField, TextAreaField, TextField } from "../FormControls";
import FileUploadField from "../../FileUploadField";

const FILE_TYPE_OPTIONS = [
  { value: "PDF", label: "PDF" },
  { value: "DOC", label: "DOC" },
  { value: "DOCX", label: "DOCX" },
  { value: "XLS", label: "XLS" },
  { value: "XLSX", label: "XLSX" },
  { value: "ZIP", label: "ZIP" },
  { value: "OTHER", label: "Egyéb" },
];

export default function DownloadsEditor({ content, updateField }) {
  const files = Array.isArray(content.files) ? content.files : [];

  const updateFile = (index, key, value) => {
    const nextFiles = [...files];
    nextFiles[index] = { ...nextFiles[index], [key]: value };
    updateField("files", nextFiles);
  };

  const updateFileValues = (index, values) => {
    const nextFiles = [...files];
    nextFiles[index] = { ...nextFiles[index], ...values };
    updateField("files", nextFiles);
  };

  const addFile = () => {
    updateField("files", [
      ...files,
      { title: "", description: "", fileUrl: "", fileType: "PDF" },
    ]);
  };

  const removeFile = (index) => {
    updateField("files", files.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <>
      <EditorGroup title="Dokumentumok blokk">
        <TextField
          label="Cím"
          value={content.heading}
          onChange={(value) => updateField("heading", value)}
          placeholder="pl. Dokumentumok / Letöltések"
        />
        <TextAreaField
          label="Leírás"
          value={content.description}
          onChange={(value) => updateField("description", value)}
          rows={3}
          placeholder="Rövid tájékoztató a letölthető dokumentumokról"
        />
      </EditorGroup>

      <EditorGroup
        title="Dokumentumok"
        description="Itt adhatsz hozzá letölthető fájlokat, PDF-eket, űrlapokat."
      >
        {files.map((file, index) => (
          <div key={index} className="border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold">
                {index + 1}. dokumentum
              </span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-xs font-medium text-red-600 hover:text-red-800"
              >
                Törlés
              </button>
            </div>

            <div className="space-y-4">
              <TextField
                label="Dokumentum címe"
                value={file.title}
                onChange={(value) => updateFile(index, "title", value)}
                placeholder="pl. Házirend 2026/2027"
              />
              <TextAreaField
                label="Leírás"
                value={file.description}
                onChange={(value) => updateFile(index, "description", value)}
                rows={2}
                placeholder="Rövid leírás a dokumentum tartalmáról"
              />
              <FileUploadField
                category="document"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                label="Fájl feltöltése"
                onUploaded={(uploadedField) => {
                  updateFileValues(index, {
                    fileUrl: uploadedField.url,
                    fileType: uploadedField.fileType || "OTHER",
                  });
                }}
              />
              {file.fileUrl?.startsWith("/uploads/") && (
                <div className="flex items-center justify-between bg-green-50 px-4 py-3 text-sm">
                  <span className="text-green-700">
                    Fájl feltöltve
                  </span>

                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-green-700 underline"
                  >
                    Megnyitás
                  </a>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <TextField
                    label="Fájl URL"
                    value={file.fileUrl}
                    onChange={(value) => updateFile(index, "fileUrl", value)}
                    placeholder="/documents/hazirend.pdf vagy https://..."
                  />
                </div>
                <div>
                  <SelectField
                    label="Fájltípus"
                    value={file.fileType || "PDF"}
                    onChange={(value) => updateFile(index, "fileType", value)}
                    options={FILE_TYPE_OPTIONS}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addFile}
          className="cursor-pointer border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          + Dokumentum hozzáadása
        </button>
      </EditorGroup>
    </>
  );
}
