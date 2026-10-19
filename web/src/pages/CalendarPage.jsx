import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const MONTH_NAMES = [
  "január",
  "február",
  "március",
  "április",
  "május",
  "június",
  "július",
  "augusztus",
  "szeptember",
  "október",
  "november",
  "december",
];

const WEEKDAYS = ["H", "K", "Sze", "Cs", "P", "Szo", "V"];
const WEEKDAY_SHORT = ["V", "H", "K", "Sze", "Cs", "P", "Szo"];
const CALENDAR_VIEWS = [
  { value: "MONTH", label: "Hónap" },
  { value: "WEEK", label: "Hét" },
  { value: "SCHEDULE", label: "Ütemezés" },
];
const HOUR_START = 8;
const HOUR_END = 22;
const HOUR_HEIGHT = 64;
const LONG_WEEKDAYS = [
  "vasárnap",
  "hétfő",
  "kedd",
  "szerda",
  "csütörtök",
  "péntek",
  "szombat",
];

const CATEGORY_STYLES = {
  CONCERT: {
    label: "Koncert",
    dot: "bg-violet-500",
    chip: "border-violet-200 bg-violet-50 text-violet-800",
    accent: "bg-violet-500",
  },
  COMPETITION: {
    label: "Verseny",
    dot: "bg-amber-500",
    chip: "border-amber-200 bg-amber-50 text-amber-800",
    accent: "bg-amber-500",
  },
  SCHOOL: {
    label: "Iskolai esemény",
    dot: "bg-sky-500",
    chip: "border-sky-200 bg-sky-50 text-sky-800",
    accent: "bg-sky-500",
  },
  HOLIDAY: {
    label: "Szünet",
    dot: "bg-emerald-500",
    chip: "border-emerald-200 bg-emerald-50 text-emerald-800",
    accent: "bg-emerald-500",
  },
  OTHER: {
    label: "Egyéb",
    dot: "bg-slate-500",
    chip: "border-slate-200 bg-slate-100 text-slate-700",
    accent: "bg-slate-500",
  },
};

const pad = (value) => String(value).padStart(2, "0");
const dateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const sameDay = (first, second) => dateKey(first) === dateKey(second);
const getCategory = (category) =>
  CATEGORY_STYLES[category] || CATEGORY_STYLES.OTHER;

const formatTime = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatFullDate = (date) =>
  `${date.getFullYear()}. ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}., ${LONG_WEEKDAYS[date.getDay()]}`;

const startOfWeek = (date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() - ((result.getDay() + 6) % 7));
  return result;
};

const googleDate = (date, allDay = false) => {
  if (allDay) return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
};

