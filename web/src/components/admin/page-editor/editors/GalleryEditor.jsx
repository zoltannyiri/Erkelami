import { EditorGroup, SelectField, TextField } from "../FormControls";
import ImageStyleControls from "../ImageStyleControls";

export default function GalleryEditor({ content, updateField }) {
  const images = Array.isArray(content.images) ? content.images : [];
  const updateImage = (index, key, value) => {
    const nextImages = [...images];
    nextImages[index] = { ...nextImages[index], [key]: value };
    updateField("images", nextImages);
  };

  return (
    <>
      <EditorGroup title="Galéria">
        <TextField label="Cím" value={content.heading} onChange={(value) => updateField("heading", value)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Elrendezés" value={content.layout || "grid"} onChange={(value) => updateField("layout", value)} options={[
            { value: "grid", label: "Rács" },
            { value: "masonry", label: "Mozaikos" },
            { value: "featured", label: "Kiemelt első kép" },
          ]} />
          <SelectField label="Oszlopok" value={String(content.columns || "3")} onChange={(value) => updateField("columns", value)} options={["2", "3", "4"]} />
          <SelectField label="Képarány" value={content.imageRatio || "4:3"} onChange={(value) => updateField("imageRatio", value)} options={[
            { value: "auto", label: "Automatikus" },
            { value: "16:9", label: "16:9" },
            { value: "4:3", label: "4:3" },
            { value: "1:1", label: "1:1" },
          ]} />
          <SelectField label="Hézag" value={content.gap || "normal"} onChange={(value) => updateField("gap", value)} options={[
            { value: "small", label: "Kicsi" },
            { value: "normal", label: "Normál" },
            { value: "large", label: "Nagy" },
          ]} />
        </div>
      </EditorGroup>

      <ImageStyleControls
        value={content.imageStyle}
        onChange={(value) => updateField("imageStyle", value)}
        fields={["fit", "position", "radius"]}
      />

      <EditorGroup title="Képek">
        {images.map((image, index) => (
          <div key={index} className="border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold">{index + 1}. kép</span>
              <button type="button" onClick={() => updateField("images", images.filter((_, itemIndex) => itemIndex !== index))} className="text-xs font-medium text-red-600">Törlés</button>
            </div>
            <div className="space-y-4">
              <TextField label="Kép URL" value={image.imageUrl} onChange={(value) => updateImage(index, "imageUrl", value)} placeholder="/images/pages/pelda.jpg" />
              <TextField label="Alt szöveg" value={image.alt} onChange={(value) => updateImage(index, "alt", value)} />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => updateField("images", [...images, { imageUrl: "", alt: "" }])} className="border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700">+ Kép hozzáadása</button>
      </EditorGroup>
    </>
  );
}
