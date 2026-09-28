import prisma from "../lib/prisma.js";

export const createSection = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { type, content = {}, sortOrder, visible = true } = req.body;

    if (!type) {
      return res.status(400).json({ error: "A szekció típusa kötelező." });
    }

    const page = await prisma.page.findUnique({
      where: {
        id: pageId,
      },
    });

    if (!page) {
      return res.status(404).json({ error: "Az oldal nem található." });
    }

    let finalSortOrder = sortOrder;

    if (finalSortOrder === undefined) {
      const lastSection = await prisma.pageSection.findFirst({
        where: {
          pageId,
        },
        orderBy: {
          sortOrder: "desc",
        },
      });
      finalSortOrder = lastSection ? lastSection.sortOrder + 1 : 0;
    }

    const section = await prisma.pageSection.create({
      data: {
        pageId,
        type,
        content,
        sortOrder: finalSortOrder,
        visible,
      },
    });

    res.status(201).json(section);
  } catch (error) {
    console.error("Szekció létrehozási hiba:", error);
    res.status(500).json({ error: "Hiba történt a szekció létrehozásakor." });
  }
};

export const updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, content, sortOrder, visible } = req.body;
    const existingSection = await prisma.pageSection.findUnique({
      where: {
        id,
      },
    });

    if (!existingSection) {
      return res.status(404).json({ error: "A szekció nem található." });
    }

    const section = await prisma.pageSection.update({
      where: {
        id,
      },
      data: {
        ...(type !== undefined && { type }),
        ...(content !== undefined && { content }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(visible !== undefined && { visible }),
      },
    });

    res.json(section);
  } catch (error) {
    console.error("Szekció módosítási hiba:", error);
    res.status(500).json({ error: "Hiba történt a szekció módosításakor." });
  }
};

export const deleteSection = async (req, res) => {
  try {
    const { id } = req.params;
    const section = await prisma.pageSection.findUnique({
      where: {
        id,
      },
    });

    if (!section) {
      return res.status(404).json({ error: "A szekció nem található." });
    }

    await prisma.pageSection.delete({
      where: {
        id,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Szekció törlési hiba:", error);
    res.status(500).json({ error: "Hiba történt a szekció törlésekor." });
  }
};