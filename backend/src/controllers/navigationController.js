import prisma from "../lib/prisma.js";

export const getNavigation = async (req, res) => {
  try {
    const items = await prisma.navigationItem.findMany({
      where: {
        visible: true,
      },
      include: {
        page: {
          select: {
            slug: true,
          },
        },
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    const navigation = items.map((item) => ({
      id: item.id,
      label: item.label,
      url: item.externalUrl ? item.externalUrl : item.page ? `/${item.page.slug}` : null,
      external: Boolean(item.externalUrl),
    }));

    res.json(navigation);
  } catch (error) {
      console.error("Navigation error:", error);
      res.status(500).json({ message: "Hiba történt a navigációs adatok lekérésekor." 
    });
  }
};