const getGoogleCalendarUrl = (event) => {
  const start = new Date(event.startAt);
  let end = event.endAt ? new Date(event.endAt) : new Date(start);
  if (event.allDay) {
    end.setDate(end.getDate() + 1);
  } else if (!event.endAt) {
    end = new Date(start.getTime() + 60 * 60 * 1000);
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${googleDate(start, event.allDay)}/${googleDate(end, event.allDay)}`,
    details: event.description || "",
    location: event.location || "",
    ctz: "Europe/Budapest",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

function CalendarIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 3v3M18 3v3M4 9h16M5 5h14a2 2 0 0 1 2 2v13H3V7a2 2 0 0 1 2-2Z" />
      <path d="M7 13h3M14 13h3M7 17h3" />
    </svg>
  );
}

function GoogleCalendarLink({ event, compact = false }) {
  return (
    <a
      href={getGoogleCalendarUrl(event)}
      target="_blank"
      rel="noreferrer"
      onClick={(clickEvent) => clickEvent.stopPropagation()}
      className={compact
        ? "shrink-0 px-2 py-1 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-50 hover:text-blue-900"
        : "inline-flex items-center justify-center gap-2 border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-700"}
    >
      <CalendarIcon className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      {compact ? "Google Naptár" : "Hozzáadás a Google Naptárhoz"}
    </a>
  );
}

function EventCard({ event, compact = false, onClick }) {
  const category = getCategory(event.category);
  const start = new Date(event.startAt);
  const time = event.allDay ? "Egész nap" : formatTime(event.startAt);

  return (
    <button
      type="button"
      onClick={() => onClick(event)}
      className={`group w-full text-left transition ${compact ? "px-1.5 py-1 hover:bg-stone-100" : "border-t border-stone-200 py-4 first:border-t-0 hover:bg-stone-50"}`}
    >
      <div className="flex items-start gap-3">
        {!compact && (
          <span className={`mt-1 h-8 w-0.5 shrink-0 ${category.accent}`} />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {compact && (
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${category.dot}`}
              />
            )}
            <p
              className={`${compact ? "truncate text-[11px] font-semibold" : "font-semibold"} text-slate-900`}
            >
              {event.title}
            </p>
          </div>
          {!compact && (
            <>
              <p className="mt-1.5 text-xs font-medium text-slate-500">
                {start.getDate()}. {MONTH_NAMES[start.getMonth()]} · {time}
              </p>
              {event.location && (
                <p className="mt-2 truncate text-xs text-slate-400">
                  {event.location}
                </p>
              )}
            </>
          )}
        </div>
        {!compact && (
          <span className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-700">
            ↗
          </span>
        )}
      </div>
    </button>
  );
}

