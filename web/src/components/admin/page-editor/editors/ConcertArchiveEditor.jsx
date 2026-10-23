import { normalizeConcertArchiveContent } from "../../../../config/concertArchive";
import ImageUploadField from "../../ImageUploadField";
import { EditorGroup, TextAreaField, TextField } from "../FormControls";

const actionClass = "rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30";
const emptyEvent = () => ({ date: "", title: "", location: "", description: "", imageUrl: "", linkUrl: "", buttonText: "Felvétel megtekintése", visible: true });

export default function ConcertArchiveEditor({ content, updateField }) {
  const normalized = normalizeConcertArchiveContent(content);
  const groups = normalized.groups;
  const updateGroups = (nextGroups) => updateField("groups", nextGroups);

  const updateGroup = (groupIndex, updates) => {
    const next = [...groups];
    next[groupIndex] = { ...next[groupIndex], ...updates };
    updateGroups(next);
  };

  const moveGroup = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= groups.length) return;
    const next = [...groups];
    [next[index], next[target]] = [next[target], next[index]];
    updateGroups(next);
  };

  const updateEvent = (groupIndex, eventIndex, updates) => {
    const events = [...groups[groupIndex].events];
    events[eventIndex] = { ...events[eventIndex], ...updates };
    updateGroup(groupIndex, { events });
  };

  const moveEvent = (groupIndex, eventIndex, direction) => {
    const events = [...groups[groupIndex].events];
    const target = eventIndex + direction;
    if (target < 0 || target >= events.length) return;
    [events[eventIndex], events[target]] = [events[target], events[eventIndex]];
    updateGroup(groupIndex, { events });
  };

  return (
    <>
      <EditorGroup title="Oldal bevezetője">
        <TextField label="Cím" value={normalized.heading} onChange={(value) => updateField("heading", value)} />
        <TextAreaField label="Rövid bevezető" value={normalized.intro} onChange={(value) => updateField("intro", value)} rows={3} />
      </EditorGroup>

      <EditorGroup title="Tanévek és koncertek" description="A tanévek és a koncertek sorrendje külön is módosítható. A kép, helyszín és leírás opcionális.">
        {!Array.isArray(content.groups) && groups.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
            A régi szöveges lista automatikusan szerkeszthető koncertlistává alakult. Az első módosítás mentésekor az új struktúra kerül eltárolásra.
          </div>
        )}

        {groups.map((group, groupIndex) => {
          const events = Array.isArray(group.events) ? group.events : [];
          return (
            <details key={`${group.label}-${groupIndex}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70" open={groupIndex === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 marker:content-none">
                <span className="min-w-0 truncate text-sm font-semibold text-slate-950">{group.label || "Névtelen tanév"} · {events.length} koncert</span>
                <span className="shrink-0 text-xs font-semibold text-slate-400 transition-transform group-open:rotate-180">⌄</span>
              </summary>
              <div className="space-y-4 border-t border-slate-200 p-4">
                <div className="flex justify-end gap-1.5">
                  <button type="button" className={actionClass} disabled={groupIndex === 0} onClick={() => moveGroup(groupIndex, -1)}>↑</button>
                  <button type="button" className={actionClass} disabled={groupIndex === groups.length - 1} onClick={() => moveGroup(groupIndex, 1)}>↓</button>
                  <button type="button" className={`${actionClass} text-red-600`} onClick={() => updateGroups(groups.filter((_, index) => index !== groupIndex))}>Tanév törlése</button>
                </div>
                <TextField label="Tanév" value={group.label} onChange={(value) => updateGroup(groupIndex, { label: value })} placeholder="2026/2027" />

                <div className="space-y-3">
                  {events.map((event, eventIndex) => (
                    <details key={`${event.title}-${eventIndex}`} className="group/event overflow-hidden rounded-xl border border-slate-200 bg-white">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3.5 py-3 marker:content-none">
                        <span className="min-w-0 truncate text-xs font-semibold text-slate-800">{event.date && `${event.date} · `}{event.title || "Névtelen koncert"}</span>
                        <span className="shrink-0 text-xs text-slate-400 transition-transform group-open/event:rotate-180">⌄</span>
                      </summary>
                      <div className="space-y-4 border-t border-slate-100 p-3.5">
                        <div className="flex justify-end gap-1.5">
                          <button type="button" className={actionClass} disabled={eventIndex === 0} onClick={() => moveEvent(groupIndex, eventIndex, -1)}>↑</button>
                          <button type="button" className={actionClass} disabled={eventIndex === events.length - 1} onClick={() => moveEvent(groupIndex, eventIndex, 1)}>↓</button>
                          <button type="button" className={`${actionClass} text-red-600`} onClick={() => updateGroup(groupIndex, { events: events.filter((_, index) => index !== eventIndex) })}>Törlés</button>
                        </div>
                        <TextField label="Dátum" value={event.date} onChange={(value) => updateEvent(groupIndex, eventIndex, { date: value })} placeholder="2026.11.20" />
                        <TextField label="Koncert címe" value={event.title} onChange={(value) => updateEvent(groupIndex, eventIndex, { title: value })} />
                        <TextField label="Helyszín (opcionális)" value={event.location} onChange={(value) => updateEvent(groupIndex, eventIndex, { location: value })} />
                        <TextAreaField label="Rövid leírás (opcionális)" value={event.description} onChange={(value) => updateEvent(groupIndex, eventIndex, { description: value })} rows={2} />
                        <ImageUploadField value={event.imageUrl || ""} onChange={(value) => updateEvent(groupIndex, eventIndex, { imageUrl: value })} label="Koncertkép feltöltése (opcionális)" />
                        <TextField label="Kép URL" value={event.imageUrl} onChange={(value) => updateEvent(groupIndex, eventIndex, { imageUrl: value })} />
                        <TextField label="Videó vagy részletek linkje" value={event.linkUrl} onChange={(value) => updateEvent(groupIndex, eventIndex, { linkUrl: value })} />
                        <TextField label="Link felirata" value={event.buttonText} onChange={(value) => updateEvent(groupIndex, eventIndex, { buttonText: value })} />
                        <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-700">
                          <input type="checkbox" checked={event.visible !== false} onChange={(changeEvent) => updateEvent(groupIndex, eventIndex, { visible: changeEvent.target.checked })} />
                          A koncert megjelenik a publikus oldalon
                        </label>
                      </div>
                    </details>
                  ))}
                </div>

                <button type="button" className="w-full rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-amber-400" onClick={() => updateGroup(groupIndex, { events: [...events, emptyEvent()] })}>+ Új koncert ebbe a tanévbe</button>
              </div>
            </details>
          );
        })}

        <button type="button" className="w-full rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-amber-400 hover:text-slate-950" onClick={() => updateGroups([...groups, { label: "", events: [emptyEvent()] }])}>+ Új tanév hozzáadása</button>
      </EditorGroup>
    </>
  );
}

