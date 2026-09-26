import prisma from "../lib/prisma.js";

export const getHome = async (req, res) => {
  try {
    const sections = await prisma.homeSection.findMany({
      where: {
        visible: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
      include: {
        items: {
          where: {
            visible: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    res.json(sections);
  } catch (error) {
    console.error("Kezdőoldal betöltési hiba:", error);
    res.status(500).json({ error: "Hiba történt a kezdőoldal betöltése során." });
  }
};