function EventDetails({ event, onClose }) {
  if (!event) return null;
  const category = getCategory(event.category);
  const start = new Date(event.startAt);
  const endTime = formatTime(event.endAt);
  const timeLabel = event.allDay
    ? "Egész nap"
    : [formatTime(event.startAt), endTime].filter(Boolean).join("–");

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendar-event-title"
      onMouseDown={(eventObject) => {
        if (eventObject.target === eventObject.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl overflow-hidden border border-stone-200 bg-[#fffefa] shadow-2xl">
        <div className={`h-1 w-full ${category.accent}`} />
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-5">
            <span
              className={`inline-flex border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${category.chip}`}
            >
              {category.label}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center border border-stone-200 bg-white text-lg text-slate-500 transition hover:border-stone-400 hover:text-slate-950"
              aria-label="Bezárás"
            >
              ×
            </button>
          </div>
          <h2
            id="calendar-event-title"
            className="mt-6 text-2xl font-semibold tracking-[-0.025em] text-slate-950 sm:text-3xl"
          >
            {event.title}
          </h2>
          <div className="mt-6 grid gap-5 border-y border-stone-200 py-5 text-sm sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Időpont
              </p>
              <p className="mt-1 font-semibold text-slate-800">
                {formatFullDate(start)}
              </p>
              <p className="mt-0.5 text-slate-500">{timeLabel}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Helyszín
              </p>
              <p className="mt-1 font-semibold text-slate-800">
                {event.location || "Hamarosan"}
              </p>
            </div>
          </div>
          {event.description && (
            <p className="mt-6 whitespace-pre-line text-sm leading-7 text-slate-600">
              {event.description}
            </p>
          )}
          <div className="mt-7 border-t border-stone-200 pt-5">
            <GoogleCalendarLink event={event} />
          </div>
        </div>
      </div>
    </div>
  );
}

function WeekView({ days, eventsByDay, today, onEventClick }) {
  const hours = Array.from({ length: HOUR_END - HOUR_START }, (_, index) => HOUR_START + index);
  const timelineHeight = hours.length * HOUR_HEIGHT;
  const hasAllDayEvents = days.some((day) =>
    (eventsByDay[dateKey(day)] || []).some((event) => event.allDay),
  );

  const eventPosition = (event, day) => {
    const eventStart = new Date(event.startAt);
    const eventEnd = event.endAt ? new Date(event.endAt) : new Date(eventStart.getTime() + 60 * 60 * 1000);
    const dayStart = new Date(day);
    dayStart.setHours(HOUR_START, 0, 0, 0);
    const totalMinutes = (HOUR_END - HOUR_START) * 60;
    const rawStartMinutes = (eventStart - dayStart) / 60000;
    const rawEndMinutes = (eventEnd - dayStart) / 60000;
    const startMinutes = Math.min(totalMinutes - 30, Math.max(0, rawStartMinutes));
    const endMinutes = Math.min(totalMinutes, Math.max(startMinutes + 30, rawEndMinutes));
    const durationMinutes = endMinutes - startMinutes;

    return {
      top: (startMinutes / 60) * HOUR_HEIGHT + 2,
      height: Math.max(28, (durationMinutes / 60) * HOUR_HEIGHT - 4),
    };
  };

  return (
    <div className="overflow-x-auto border border-stone-300 bg-[#fffefa]">
      <div className="min-w-[920px]">
        <div
          className="grid border-b border-stone-300 bg-stone-50"
          style={{ gridTemplateColumns: "72px repeat(7, minmax(0, 1fr))" }}
        >
          <div className="border-r border-stone-300 px-3 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Idő
          </div>
          {days.map((day) => {
            const isToday = sameDay(day, today);
            return (
              <div
                key={dateKey(day)}
                className={`flex items-center justify-center gap-2 border-r border-stone-200 px-2 py-3 last:border-r-0 ${isToday ? "bg-amber-50" : ""}`}
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  {WEEKDAY_SHORT[day.getDay()]}
                </span>
                <span className={`grid h-8 w-8 place-items-center text-sm font-bold ${isToday ? "bg-amber-700 text-white" : "text-slate-900"}`}>
                  {day.getDate()}
                </span>
                <span className="text-[10px] text-slate-400">
                  {MONTH_NAMES[day.getMonth()].slice(0, 3)}.
                </span>
              </div>
            );
          })}
        </div>

        {hasAllDayEvents && (
          <div
            className="grid border-b border-stone-300"
            style={{ gridTemplateColumns: "72px repeat(7, minmax(0, 1fr))" }}
          >
            <div className="border-r border-stone-300 bg-stone-50 px-2 py-3 text-center text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">
              Egész nap
            </div>
            {days.map((day) => (
              <div
                key={dateKey(day)}
                className="min-h-12 space-y-1 border-r border-stone-200 p-1.5 last:border-r-0"
              >
                {(eventsByDay[dateKey(day)] || []).filter((event) => event.allDay).map((event) => {
                  const category = getCategory(event.category);
                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => onEventClick(event)}
                      title={event.title}
                      className={`flex w-full items-center gap-1.5 overflow-hidden border px-2 py-1.5 text-left text-[10px] font-semibold transition hover:brightness-95 ${category.chip}`}
                    >
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${category.dot}`} />
                      <span className="truncate">{event.title}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        <div
          className="grid"
          style={{ gridTemplateColumns: "72px repeat(7, minmax(0, 1fr))" }}
        >
          <div className="relative border-r border-stone-300 bg-stone-50" style={{ height: timelineHeight }}>
            {hours.map((hour, index) => (
              <span
                key={hour}
                className="absolute right-3 text-[10px] font-semibold text-slate-400"
                style={{ top: index * HOUR_HEIGHT + 5 }}
              >
                {pad(hour)}:00
              </span>
            ))}
          </div>

          {days.map((day) => {
            const timedEvents = (eventsByDay[dateKey(day)] || []).filter((event) => !event.allDay);
            const isToday = sameDay(day, today);

            return (
              <div
                key={dateKey(day)}
                className={`relative border-r border-stone-200 last:border-r-0 ${isToday ? "bg-amber-50/30" : ""}`}
                style={{
                  height: timelineHeight,
                  backgroundImage: "linear-gradient(to bottom, rgba(214,211,209,.78) 1px, transparent 1px)",
                  backgroundSize: `100% ${HOUR_HEIGHT}px`,
                }}
              >
                {timedEvents.map((event, index) => {
                  const position = eventPosition(event, day);
                  const category = getCategory(event.category);
                  const offset = Math.min(index, 2) * 3;

                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => onEventClick(event)}
                      title={event.title}
                      className={`absolute z-[1] overflow-hidden border px-2 py-1 text-left text-[10px] font-semibold shadow-sm transition hover:z-10 hover:brightness-95 ${category.chip}`}
                      style={{
                        top: position.top,
                        height: position.height,
                        left: 4 + offset,
                        right: 4,
                      }}
                    >
                      <span className="block truncate">{event.title}</span>
                      <span className="mt-0.5 block truncate text-[9px] font-medium opacity-75">
                        {formatTime(event.startAt)}{event.endAt ? `–${formatTime(event.endAt)}` : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ScheduleView({ days, eventsByDay, today, onEventClick }) {
  const daysWithEvents = days.filter((day) => (eventsByDay[dateKey(day)] || []).length > 0);

  if (daysWithEvents.length === 0) {
    return <div className="border border-stone-300 bg-stone-50 px-6 py-16 text-center"><p className="font-semibold text-slate-700">Ebben a hónapban még nincs esemény.</p><p className="mt-2 text-sm text-slate-500">Az új programok itt, dátum szerint rendezve jelennek majd meg.</p></div>;
  }

  return (
    <div className="border border-stone-300 bg-[#fffefa]">
      {daysWithEvents.map((day) => {
        const dayEvents = eventsByDay[dateKey(day)] || [];
        const isToday = sameDay(day, today);
        return (
          <section key={dateKey(day)} className="grid border-b border-stone-200 last:border-b-0 md:grid-cols-[130px_minmax(0,1fr)]">
            <div className={`border-b border-stone-200 px-5 py-5 md:border-b-0 md:border-r ${isToday ? "bg-amber-50" : "bg-stone-50/70"}`}>
              <div className="flex items-baseline gap-2 md:block"><span className={`text-2xl font-semibold ${isToday ? "text-amber-800" : "text-slate-900"}`}>{day.getDate()}</span><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 md:mt-1 md:block">{MONTH_NAMES[day.getMonth()]}, {WEEKDAY_SHORT[day.getDay()]}</span></div>
            </div>
            <div className="divide-y divide-stone-100">
              {dayEvents.map((event) => {
                const category = getCategory(event.category);
                return (
                  <div key={event.id} className="grid items-center gap-3 px-5 py-4 transition hover:bg-stone-50 sm:grid-cols-[125px_minmax(0,1fr)_auto]">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500"><span className={`h-2 w-2 rounded-full ${category.dot}`} /><span>{event.allDay ? "Egész nap" : `${formatTime(event.startAt)}${event.endAt ? `–${formatTime(event.endAt)}` : ""}`}</span></div>
                    <button type="button" onClick={() => onEventClick(event)} className="min-w-0 text-left"><span className="block truncate text-sm font-semibold text-slate-900 hover:text-amber-800">{event.title}</span>{event.location && <span className="mt-1 block truncate text-xs text-slate-400">{event.location}</span>}</button>
                    <GoogleCalendarLink event={event} compact />
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default function CalendarPage() {
  const today = useMemo(() => new Date(), []);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(today);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [calendarView, setCalendarView] = useState("MONTH");

  useEffect(() => {
    document.title = "Eseménynaptár | Erkel Ferenc Alapfokú Művészeti Iskola";
    return () => {
      document.title = "Erkel Ferenc Alapfokú Művészeti Iskola";
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    const monthStart = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth(),
      1,
    );
    const mondayOffset = (monthStart.getDay() + 6) % 7;
    const from = new Date(monthStart);
    from.setDate(from.getDate() - mondayOffset);
    const to = new Date(from);
    to.setDate(to.getDate() + 41);
    to.setHours(23, 59, 59, 999);

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/calendar`, {
        params: { from: from.toISOString(), to: to.toISOString() },
      })
      .then((response) => {
        if (ignore) return;
        const payload = Array.isArray(response.data)
          ? response.data
          : response.data?.events;
        setEvents(Array.isArray(payload) ? payload : []);
      })
      .catch((error) => {
        if (ignore) return;
        setEvents([]);
        if (error.response?.status !== 404) setLoadError(true);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [visibleMonth]);

  useEffect(() => {
    if (!selectedEvent) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedEvent(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedEvent]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth(),
      1,
    );
    const mondayOffset = (firstDay.getDay() + 6) % 7;
    const firstCell = new Date(firstDay);
    firstCell.setDate(firstCell.getDate() - mondayOffset);
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(firstCell);
      date.setDate(firstCell.getDate() + index);
      return date;
    });
  }, [visibleMonth]);

  const weekDays = useMemo(() => {
    const firstDay = startOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(firstDay);
      date.setDate(firstDay.getDate() + index);
      return date;
    });
  }, [selectedDate]);

  const scheduleDays = useMemo(
    () => calendarDays.filter((date) => date.getMonth() === visibleMonth.getMonth()),
    [calendarDays, visibleMonth],
  );

  const filteredEvents = useMemo(
    () =>
      events
        .filter(
          (event) =>
            activeCategory === "ALL" ||
            (event.category || "OTHER") === activeCategory,
        )
        .sort(
          (first, second) => new Date(first.startAt) - new Date(second.startAt),
        ),
    [events, activeCategory],
  );

  const eventsByDay = useMemo(
    () =>
      filteredEvents.reduce((result, event) => {
        const currentDay = new Date(event.startAt);
        currentDay.setHours(0, 0, 0, 0);
        const lastDay = new Date(event.endAt || event.startAt);
        lastDay.setHours(0, 0, 0, 0);

        let dayCount = 0;
        while (currentDay <= lastDay && dayCount < 370) {
          const key = dateKey(currentDay);
          if (!result[key]) result[key] = [];
          result[key].push(event);
          currentDay.setDate(currentDay.getDate() + 1);
          dayCount += 1;
        }
        return result;
      }, {}),
    [filteredEvents],
  );

  const availableCategories = useMemo(
    () => [...new Set(events.map((event) => event.category || "OTHER"))],
    [events],
  );
  const selectedDayEvents = eventsByDay[dateKey(selectedDate)] || [];
  const upcomingEvents = filteredEvents
    .filter(
      (event) =>
        new Date(event.endAt || event.startAt) >=
        new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    )
    .slice(0, 5);

  const changePeriod = (offset) => {
    if (calendarView === "WEEK") {
      const nextDate = new Date(selectedDate);
      nextDate.setDate(nextDate.getDate() + offset * 7);
      const nextMonth = new Date(nextDate.getFullYear(), nextDate.getMonth(), 1);
      if (nextMonth.getTime() !== visibleMonth.getTime()) {
        setLoading(true);
        setLoadError(false);
        setVisibleMonth(nextMonth);
      }
      setSelectedDate(nextDate);
      return;
    }

    const next = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth() + offset,
      1,
    );
    setLoading(true);
    setLoadError(false);
    setVisibleMonth(next);
    setSelectedDate(next);
  };

  const periodTitle = calendarView === "WEEK"
    ? weekDays[0].getMonth() === weekDays[6].getMonth()
      ? `${MONTH_NAMES[weekDays[0].getMonth()]} ${weekDays[0].getDate()}–${weekDays[6].getDate()}. ${weekDays[6].getFullYear()}`
      : `${MONTH_NAMES[weekDays[0].getMonth()]} ${weekDays[0].getDate()}. – ${MONTH_NAMES[weekDays[6].getMonth()]} ${weekDays[6].getDate()}. ${weekDays[6].getFullYear()}`
    : `${MONTH_NAMES[visibleMonth.getMonth()]} ${visibleMonth.getFullYear()}`;

  const jumpToToday = () => {
    setLoading(true);
    setLoadError(false);
    setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  return (
    <main className="min-h-screen bg-[#fffefa]">
      <header className="border-b border-stone-200 bg-[#fffefa]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 px-5 py-9 sm:px-8 sm:py-12 lg:flex-row lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-800">
              Programok és időpontok
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-slate-950 sm:text-5xl">
              Eseménynaptár
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
              Koncertek, versenyek és az iskola közösségi eseményei.
            </p>
          </div>
          <div className="flex w-fit items-center gap-4 border-l-2 border-amber-700 pl-4">
            <div className="text-4xl font-semibold leading-none tracking-[-0.03em] text-slate-950">
              {today.getDate()}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-800">
                Ma
              </p>
              <p className="mt-1 text-sm font-medium text-slate-600">
                {MONTH_NAMES[today.getMonth()]} ·{" "}
                {LONG_WEEKDAYS[today.getDay()]}
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
        <div className="mb-6 flex flex-col justify-between gap-5 border-b border-stone-200 pb-5 lg:flex-row lg:items-end">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => changePeriod(-1)}
              aria-label={calendarView === "WEEK" ? "Előző hét" : "Előző hónap"}
              className="cursor-pointer grid h-10 w-10 place-items-center rounded-2xl border border-stone-300 bg-white text-base text-slate-600 transition hover:border-slate-800 hover:text-slate-950"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => changePeriod(1)}
              aria-label={calendarView === "WEEK" ? "Következő hét" : "Következő hónap"}
              className="cursor-pointer grid h-10 w-10 place-items-center rounded-2xl border border-stone-300 bg-white text-base text-slate-600 transition hover:border-slate-800 hover:text-slate-950"
            >
              →
            </button>
            <h2 className="ml-3 min-w-44 text-2xl font-semibold tracking-[-0.025em] text-slate-950 sm:text-3xl"><span className="capitalize">{periodTitle}</span></h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex border border-stone-300 bg-white p-1" aria-label="Naptárnézet">
              {CALENDAR_VIEWS.map((view) => (
                <button
                  key={view.value}
                  type="button"
                  aria-pressed={calendarView === view.value}
                  onClick={() => setCalendarView(view.value)}
                  className={`px-3 py-2 text-xs font-semibold transition sm:px-4 ${calendarView === view.value ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-stone-100 hover:text-slate-900"}`}
                >
                  {view.label}
                </button>
              ))}
            </div>
            {availableCategories.length > 0 && (
              <div className="flex flex-wrap gap-1 border border-stone-200 bg-white p-1">
                {["ALL", ...availableCategories].map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 py-2 text-xs font-semibold transition ${activeCategory === category ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-stone-100 hover:text-slate-900"}`}
                  >
                    {category === "ALL" ? "Mind" : getCategory(category).label}
                  </button>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={jumpToToday}
              className="cursor-pointer rounded-2xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-800"
            >
              Mai nap
            </button>
          </div>
        </div>

        {loadError && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            Az események most nem tölthetők be. Kérjük, próbáld meg később.
          </div>
        )}

        {calendarView === "MONTH" ? (
        <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_290px]">
          <div className="overflow-hidden border border-stone-300 bg-[#fffefa]">
            <div className="hidden grid-cols-7 border-b border-stone-200 bg-stone-50/80 md:grid">
              {WEEKDAYS.map((day, index) => (
                <div
                  key={day}
                  className={`px-3 py-3.5 text-center text-[10px] font-bold uppercase tracking-[0.18em] ${index > 4 ? "text-amber-700" : "text-slate-400"}`}
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="hidden grid-cols-7 md:grid">
              {calendarDays.map((date, index) => {
                const dayEvents = eventsByDay[dateKey(date)] || [];
                const outside = date.getMonth() !== visibleMonth.getMonth();
                const isToday = sameDay(date, today);
                const selected = sameDay(date, selectedDate);
                return (
                  <div
                    key={dateKey(date)}
                    className={`group min-h-32 border-b border-r border-stone-200/80 p-2.5 text-left transition hover:z-10 hover:bg-amber-50/50 ${index % 7 === 6 ? "border-r-0" : ""} ${index >= 35 ? "border-b-0" : ""} ${outside ? "bg-stone-50/55" : "bg-[#fffefa]"} ${selected ? "ring-2 ring-inset ring-amber-500" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      aria-label={`${formatFullDate(date)} kiválasztása`}
                      className={`grid h-8 w-8 place-items-center text-sm font-semibold ${isToday ? "bg-amber-700 text-white" : outside ? "text-slate-300" : "text-slate-600 group-hover:text-slate-950"}`}
                    >
                      {date.getDate()}
                    </button>
                    <div className="mt-2 space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          compact
                          onClick={setSelectedEvent}
                        />
                      ))}
                      {dayEvents.length > 2 && (
                        <p className="px-2 text-[10px] font-semibold text-slate-400">
                          +{dayEvents.length - 2} további
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 md:hidden">
              <div className="grid grid-cols-7 gap-1">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="py-2 text-center text-[9px] font-bold uppercase text-slate-400"
                  >
                    {day}
                  </div>
                ))}
                {calendarDays.map((date) => {
                  const dayEvents = eventsByDay[dateKey(date)] || [];
                  const outside = date.getMonth() !== visibleMonth.getMonth();
                  const isToday = sameDay(date, today);
                  const selected = sameDay(date, selectedDate);
                  return (
                    <button
                      key={dateKey(date)}
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      className={`relative aspect-square text-xs font-semibold transition ${selected ? "bg-slate-950 text-white" : isToday ? "border border-amber-700 text-amber-800" : outside ? "text-slate-300" : "text-slate-600 hover:bg-stone-100"}`}
                    >
                      {date.getDate()}
                      {dayEvents.length > 0 && (
                        <span
                          className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${selected ? "bg-amber-300" : "bg-amber-600"}`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 border-t border-stone-200 pt-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  {formatFullDate(selectedDate)}
                </p>
                <div className="mt-3 space-y-2">
                  {selectedDayEvents.length ? (
                    selectedDayEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onClick={setSelectedEvent}
                      />
                    ))
                  ) : (
                    <p className="border border-stone-200 bg-stone-50 px-4 py-5 text-center text-sm text-slate-500">
                      Erre a napra nincs meghirdetett esemény.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <aside className="border-t-2 border-slate-950 bg-[#fffefa] pt-5 text-slate-950 xl:sticky xl:top-24">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-800">
                  Következik
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-[-0.015em]">
                  Közelgő események
                </h2>
              </div>
              <span className="text-slate-400">
                <CalendarIcon />
              </span>
            </div>
            <div className="mt-6 space-y-3">
              {loading ? (
                [0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="h-20 animate-pulse border-t border-stone-200 bg-stone-50"
                  />
                ))
              ) : upcomingEvents.length ? (
                upcomingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={setSelectedEvent}
                  />
                ))
              ) : (
                <div className="border-t border-stone-200 py-6">
                  <p className="text-sm font-semibold text-slate-800">
                    Még nincs közelgő esemény
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Az új programok itt fognak megjelenni.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
        ) : calendarView === "WEEK" ? (
          <WeekView days={weekDays} eventsByDay={eventsByDay} today={today} onEventClick={setSelectedEvent} />
        ) : (
          <ScheduleView days={scheduleDays} eventsByDay={eventsByDay} today={today} onEventClick={setSelectedEvent} />
        )}
      </section>

      <EventDetails
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </main>
  );
}
