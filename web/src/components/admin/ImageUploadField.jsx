import FileUploadField from "./FileUploadField";

export default function ImageUploadField({ value, onChange, label = "Kép feltöltése" }) {
  return (
    <div className="space-y-3">
      <FileUploadField
        category="image"
        accept=".jpg,.jpeg,.png,.webp"
        label={label}
        onUploaded={(uploadedFile) => {
          onChange(uploadedFile.url);
        }}
      />

      {value && (
        <div className="overflow-hidden border border-slate-200 bg-slate-50">
          <img
            src={value}
            alt=""
            className="max-h-56 w-full object-contain"
          />
        </div>
      )}
    </div>
  );
}