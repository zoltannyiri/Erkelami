import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import AdminPageHeader from "../../components/admin/AdminPageHeader";

const CATEGORIES = [
  { value: "CONCERT", label: "Koncert", color: "bg-violet-500" },
  { value: "COMPETITION", label: "Verseny", color: "bg-amber-500" },
  { value: "SCHOOL", label: "Iskolai esemény", color: "bg-sky-500" },
  { value: "HOLIDAY", label: "Szünet", color: "bg-emerald-500" },
  { value: "OTHER", label: "Egyéb", color: "bg-slate-500" },
];

const MONTHS = ["jan", "feb", "márc", "ápr", "máj", "jún", "júl", "aug", "szept", "okt", "nov", "dec"];
const pad = (value) => String(value).padStart(2, "0");

const localDateValue = (value) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const localTimeValue = (value) => {
  const date = new Date(value);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const getEmptyForm = () => {
  const now = new Date();
  const date = localDateValue(now);
  return {
    title: "",
    description: "",
    location: "",
    category: "CONCERT",
    startDate: date,
    startTime: "18:00",
    hasEnd: true,
    endDate: date,
    endTime: "19:00",
    allDay: false,
    published: true,
  };
};

const eventToForm = (event) => ({
  title: event.title || "",
  description: event.description || "",
  location: event.location || "",
  category: event.category || "OTHER",
  startDate: localDateValue(event.startAt),
  startTime: localTimeValue(event.startAt),
  hasEnd: Boolean(event.endAt),
  endDate: event.endAt ? localDateValue(event.endAt) : localDateValue(event.startAt),
  endTime: event.endAt ? localTimeValue(event.endAt) : "",
  allDay: Boolean(event.allDay),
  published: Boolean(event.published),
});

const formatDateLine = (event) => {
  const start = new Date(event.startAt);
  const end = event.endAt ? new Date(event.endAt) : null;
  const date = `${start.getFullYear()}. ${String(start.getMonth() + 1).padStart(2, "0")}. ${String(start.getDate()).padStart(2, "0")}.`;
  if (event.allDay) return `${date} · egész nap`;
  const startTime = localTimeValue(start);
  const endTime = end ? localTimeValue(end) : null;
  return `${date} · ${startTime}${endTime ? `–${endTime}` : ""}`;
};

function EventForm({ event, onClose, onSaved }) {
  const [form, setForm] = useState(() => event ? eventToForm(event) : getEmptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (change) => setForm((current) => ({ ...current, ...change }));

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!form.startDate || (!form.allDay && !form.startTime)) {
        throw new Error("Add meg az esemény kezdési időpontját.");
      }

      const startAt = new Date(`${form.startDate}T${form.allDay ? "00:00:00" : `${form.startTime}:00`}`);
      let endAt = null;
      if (form.hasEnd) {
        const endDate = form.endDate || form.startDate;
        const endTime = form.allDay ? "23:59:59" : `${form.endTime || form.startTime}:00`;
        endAt = new Date(`${endDate}T${endTime}`);
      }

      if (endAt && endAt < startAt) throw new Error("A befejezés nem lehet korábbi a kezdésnél.");

      const payload = {
        title: form.title,
        description: form.description,
        location: form.location,
        category: form.category,
        startAt: startAt.toISOString(),
        endAt: endAt?.toISOString() || null,
        allDay: form.allDay,
        published: form.published,
      };

      if (event) {
        await axios.patch(`${import.meta.env.VITE_API_URL}/api/admin/calendar/${event.id}`, payload);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/calendar`, payload);
      }
      await onSaved();
    } catch (requestError) {
      console.error("Naptáresemény mentési hiba:", requestError);
      setError(requestError.response?.data?.error || requestError.message || "Az esemény nem menthető.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10";

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="event-form-title" onMouseDown={(mouseEvent) => { if (mouseEvent.target === mouseEvent.currentTarget) onClose(); }}>
      <form onSubmit={handleSubmit} className="max-h-[96vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-5 border-b border-slate-100 bg-white/95 px-6 py-5 backdrop-blur sm:px-8">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">Publikus naptár</p><h2 id="event-form-title" className="mt-1 text-xl font-semibold text-slate-950">{event ? "Esemény szerkesztése" : "Új esemény"}</h2></div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-xl text-slate-500 hover:bg-slate-50" aria-label="Bezárás">×</button>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Esemény címe</span><input value={form.title} onChange={(eventObject) => handleChange({ title: eventObject.target.value })} required className={inputClass} placeholder="pl. Adventi növendékhangverseny" /></label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Kategória</span><select value={form.category} onChange={(eventObject) => handleChange({ category: eventObject.target.value })} className={inputClass}>{CATEGORIES.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}</select></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Helyszín</span><input value={form.location} onChange={(eventObject) => handleChange({ location: eventObject.target.value })} className={inputClass} placeholder="pl. Erkel Ferenc Zeneiskola – Hangversenyterem" /></label>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
            <label className="mb-5 flex cursor-pointer items-center gap-3"><input type="checkbox" checked={form.allDay} onChange={(eventObject) => handleChange({ allDay: eventObject.target.checked })} className="h-5 w-5 accent-amber-600" /><span className="text-sm font-semibold text-slate-700">Egész napos esemény</span></label>
            <div className={`grid gap-4 ${form.allDay ? "sm:grid-cols-1" : "sm:grid-cols-2"}`}>
              <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Kezdés dátuma</span><input type="date" value={form.startDate} onChange={(eventObject) => handleChange({ startDate: eventObject.target.value, ...(!form.endDate && { endDate: eventObject.target.value }) })} required className={inputClass} /></label>
              {!form.allDay && <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Kezdés időpontja</span><input type="time" value={form.startTime} onChange={(eventObject) => handleChange({ startTime: eventObject.target.value })} required className={inputClass} /></label>}
            </div>

            <label className="my-5 flex cursor-pointer items-center gap-3 border-t border-slate-200 pt-5"><input type="checkbox" checked={form.hasEnd} onChange={(eventObject) => handleChange({ hasEnd: eventObject.target.checked })} className="h-5 w-5 accent-amber-600" /><span className="text-sm font-semibold text-slate-700">Befejezési időpont megadása</span></label>
            {form.hasEnd && <div className={`grid gap-4 ${form.allDay ? "sm:grid-cols-1" : "sm:grid-cols-2"}`}><label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Befejezés dátuma</span><input type="date" value={form.endDate} min={form.startDate} onChange={(eventObject) => handleChange({ endDate: eventObject.target.value })} required className={inputClass} /></label>{!form.allDay && <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Befejezés időpontja</span><input type="time" value={form.endTime} onChange={(eventObject) => handleChange({ endTime: eventObject.target.value })} className={inputClass} /></label>}</div>}
          </div>

          <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Leírás</span><textarea value={form.description} onChange={(eventObject) => handleChange({ description: eventObject.target.value })} rows={5} className={`${inputClass} resize-y`} placeholder="Rövid információ az eseményről…" /></label>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><input type="checkbox" checked={form.published} onChange={(eventObject) => handleChange({ published: eventObject.target.checked })} className="mt-0.5 h-5 w-5 accent-amber-600" /><span><span className="block text-sm font-semibold text-slate-800">Megjelenik a publikus naptárban</span><span className="mt-1 block text-xs text-slate-500">Kikapcsolva piszkozatként menthető.</span></span></label>

          {error && <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-100 bg-white/95 px-6 py-5 backdrop-blur sm:px-8"><button type="button" onClick={onClose} className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">Mégse</button><button type="submit" disabled={saving} className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800 disabled:opacity-50">{saving ? "Mentés…" : event ? "Változtatások mentése" : "Esemény létrehozása"}</button></div>
      </form>
    </div>
  );
}

function EventRow({ event, onEdit, onDelete }) {
  const date = new Date(event.startAt);
  const category = CATEGORIES.find((item) => item.value === event.category) || CATEGORIES.at(-1);
  const isPast = new Date(event.endAt || event.startAt) < new Date();

  return (
    <div className="group flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-50/80 sm:flex-row sm:items-center sm:px-7">
      <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl border ${isPast ? "border-slate-200 bg-slate-50 text-slate-400" : "border-amber-200 bg-amber-50 text-amber-800"}`}><div className="text-center"><span className="block text-2xl font-bold leading-none">{date.getDate()}</span><span className="mt-1 block text-[10px] font-bold uppercase tracking-wider">{MONTHS[date.getMonth()]}</span></div></div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2.5"><h3 className="font-semibold text-slate-950">{event.title}</h3><span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600"><span className={`h-1.5 w-1.5 rounded-full ${category.color}`} />{category.label}</span>{!event.published && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-800">Piszkozat</span>}</div>
        <p className="mt-1.5 text-sm text-slate-500">{formatDateLine(event)}{event.location ? ` · ${event.location}` : ""}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2"><button type="button" onClick={() => onEdit(event)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300">Szerkesztés</button><button type="button" onClick={() => onDelete(event)} className="rounded-xl px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50">Törlés</button></div>
    </div>
  );
}

export default function AdminCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [creating, setCreating] = useState(false);

  const loadEvents = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/calendar`);
    setEvents(response.data);
  };

  useEffect(() => {
    let ignore = false;
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/calendar`)
      .then((response) => { if (!ignore) setEvents(response.data); })
      .catch((requestError) => { if (!ignore) { console.error(requestError); setError("Az események nem tölthetők be."); } })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, []);

  const sortedEvents = useMemo(() => [...events].sort((first, second) => new Date(first.startAt) - new Date(second.startAt)), [events]);
  const upcoming = sortedEvents.filter((event) => new Date(event.endAt || event.startAt) >= new Date());
  const past = sortedEvents.filter((event) => new Date(event.endAt || event.startAt) < new Date()).reverse();

  const handleDelete = async (event) => {
    if (!window.confirm(`Biztosan törlöd ezt az eseményt?\n\n${event.title}`)) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/calendar/${event.id}`);
      setEvents((current) => current.filter((item) => item.id !== event.id));
    } catch (requestError) {
      console.error(requestError);
      setError("Az esemény nem törölhető.");
    }
  };

  const handleSaved = async () => {
    await loadEvents();
    setCreating(false);
    setEditingEvent(null);
  };

  if (loading) return <div className="mx-auto h-72 max-w-7xl animate-pulse rounded-3xl bg-white shadow-sm" />;

  return (
    <main className="mx-auto max-w-7xl">
      <AdminPageHeader title="Publikus naptár" description="A weboldalon megjelenő koncertek, versenyek és iskolai események kezelése.">
        <div className="flex flex-wrap gap-2"><Link to="/naptar" target="_blank" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300">Publikus naptár ↗</Link><button type="button" onClick={() => { setEditingEvent(null); setCreating(true); }} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800">+ Új esemény</button></div>
      </AdminPageHeader>

      {error && <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[{ label: "Összes esemény", value: events.length }, { label: "Közelgő", value: upcoming.length }, { label: "Publikált", value: events.filter((event) => event.published).length }].map((stat) => <div key={stat.label} className="rounded-2xl border border-white bg-white p-5 shadow-sm ring-1 ring-slate-200/70"><p className="text-3xl font-semibold tracking-tight text-slate-950">{stat.value}</p><p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">{stat.label}</p></div>)}
      </div>

      <section className="overflow-hidden rounded-3xl border border-white bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70">
        <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-7"><h2 className="font-semibold text-slate-950">Közelgő események</h2><p className="mt-1 text-xs text-slate-500">Időrendi sorrendben</p></div>
        {upcoming.length ? <div className="divide-y divide-slate-100">{upcoming.map((event) => <EventRow key={event.id} event={event} onEdit={(item) => { setCreating(false); setEditingEvent(item); }} onDelete={handleDelete} />)}</div> : <div className="px-6 py-14 text-center"><p className="font-semibold text-slate-700">Még nincs közelgő esemény</p><p className="mt-2 text-sm text-slate-500">Az első programot az „Új esemény” gombbal veheted fel.</p></div>}
      </section>

      {past.length > 0 && <section className="mt-7 overflow-hidden rounded-3xl border border-white bg-white shadow-sm ring-1 ring-slate-200/70"><div className="border-b border-slate-100 px-5 py-4 sm:px-7"><h2 className="font-semibold text-slate-950">Korábbi események</h2></div><div className="divide-y divide-slate-100 opacity-80">{past.map((event) => <EventRow key={event.id} event={event} onEdit={(item) => { setCreating(false); setEditingEvent(item); }} onDelete={handleDelete} />)}</div></section>}

      {(creating || editingEvent) && <EventForm event={editingEvent} onClose={() => { setCreating(false); setEditingEvent(null); }} onSaved={handleSaved} />}
    </main>
  );
}
