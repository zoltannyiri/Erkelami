import { EditorGroup, SelectField, TextAreaField, TextField } from "../FormControls";
import ImageStyleControls from "../ImageStyleControls";
import ImageUploadField from "../../ImageUploadField";

export default function CardGridEditor({ content, updateField }) {
  const cards = Array.isArray(content.cards) ? content.cards : [];
  const updateCard = (index, key, value) => {
    const nextCards = [...cards];
    nextCards[index] = { ...nextCards[index], [key]: value };
    updateField("cards", nextCards);
  };

  return (
    <>
      <EditorGroup title="Kártyarács">
        <TextField label="Cím" value={content.heading} onChange={(value) => updateField("heading", value)} />
        <div className="grid gap-4 sm:grid-cols-3">
          <SelectField label="Oszlopok" value={String(content.columns || "3")} onChange={(value) => updateField("columns", value)} options={["2", "3", "4"]} />
          <SelectField label="Kártyastílus" value={content.cardStyle || "bordered"} onChange={(value) => updateField("cardStyle", value)} options={[
            { value: "simple", label: "Egyszerű" },
            { value: "bordered", label: "Keretezett" },
            { value: "elevated", label: "Emelt" },
            { value: "imageOverlay", label: "Képre helyezett szöveg" },
          ]} />
          <SelectField label="Képarány" value={content.imageRatio || "4:3"} onChange={(value) => updateField("imageRatio", value)} options={["16:9", "4:3", "1:1"]} />
        </div>
      </EditorGroup>

      <ImageStyleControls
        value={content.imageStyle}
        onChange={(value) => updateField("imageStyle", value)}
        fields={["fit", "position", "radius"]}
      />

      <EditorGroup title="Kártyák">
        {cards.map((card, index) => (
          <div key={index} className="border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold">{index + 1}. kártya</span>
              <button type="button" onClick={() => updateField("cards", cards.filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-medium text-red-600">Törlés</button>
            </div>
            <div className="space-y-4">
              <TextField label="Cím" value={card.title} onChange={(value) => updateCard(index, "title", value)} />
              <TextAreaField label="Leírás" value={card.description} onChange={(value) => updateCard(index, "description", value)} />
                <ImageUploadField
                  value={card.imageUrl || ""}
                  onChange={(url) => updateCard(index, "imageUrl", url)}
                  label="Kártyakép feltöltése"
                />
              <TextField label="Kép URL" value={card.imageUrl} onChange={(value) => updateCard(index, "imageUrl", value)} placeholder="/images/pages/pelda.jpg" />
              <TextField label="Link URL" value={card.linkUrl} onChange={(value) => updateCard(index, "linkUrl", value)} />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => updateField("cards", [...cards, { title: "", description: "", imageUrl: "", linkUrl: "" }])} className="border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700">+ Kártya hozzáadása</button>
      </EditorGroup>
    </>
  );
}
