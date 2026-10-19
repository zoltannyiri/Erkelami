import prisma from "../lib/prisma.js";

const ALLOWED_CATEGORIES = new Set(["CONCERT", "COMPETITION", "SCHOOL", "HOLIDAY", "OTHER"]);

const optionalText = (value) => value?.trim() || null;

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const validateEvent = ({ title, category, startAt, endAt }) => {
  if (!title?.trim()) return "Az esemény címe kötelező.";
  if (!startAt) return "A kezdési időpont kötelező.";
  if (category && !ALLOWED_CATEGORIES.has(category)) return "Érvénytelen eseménykategória.";
  if (endAt && endAt < startAt) return "A befejezés nem lehet korábbi a kezdésnél.";
  return null;
};

export const getAdminCalendarEvents = async (_req, res) => {
  try {
    const events = await prisma.calendarEvent.findMany({
      orderBy: { startAt: "asc" },
    });
    res.json(events);
  } catch (error) {
    console.error("Admin naptár betöltési hiba:", error);
    res.status(500).json({ error: "Az események nem tölthetők be." });
  }
};

export const createCalendarEvent = async (req, res) => {
  try {
    const startAt = parseDate(req.body.startAt);
    const endAt = req.body.endAt ? parseDate(req.body.endAt) : null;
    if (req.body.endAt && !endAt) {
      return res.status(400).json({ error: "Érvénytelen befejezési időpont." });
    }
    const validationError = validateEvent({
      title: req.body.title,
      category: req.body.category,
      startAt,
      endAt,
    });

    if (validationError) return res.status(400).json({ error: validationError });

    const event = await prisma.calendarEvent.create({
      data: {
        title: req.body.title.trim(),
        description: optionalText(req.body.description),
        location: optionalText(req.body.location),
        category: req.body.category || "OTHER",
        startAt,
        endAt,
        allDay: Boolean(req.body.allDay),
        published: req.body.published !== false,
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("Naptáresemény létrehozási hiba:", error);
    res.status(500).json({ error: "Az esemény nem hozható létre." });
  }
};

export const updateCalendarEvent = async (req, res) => {
  try {
    const existing = await prisma.calendarEvent.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: "Az esemény nem található." });

    const startAt = req.body.startAt !== undefined ? parseDate(req.body.startAt) : existing.startAt;
    const endAt = req.body.endAt !== undefined
      ? req.body.endAt ? parseDate(req.body.endAt) : null
      : existing.endAt;
    if (req.body.endAt && !endAt) {
      return res.status(400).json({ error: "Érvénytelen befejezési időpont." });
    }
    const title = req.body.title !== undefined ? req.body.title : existing.title;
    const category = req.body.category !== undefined ? req.body.category : existing.category;
    const validationError = validateEvent({ title, category, startAt, endAt });

    if (validationError) return res.status(400).json({ error: validationError });

    const event = await prisma.calendarEvent.update({
      where: { id: req.params.id },
      data: {
        ...(req.body.title !== undefined && { title: req.body.title.trim() }),
        ...(req.body.description !== undefined && { description: optionalText(req.body.description) }),
        ...(req.body.location !== undefined && { location: optionalText(req.body.location) }),
        ...(req.body.category !== undefined && { category: req.body.category }),
        ...(req.body.startAt !== undefined && { startAt }),
        ...(req.body.endAt !== undefined && { endAt }),
        ...(req.body.allDay !== undefined && { allDay: Boolean(req.body.allDay) }),
        ...(req.body.published !== undefined && { published: Boolean(req.body.published) }),
      },
    });

    res.json(event);
  } catch (error) {
    console.error("Naptáresemény módosítási hiba:", error);
    res.status(500).json({ error: "Az esemény nem módosítható." });
  }
};

export const deleteCalendarEvent = async (req, res) => {
  try {
    const existing = await prisma.calendarEvent.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: "Az esemény nem található." });

    await prisma.calendarEvent.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    console.error("Naptáresemény törlési hiba:", error);
    res.status(500).json({ error: "Az esemény nem törölhető." });
  }
};
