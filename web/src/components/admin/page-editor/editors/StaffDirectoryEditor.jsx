import { EditorGroup, SelectField, TextAreaField, TextField } from "../FormControls";

const actionClass = "rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30";

export default function StaffDirectoryEditor({ content, updateField }) {
  const groups = Array.isArray(content.groups) ? content.groups : [];

  const updateGroup = (groupIndex, updates) => {
    const next = [...groups];
    next[groupIndex] = { ...next[groupIndex], ...updates };
    updateField("groups", next);
  };

  const moveGroup = (groupIndex, direction) => {
    const target = groupIndex + direction;
    if (target < 0 || target >= groups.length) return;
    const next = [...groups];
    [next[groupIndex], next[target]] = [next[target], next[groupIndex]];
    updateField("groups", next);
  };

  const updateMember = (groupIndex, memberIndex, updates) => {
    const members = [...(groups[groupIndex].members || [])];
    members[memberIndex] = { ...members[memberIndex], ...updates };
    updateGroup(groupIndex, { members });
  };

  const moveMember = (groupIndex, memberIndex, direction) => {
    const members = [...(groups[groupIndex].members || [])];
    const target = memberIndex + direction;
    if (target < 0 || target >= members.length) return;
    [members[memberIndex], members[target]] = [members[target], members[memberIndex]];
    updateGroup(groupIndex, { members });
  };

  return (
    <>
      <EditorGroup title="Névsor fejléc">
        <TextField label="Tanév" value={content.academicYear} onChange={(value) => updateField("academicYear", value)} placeholder="2026/2027" />
        <TextAreaField label="Rövid bevezető (opcionális)" value={content.intro} onChange={(value) => updateField("intro", value)} rows={3} />
      </EditorGroup>

      <EditorGroup title="Csoportok és munkatársak" description="A sorrend a publikus oldalon is az itt megadott sorrend lesz.">
        {groups.map((group, groupIndex) => {
          const members = Array.isArray(group.members) ? group.members : [];
          return (
            <details key={groupIndex} className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 marker:content-none">
                <span className="min-w-0 truncate text-sm font-semibold text-slate-950">{groupIndex + 1}. {group.title || "Névtelen csoport"}</span>
                <span className="flex shrink-0 items-center gap-2 text-xs font-semibold text-slate-400">
                  {members.length} fő
                  <span className="transition-transform group-open:rotate-180">⌄</span>
                </span>
              </summary>

              <div className="border-t border-slate-200 p-4">
                <div className="mb-4 flex flex-wrap justify-end gap-1.5">
                  <span className="mr-auto self-center text-xs font-semibold uppercase tracking-wider text-slate-400">Csoport műveletei</span>
                <div className="flex flex-wrap gap-1.5">
                  <button type="button" className={actionClass} disabled={groupIndex === 0} onClick={() => moveGroup(groupIndex, -1)}>↑</button>
                  <button type="button" className={actionClass} disabled={groupIndex === groups.length - 1} onClick={() => moveGroup(groupIndex, 1)}>↓</button>
                  <button type="button" className={`${actionClass} text-red-600`} onClick={() => updateField("groups", groups.filter((_, index) => index !== groupIndex))}>Törlés</button>
                </div>
                </div>

                <div className="space-y-4">
                  <TextField label="Csoport neve" value={group.title} onChange={(value) => updateGroup(groupIndex, { title: value })} />
                  <SelectField
                    label="Megjelenés"
                    value={group.featured ? "featured" : "standard"}
                    onChange={(value) => updateGroup(groupIndex, { featured: value === "featured" })}
                    options={[
                      { value: "standard", label: "Egyszerű névsor" },
                      { value: "featured", label: "Kiemelt kártyák" },
                    ]}
                  />

                  <div className="space-y-3 border-t border-slate-200 pt-4">
                    {members.map((member, memberIndex) => (
                      <div key={memberIndex} className="rounded-xl border border-slate-200 bg-white p-3.5">
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{memberIndex + 1}. munkatárs</span>
                          <div className="flex gap-1">
                            <button type="button" className={actionClass} disabled={memberIndex === 0} onClick={() => moveMember(groupIndex, memberIndex, -1)}>↑</button>
                            <button type="button" className={actionClass} disabled={memberIndex === members.length - 1} onClick={() => moveMember(groupIndex, memberIndex, 1)}>↓</button>
                            <button type="button" className={`${actionClass} text-red-600`} onClick={() => updateGroup(groupIndex, { members: members.filter((_, index) => index !== memberIndex) })}>Törlés</button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <TextField label="Név" value={member.name} onChange={(value) => updateMember(groupIndex, memberIndex, { name: value })} />
                          <TextField label="Titulus / szak" value={member.role} onChange={(value) => updateMember(groupIndex, memberIndex, { role: value })} />
                        </div>
                      </div>
                    ))}
                    <button type="button" className="w-full rounded-xl border border-dashed border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-amber-400 hover:text-slate-950" onClick={() => updateGroup(groupIndex, { members: [...members, { name: "", role: "" }] })}>
                      + Munkatárs hozzáadása
                    </button>
                  </div>
                </div>
              </div>
            </details>
          );
        })}
        <button type="button" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-amber-400" onClick={() => updateField("groups", [...groups, { title: "Új csoport", featured: false, members: [{ name: "", role: "" }] }])}>
          + Új csoport hozzáadása
        </button>
      </EditorGroup>
    </>
  );
}
