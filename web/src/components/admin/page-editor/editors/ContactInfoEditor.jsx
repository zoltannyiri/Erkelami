import { EditorGroup, TextField } from "../FormControls";

const actionClass = "rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30";

export default function ContactInfoEditor({ content, updateField }) {
  const phones = Array.isArray(content.phones) ? content.phones : [];
  const contacts = Array.isArray(content.contacts) ? content.contacts : [];
  const privacyOfficer = content.privacyOfficer || {};

  const updateListItem = (field, items, index, updates) => {
    const next = [...items];
    next[index] = typeof updates === "string" ? updates : { ...next[index], ...updates };
    updateField(field, next);
  };

  const moveListItem = (field, items, index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    updateField(field, next);
  };

  const updatePrivacyOfficer = (field, value) => {
    updateField("privacyOfficer", { ...privacyOfficer, [field]: value });
  };

  return (
    <>
      <EditorGroup title="Intézmény adatai">
        <TextField label="Intézmény neve" value={content.institutionName} onChange={(value) => updateField("institutionName", value)} />
        <TextField label="Cím" value={content.address} onChange={(value) => updateField("address", value)} />
        <TextField label="Koordináták" value={content.coordinates} onChange={(value) => updateField("coordinates", value)} placeholder="47.582289, 18.398334" />
        <TextField label="Általános e-mail" value={content.generalEmail} onChange={(value) => updateField("generalEmail", value)} />
        <TextField label="Honlap" value={content.website} onChange={(value) => updateField("website", value)} />
      </EditorGroup>

      <EditorGroup title="Telefonszámok">
        {phones.map((phone, index) => (
          <div key={index} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{index + 1}. telefonszám</span>
              <div className="flex gap-1">
                <button type="button" className={actionClass} disabled={index === 0} onClick={() => moveListItem("phones", phones, index, -1)}>↑</button>
                <button type="button" className={actionClass} disabled={index === phones.length - 1} onClick={() => moveListItem("phones", phones, index, 1)}>↓</button>
                <button type="button" className={`${actionClass} text-red-600`} onClick={() => updateField("phones", phones.filter((_, itemIndex) => itemIndex !== index))}>Törlés</button>
              </div>
            </div>
            <TextField label="Telefonszám" value={phone} onChange={(value) => updateListItem("phones", phones, index, value)} />
          </div>
        ))}
        <button type="button" className="w-full rounded-xl border border-dashed border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-amber-400" onClick={() => updateField("phones", [...phones, ""])}>+ Telefonszám hozzáadása</button>
      </EditorGroup>

      <EditorGroup title="Kapcsolattartók" description="Az igazgató, helyettesek és az iskolatitkár itt módosíthatók.">
        {contacts.map((contact, index) => (
          <details key={index} className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 marker:content-none">
              <span className="min-w-0 truncate text-sm font-semibold text-slate-950">{contact.position || "Kapcsolattartó"}</span>
              <span className="shrink-0 text-xs font-semibold text-slate-400 transition-transform group-open:rotate-180">⌄</span>
            </summary>
            <div className="space-y-4 border-t border-slate-200 p-4">
              <div className="flex justify-end gap-1.5">
                <button type="button" className={actionClass} disabled={index === 0} onClick={() => moveListItem("contacts", contacts, index, -1)}>↑</button>
                <button type="button" className={actionClass} disabled={index === contacts.length - 1} onClick={() => moveListItem("contacts", contacts, index, 1)}>↓</button>
                <button type="button" className={`${actionClass} text-red-600`} onClick={() => updateField("contacts", contacts.filter((_, itemIndex) => itemIndex !== index))}>Törlés</button>
              </div>
              <TextField label="Beosztás" value={contact.position} onChange={(value) => updateListItem("contacts", contacts, index, { position: value })} />
              <TextField label="Név" value={contact.name} onChange={(value) => updateListItem("contacts", contacts, index, { name: value })} />
              <TextField label="E-mail (opcionális)" value={contact.email} onChange={(value) => updateListItem("contacts", contacts, index, { email: value })} />
            </div>
          </details>
        ))}
        <button type="button" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-amber-400" onClick={() => updateField("contacts", [...contacts, { position: "", name: "", email: "" }])}>+ Kapcsolattartó hozzáadása</button>
      </EditorGroup>

      <EditorGroup title="Üzenetküldő űrlap" description="Az űrlap egyelőre csak felület, adatot nem küld és nincs backendhez kötve.">
        <TextField label="Űrlap címe" value={content.formTitle || "Írjon nekünk"} onChange={(value) => updateField("formTitle", value)} />
        <TextField label="Rövid leírás" value={content.formIntro || "Kérdését vagy üzenetét az alábbi mezőkben készítheti elő."} onChange={(value) => updateField("formIntro", value)} />
      </EditorGroup>

      <EditorGroup title="Adatvédelmi tisztviselő">
        <TextField label="Név" value={privacyOfficer.name} onChange={(value) => updatePrivacyOfficer("name", value)} />
        <TextField label="Szervezet" value={privacyOfficer.organization} onChange={(value) => updatePrivacyOfficer("organization", value)} />
        <TextField label="Cím" value={privacyOfficer.address} onChange={(value) => updatePrivacyOfficer("address", value)} />
        <TextField label="E-mail" value={privacyOfficer.email} onChange={(value) => updatePrivacyOfficer("email", value)} />
      </EditorGroup>
    </>
  );
}
