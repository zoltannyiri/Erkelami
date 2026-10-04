import ImageStyleControls from "../ImageStyleControls";
import { EditorGroup, TextField } from "../FormControls";
import RichTextEditor from "../LazyRichTextEditor";

export default function ImageEditor({ content, updateField }) {
  const adjacentItems = Array.isArray(content.adjacentItems) ? content.adjacentItems : [];
  const updateItem = (index, key, value) => {
    const nextItems = [...adjacentItems];
    nextItems[index] = { ...nextItems[index], [key]: value };
    updateField("adjacentItems", nextItems);
  };
  const addItem = (type) => {
    if (adjacentItems.length >= 3) return;
    updateField(
      "adjacentItems",
      [...adjacentItems, type === "IMAGE"
        ? { type: "IMAGE", imageUrl: "", alt: "" }
        : { type: "TEXT", heading: "", text: "" }]
    );
  };

  return (
    <>
      <EditorGroup title="Kép">
        <TextField label="Kép URL" value={content.imageUrl} onChange={(value) => updateField("imageUrl", value)} placeholder="/images/pages/pelda.jpg" />
        <TextField label="Alt szöveg" value={content.alt} onChange={(value) => updateField("alt", value)} />
        {content.imageStyle?.widthPercent && <p className="text-xs text-slate-500">Egyedi szélesség: {content.imageStyle.widthPercent}%</p>}
        {content.imageStyle?.heightPx && <p className="text-xs text-slate-500">Egyedi magasság: {content.imageStyle.heightPx} px</p>}
        <p className="text-xs leading-5 text-slate-500">A Visual Editorban a kép jobb és alsó szélét húzva közvetlenül módosíthatod a méretet.</p>
      </EditorGroup>

      <ImageStyleControls value={content.imageStyle} onChange={(value) => updateField("imageStyle", value)} />

      <EditorGroup title="Tartalom a kép mellett" description="Legfeljebb három további kép vagy szöveges elem helyezhető a fő kép mellé.">
        {adjacentItems.map((item, index) => (
          <div key={index} className="border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold">{index + 1}. {item.type === "IMAGE" ? "kép" : "szöveg"}</span>
              <button type="button" onClick={() => updateField("adjacentItems", adjacentItems.filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-medium text-red-600">Törlés</button>
            </div>
            {item.type === "IMAGE" ? (
              <div className="space-y-4">
                <TextField label="Kép URL" value={item.imageUrl} onChange={(value) => updateItem(index, "imageUrl", value)} placeholder="/images/pages/pelda.jpg" />
                <TextField label="Alt szöveg" value={item.alt} onChange={(value) => updateItem(index, "alt", value)} />
              </div>
            ) : (
              <div className="space-y-4">
                <TextField label="Cím" value={item.heading} onChange={(value) => updateItem(index, "heading", value)} />
                <div>
                  <span className="mb-2 block text-sm font-medium text-slate-700">Formázott szöveg</span>
                  <RichTextEditor value={item.richText} fallbackText={item.text} onChange={(value) => updateItem(index, "richText", value)} />
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={adjacentItems.length >= 3} onClick={() => addItem("IMAGE")} className="border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-40">+ Kép mellé</button>
          <button type="button" disabled={adjacentItems.length >= 3} onClick={() => addItem("TEXT")} className="border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-40">+ Szöveg mellé</button>
        </div>
      </EditorGroup>
    </>
  );
}
