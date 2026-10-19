import prisma from "../lib/prisma.js";

const parseBoundary = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const getCalendarEvents = async (req, res) => {
  try {
    const from = parseBoundary(req.query.from);
    const to = parseBoundary(req.query.to);

    if ((req.query.from && !from) || (req.query.to && !to)) {
      return res.status(400).json({ error: "Érvénytelen dátumtartomány." });
    }

    const rangeFilter = from || to
      ? {
          ...(to && { startAt: { lte: to } }),
          ...(from && {
            OR: [
              { endAt: { gte: from } },
              { endAt: null, startAt: { gte: from } },
            ],
          }),
        }
      : {};

    const events = await prisma.calendarEvent.findMany({
      where: {
        published: true,
        ...rangeFilter,
      },
      orderBy: { startAt: "asc" },
    });

    res.json(events);
  } catch (error) {
    console.error("Publikus naptár betöltési hiba:", error);
    res.status(500).json({ error: "A naptár eseményei nem tölthetők be." });
  }
};
