import { EditorGroup, SelectField, TextAreaField, TextField } from "../FormControls";
import ImageUploadField from "../../ImageUploadField";

export default function HeroEditor({ content, updateField }) {
  return (
    <EditorGroup title="Kiemelt nyitóblokk tartalma és megjelenése">
      <TextField label="Cím" value={content.heading} onChange={(value) => updateField("heading", value)} />
      <TextAreaField label="Alcím" value={content.subheading} onChange={(value) => updateField("subheading", value)} />

      <ImageUploadField
        value={content.imageUrl || ""}
        onChange={(url) => updateField("imageUrl", url)}
        label="Háttérkép feltöltése"
      />

      <TextField label="Háttérkép URL" value={content.imageUrl} onChange={(value) => updateField("imageUrl", value)} placeholder="/uploads/images/... vagy https://..." />

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Kép sötétítése" value={content.overlay || "medium"} onChange={(value) => updateField("overlay", value)} options={[
          { value: "light", label: "Világos" },
          { value: "medium", label: "Közepes" },
          { value: "dark", label: "Sötét" },
        ]} />

        <SelectField label="Szöveg helye" value={content.textPosition || "left"} onChange={(value) => updateField("textPosition", value)} options={[
          { value: "left", label: "Balra" },
          { value: "center", label: "Középen" },
        ]} />

        <SelectField label="Magasság" value={content.height || "large"} onChange={(value) => updateField("height", value)} options={[
          { value: "medium", label: "Közepes" },
          { value: "large", label: "Nagy" },
          { value: "viewport", label: "Képernyőmagasság" },
        ]} />

        <SelectField label="Kép fókusza" value={content.imageStyle?.position || "center"} onChange={(value) => updateField("imageStyle", { ...(content.imageStyle || {}), position: value })} options={[
          { value: "left", label: "Bal" },
          { value: "center", label: "Közép" },
          { value: "right", label: "Jobb" },
        ]} />
      </div>

      <TextField label="Gomb felirata" value={content.buttonText} onChange={(value) => updateField("buttonText", value)} />
      <TextField label="Gomb linkje" value={content.linkUrl} onChange={(value) => updateField("linkUrl", value)} />
    </EditorGroup>
  );
}