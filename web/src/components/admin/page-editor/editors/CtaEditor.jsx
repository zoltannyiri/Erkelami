import { EditorGroup, SelectField, TextField } from "../FormControls";
import RichTextEditor from "../LazyRichTextEditor";

export default function CtaEditor({ content, updateField }) {
  return (
    <EditorGroup title="Felhívás tartalma és megjelenése">
      <TextField label="Cím" value={content.heading} onChange={(value) => updateField("heading", value)} />
      <div>
        <span className="mb-2 block text-sm font-medium text-slate-700">Formázott szöveg</span>
        <RichTextEditor value={content.richText} fallbackText={content.text} onChange={(value) => updateField("richText", value)} />
      </div>
      <TextField label="Gomb felirata" value={content.buttonText} onChange={(value) => updateField("buttonText", value)} />
      <TextField label="Link URL" value={content.linkUrl} onChange={(value) => updateField("linkUrl", value)} />
      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField label="Változat" value={content.variant || "dark"} onChange={(value) => updateField("variant", value)} options={[
          { value: "light", label: "Világos" },
          { value: "dark", label: "Sötét" },
          { value: "accent", label: "Kiemelt" },
        ]} />
        <SelectField label="Igazítás" value={content.alignment || "left"} onChange={(value) => updateField("alignment", value)} options={[
          { value: "left", label: "Balra" },
          { value: "center", label: "Középre" },
        ]} />
        <SelectField label="Gombstílus" value={content.buttonStyle || "primary"} onChange={(value) => updateField("buttonStyle", value)} options={[
          { value: "primary", label: "Elsődleges" },
          { value: "secondary", label: "Másodlagos" },
        ]} />
      </div>
    </EditorGroup>
  );
}
