import prisma from "../lib/prisma.js";

export const getPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const page = await prisma.page.findUnique({
      where: {
        slug,
      },
      include: {
        sections: {
          where: {
            visible: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
        },
      }
    });

    if (!page) {
      return res.status(404).json({ error: "Az oldal nem található." });
    }

    if (!page.published) {
      return res.status(404).json({ error: "Az oldal nem elérhető." });
    }

    res.json(page);
  } catch (error) {
    console.error("Oldal betöltési hiba:", error);
    res.status(500).json({ error: "Hiba történt az oldal betöltése során." });
  }
};