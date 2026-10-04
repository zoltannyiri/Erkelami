import { IMAGE_STYLE_OPTIONS, resolveImageStyle } from "../../../config/pageSectionStyles";
import { EditorGroup, SelectField } from "./FormControls";

const labels = {
  aspectRatio: "Képarány",
  height: "Magasság",
  fit: "Kitöltés",
  position: "Fókusz",
  radius: "Lekerekítés",
  width: "Képszélesség",
};

export default function ImageStyleControls({ value, onChange, showWidth = true, defaults, fields }) {
  const imageStyle = resolveImageStyle(value, defaults);
  const keys = fields || (showWidth
    ? Object.keys(IMAGE_STYLE_OPTIONS)
    : Object.keys(IMAGE_STYLE_OPTIONS).filter((key) => key !== "width"));

  return (
    <EditorGroup title="Kép megjelenése">
      <div className="grid gap-4 sm:grid-cols-2">
        {keys.map((key) => (
          <SelectField
            key={key}
            label={labels[key]}
            value={imageStyle[key]}
            onChange={(next) => onChange({ ...(value || {}), ...imageStyle, [key]: next })}
            options={IMAGE_STYLE_OPTIONS[key]}
          />
        ))}
      </div>
      {(value?.widthPercent || value?.heightPx) && (
        <p className="text-xs text-slate-500">
          Egérrel beállított méret:
          {value?.widthPercent ? ` ${value.widthPercent}% szélesség` : ""}
          {value?.widthPercent && value?.heightPx ? "," : ""}
          {value?.heightPx ? ` ${value.heightPx} px magasság` : ""}.
        </p>
      )}
    </EditorGroup>
  );
}
