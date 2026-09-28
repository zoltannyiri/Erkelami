import prisma from "../lib/prisma.js";

export const getAdminHome = async (req, res) => {
  try {
    const sections = await prisma.homeSection.findMany({
      orderBy: { 
        sortOrder: "asc"
      },
      include: {
        items: {
          orderBy: {
            sortOrder: "asc"
          },
        },
      },
    });
    res.json(sections);
  } catch (error) {
    console.error("Hiba az admin home betöltésekor:", error);
    res.status(500).json({ error: "Hiba az admin home betöltésekor" });
  }
};

export const updateHomeSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, visible } = req.body;

    const section = await prisma.homeSection.update({
      where: {
        id,
      },
      data: {
        ...(title !== undefined && { 
          title: title?.trim() || null,
        }),
        ...(visible !== undefined && {
          visible,
        }),
      },
    });
    res.json(section);
  } catch (error) {
    console.error("Hiba a home szekció frissítésekor:", error);
    res.status(500).json({ error: "Hiba a home szekció frissítésekor" });
  }
};

export const createHomeItem = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { title, imageUrl, linkUrl, visible = true } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ error: "A cím megadása kötelező." });
    }

    const section = await prisma.homeSection.findUnique({
      where: {
        id: sectionId,
      },
    });

    if (!section) {
      return res.status(404).json({ error: "A megadott szekció nem található." });
    }

    const lastItem = await prisma.homeSectionItem.findFirst({
      where: {
        sectionId,
      },
      orderBy: {
        sortOrder: "desc",
      },
    });

    const item = await prisma.homeSectionItem.create({
      data: {
        sectionId,
        title: title.trim(),
        imageUrl: imageUrl?.trim() || null,
        linkUrl: linkUrl?.trim() || null,
        visible,
        sortOrder: lastItem ? lastItem.sortOrder + 1 : 0,
      },
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Hiba a home elem létrehozásakor:", error);
    res.status(500).json({ error: "Hiba a home elem létrehozásakor" });
  }
};

export const updateHomeItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, imageUrl, linkUrl, visible } = req.body;
    const item = await prisma.homeSectionItem.update({
      where: {
        id,
      },
      data: {
        ...(title !== undefined && {
          title: title?.trim(),
        }),
        ...(imageUrl !== undefined && {
          imageUrl: imageUrl?.trim() || null,
        }),
        ...(linkUrl !== undefined && {
          linkUrl: linkUrl?.trim() || null,
        }),
        ...(visible !== undefined && {
          visible,
        }),
      },
    });
    res.json(item);
  } catch (error) {
    console.error("Hiba a home elem frissítésekor:", error);
    res.status(500).json({ error: "Hiba a home elem frissítésekor" });
  }
};

export const deleteHomeItem = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.homeSectionItem.delete({
      where: {
        id,
      },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Hiba a home elem törlésekor:", error);
    res.status(500).json({ error: "Hiba a home elem törlésekor" });
  }
};

export const reorderHomeItems = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { itemIds } = req.body;

    if (!Array.isArray(itemIds)) {
      return res.status(400).json({ error: "Az itemIds tömbnek kell lennie." });
    }

    const items = await prisma.homeSectionItem.findMany({
      where: {
        sectionId,
        id: {
          in: itemIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (items.length !== itemIds.length) {
      return res.status(400).json({ message: "Érvénytelen elem lista." });
    }

    await prisma.$transaction(
      itemIds.map((itemId, index) =>
        prisma.homeSectionItem.update({
          where: {
            id: itemId,
          },
          data: {
            sortOrder: index,
          },
        })
      )
    );

    res.json({ message: "Sorrend frissítve." });
  } catch (error) {
    console.error("Hiba az elemek átrendezésekor:", error);
    res.status(500).json({ error: "Hiba az elemek átrendezésekor" });
  }
};
