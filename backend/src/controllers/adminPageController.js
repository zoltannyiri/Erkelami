import prisma from "../lib/prisma.js";
import {
  createPageWithTemplate,
  PageCreationValidationError,
  slugifyPage,
} from "../services/pageCreationService.js";

export const getPages = async (req, res) => {
  try {
    const pages = await prisma.page.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            sections: true,
            navigationItems: true,
          },
        },
      },
    });

    res.json(pages);
  } catch (error) {
    console.error("Admin oldal betöltési hiba:", error);
    res.status(500).json({ error: "Hiba történt az oldalak betöltésekor." });
  }
}

export const getPage = async (req, res) => {
  try {
    const page = await prisma.page.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        sections: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    if (!page) {
      return res.status(404).json({ error: "Az oldal nem található." });
    }

    res.json(page);
  } catch (error) {
    console.error("Admin oldal betöltési hiba:", error);
    res.status(500).json({ error: "Hiba történt az oldal betöltésekor." });
  }
}

export const createPage = async (req, res) => {
  try {
    const page = await prisma.$transaction((transaction) =>
      createPageWithTemplate(transaction, req.body)
    );

    res.status(201).json(page);
  } catch (error) {
    if (error instanceof PageCreationValidationError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    if (error.code === "P2002") {
      return res.status(409).json({ message: "Már létezik oldal ezzel a sluggal." });
    }
    console.error("Oldal létrehozási hiba:", error);
    res.status(500).json({ error: "Hiba történt az oldal létrehozásakor." });
  }
}

export const updatePage = async (req, res) => {
  try {
    const { title, slug, published, metaTitle, metaDescription } = req.body;

    const currentPage = await prisma.page.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!currentPage) {
      return res.status(404).json({ message: "Az oldal nem található." });
    }

    const finalSlug = slug !== undefined ? slugifyPage(slug) : currentPage.slug;
    const page = await prisma.page.update({
      where: {
        id: req.params.id,
      },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(slug !== undefined && { slug: finalSlug }),
        ...(published !== undefined && { published }),
        ...(metaTitle !== undefined && { metaTitle: metaTitle?.trim() || null }),
        ...(metaDescription !== undefined && { metaDescription: metaDescription?.trim() || null }),
      },
    });

    res.json(page);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Már létezik oldal ezzel a sluggal." });
    }
    console.error("Oldal módosítási hiba:", error);
    res.status(500).json({ error: "Hiba történt az oldal módosításakor." });
  }
}

export const deletePage = async (req, res) => {
  try {
    const page = await prisma.page.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!page) {
      return res.status(404).json({ message: "Az oldal nem található." });
    }

    await prisma.page.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Oldal törlési hiba:", error);
    res.status(500).json({ error: "Hiba történt az oldal törlésekor." });
  }
};
