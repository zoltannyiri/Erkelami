import { EditorGroup, TextField } from "../FormControls";
import RichTextEditor from "../LazyRichTextEditor";

export default function TextEditor({ content, updateField }) {
  return (
    <EditorGroup title="Tartalom">
      <TextField label="Blokk címe" value={content.heading} onChange={(value) => updateField("heading", value)} />
      <div>
        <span className="mb-2 block text-sm font-medium text-slate-700">Formázott szöveg</span>
        <RichTextEditor value={content.richText} fallbackText={content.text} onChange={(value) => updateField("richText", value)} />
      </div>
    </EditorGroup>
  );
}
