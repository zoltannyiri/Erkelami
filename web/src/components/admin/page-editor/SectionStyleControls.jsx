import { resolveSectionStyle, SECTION_STYLE_DEFAULTS_BY_TYPE, SECTION_STYLE_OPTIONS } from "../../../config/pageSectionStyles";
import { EditorGroup, SelectField } from "./FormControls";

export default function SectionStyleControls({ type, value, onChange }) {
  const style = resolveSectionStyle(value, SECTION_STYLE_DEFAULTS_BY_TYPE[type]);
  const update = (key, nextValue) => onChange({ ...style, [key]: nextValue });

  return (
    <EditorGroup title="Megjelenés" description="Biztonságos, előre definiált megjelenési beállítások.">
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Háttér" value={style.background} onChange={(next) => update("background", next)} options={SECTION_STYLE_OPTIONS.background} />
        <SelectField label="Szélesség" value={style.width} onChange={(next) => update("width", next)} options={SECTION_STYLE_OPTIONS.width} />
        <SelectField label="Térköz" value={style.spacing} onChange={(next) => update("spacing", next)} options={SECTION_STYLE_OPTIONS.spacing} />
        <SelectField label="Igazítás" value={style.textAlign} onChange={(next) => update("textAlign", next)} options={SECTION_STYLE_OPTIONS.textAlign} />
      </div>
    </EditorGroup>
  );
}
