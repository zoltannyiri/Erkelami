import ImageStyleControls from "../ImageStyleControls";
import { EditorGroup, SelectField, TextField } from "../FormControls";
import RichTextEditor from "../LazyRichTextEditor";
import ImageUploadField from "../../ImageUploadField";

export default function TextImageEditor({ content, updateField }) {
  const legacyLayout = content.imagePosition === "left" ? "imageLeft" : "imageRight";
  const layout = content.layout || legacyLayout;

  return (
    <>
      <EditorGroup title="Tartalom">
        <TextField label="Cím" value={content.heading} onChange={(value) => updateField("heading", value)} />
        <div>
          <span className="mb-2 block text-sm font-medium text-slate-700">Formázott szöveg</span>
          <RichTextEditor value={content.richText} fallbackText={content.text} onChange={(value) => updateField("richText", value)} />
        </div>
        <ImageUploadField
          value={content.imageUrl || ""}
          onChange={(url) =>
            updateField("imageUrl", url)
          }
          label="Kép feltöltése"
        />
        <TextField label="Kép URL" value={content.imageUrl} onChange={(value) => updateField("imageUrl", value)} placeholder="/images/pages/pelda.jpg" />
        <TextField label="Kép alt szövege" value={content.imageAlt} onChange={(value) => updateField("imageAlt", value)} />
      </EditorGroup>

      <EditorGroup title="Elrendezés">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Elrendezés" value={layout} onChange={(value) => updateField("layout", value)} options={[
            { value: "imageLeft", label: "Kép balra" },
            { value: "imageRight", label: "Kép jobbra" },
            { value: "imageTop", label: "Kép felül" },
            { value: "imageBackground", label: "Háttérkép" },
          ]} />
          <SelectField label="Kép aránya" value={String(content.imageWidth || "50")} onChange={(value) => updateField("imageWidth", value)} options={["40", "50", "60"]} />
          <SelectField label="Függőleges igazítás" value={content.verticalAlign || "center"} onChange={(value) => updateField("verticalAlign", value)} options={[
            { value: "top", label: "Felül" },
            { value: "center", label: "Középen" },
          ]} />
        </div>
      </EditorGroup>

      <ImageStyleControls value={content.imageStyle} onChange={(value) => updateField("imageStyle", value)} showWidth={false} defaults={{ aspectRatio: "4:3" }} />
    </>
  );
}
