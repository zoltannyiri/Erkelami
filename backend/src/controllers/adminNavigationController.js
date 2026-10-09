import prisma from "../lib/prisma.js";
import {
  createPageWithTemplate,
  PageCreationValidationError,
} from "../services/pageCreationService.js";

const buildTree = (items, parentId = null) =>
  items
    .filter((item) => item.parentId === parentId)
    .map((item) => ({
      ...item,
      children: buildTree(items, item.id),
    }));

const createsCycle = async (itemId, parentId) => {
  let currentParentId = parentId;

  while (currentParentId) {
    if (currentParentId === itemId) {
      return true;
    }

    const parent = await prisma.navigationItem.findUnique({
      where: {
        id: currentParentId,
      },
      select: {
        parentId: true,
      },
    });

    if (!parent) {
      return false;
    }

    currentParentId = parent.parentId;
  }

  return false;
};

export const getAdminNavigation = async (req, res) => {
  try {
    const items = await prisma.navigationItem.findMany({
      include: {
        page: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: [
        {
          menuKey: "asc",
        },
        {
          sortOrder: "asc",
        },
      ],
    });

    const groups = {};

    for (const item of items) {
      if (!groups[item.menuKey]) {
        groups[item.menuKey] = [];
      }

      groups[item.menuKey].push(item);
    }

    const result = Object.entries(groups).map(
      ([menuKey, groupItems]) => ({
        menuKey,
        items: buildTree(groupItems),
      })
    );

    res.json(result);
  } catch (error) {
    console.error("Admin navigation betöltési hiba:", error);

    res.status(500).json({
      message: "Hiba történt a navigáció betöltésekor.",
    });
  }
};

export const createNavigationItem = async (req, res) => {
  try {
    const {
      label,
      menuKey = "TOP_LEVEL",
      parentId = null,
      pageId = null,
      externalUrl = null,
      newPage = null,
      visible = true,
    } = req.body;

    if (!label?.trim()) {
      return res.status(400).json({
        message: "A menüpont neve kötelező.",
      });
    }

    if (newPage && (typeof newPage !== "object" || Array.isArray(newPage))) {
      return res.status(400).json({
        message: "Az új oldal adatai érvénytelenek.",
      });
    }

    const finalExternalUrl = externalUrl?.trim() || null;
    const targetCount = [pageId, finalExternalUrl, newPage].filter(Boolean).length;

    if (targetCount > 1) {
      return res.status(400).json({
        message:
          "Egy menüpontnak csak egy célja lehet: meglévő oldal, új oldal vagy külső link.",
      });
    }

    let finalMenuKey = menuKey;

    if (parentId) {
      const parent = await prisma.navigationItem.findUnique({
        where: {
          id: parentId,
        },
      });

      if (!parent) {
        return res.status(404).json({
          message: "A szülő menüpont nem található.",
        });
      }

      // A gyerek ugyanahhoz a menühöz tartozzon, mint a szülő.
      finalMenuKey = parent.menuKey;
    }

    if (pageId) {
      const page = await prisma.page.findUnique({
        where: {
          id: pageId,
        },
      });

      if (!page) {
        return res.status(404).json({
          message: "A kiválasztott oldal nem található.",
        });
      }
    }

    const item = await prisma.$transaction(async (transaction) => {
      let finalPageId = pageId;

      if (newPage) {
        const createdPage = await createPageWithTemplate(transaction, {
          ...newPage,
          title: newPage.title?.trim() || label.trim(),
          published: Boolean(visible),
        });

        finalPageId = createdPage.id;
      }

      const lastItem = await transaction.navigationItem.findFirst({
        where: {
          menuKey: finalMenuKey,
          parentId,
        },
        orderBy: {
          sortOrder: "desc",
        },
      });

      return transaction.navigationItem.create({
        data: {
          label: label.trim(),
          menuKey: finalMenuKey,
          parentId,
          pageId: finalPageId,
          externalUrl: finalExternalUrl,
          visible,
          sortOrder: lastItem ? lastItem.sortOrder + 1 : 0,
        },
        include: {
          page: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      });
    });

    res.status(201).json(item);
  } catch (error) {
    if (error instanceof PageCreationValidationError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Már létezik oldal ezzel a sluggal.",
      });
    }

    console.error("Navigation item létrehozási hiba:", error);

    res.status(500).json({
      message: "Hiba történt a menüpont létrehozásakor.",
    });
  }
};

export const updateNavigationItem = async (req, res) => {
  try {
    const { id } = req.params;

    const current = await prisma.navigationItem.findUnique({
      where: {
        id,
      },
    });

    if (!current) {
      return res.status(404).json({
        message: "A menüpont nem található.",
      });
    }

    const hasParentId = Object.prototype.hasOwnProperty.call(
      req.body,
      "parentId"
    );

    const hasPageId = Object.prototype.hasOwnProperty.call(
      req.body,
      "pageId"
    );

    const hasExternalUrl = Object.prototype.hasOwnProperty.call(
      req.body,
      "externalUrl"
    );

    let parentId = hasParentId
      ? req.body.parentId || null
      : current.parentId;

    let menuKey = req.body.menuKey ?? current.menuKey;

    if (parentId === id) {
      return res.status(400).json({
        message: "Egy menüpont nem lehet saját maga szülője.",
      });
    }

    if (parentId) {
      const parent = await prisma.navigationItem.findUnique({
        where: {
          id: parentId,
        },
      });

      if (!parent) {
        return res.status(404).json({
          message: "A szülő menüpont nem található.",
        });
      }

      if (await createsCycle(id, parentId)) {
        return res.status(400).json({
          message: "A kiválasztott szülő körkörös menüstruktúrát hozna létre.",
        });
      }

      menuKey = parent.menuKey;
    }

    let pageId = hasPageId
      ? req.body.pageId || null
      : current.pageId;

    let externalUrl = hasExternalUrl
      ? req.body.externalUrl?.trim() || null
      : current.externalUrl;

    if (
      hasPageId &&
      hasExternalUrl &&
      pageId &&
      externalUrl
    ) {
      return res.status(400).json({
        message:
          "Egy menüpont egyszerre nem mutathat oldalra és külső linkre.",
      });
    }

    if (hasPageId && pageId) {
      const page = await prisma.page.findUnique({
        where: {
          id: pageId,
        },
      });

      if (!page) {
        return res.status(404).json({
          message: "A kiválasztott oldal nem található.",
        });
      }

      externalUrl = null;
    }

    if (hasExternalUrl && externalUrl) {
      pageId = null;
    }

    let sortOrder = current.sortOrder;

    const scopeChanged =
      parentId !== current.parentId ||
      menuKey !== current.menuKey;

    if (scopeChanged) {
      const lastItem = await prisma.navigationItem.findFirst({
        where: {
          menuKey,
          parentId,
          id: {
            not: id,
          },
        },
        orderBy: {
          sortOrder: "desc",
        },
      });

      sortOrder = lastItem
        ? lastItem.sortOrder + 1
        : 0;
    }

    const item = await prisma.navigationItem.update({
      where: {
        id,
      },
      data: {
        ...(req.body.label !== undefined && {
          label: req.body.label.trim(),
        }),

        menuKey,
        parentId,
        pageId,
        externalUrl,
        sortOrder,

        ...(req.body.visible !== undefined && {
          visible: req.body.visible,
        }),
      },
      include: {
        page: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    res.json(item);
  } catch (error) {
    console.error("Navigation item módosítási hiba:", error);

    res.status(500).json({
      message: "Hiba történt a menüpont módosításakor.",
    });
  }
};

export const deleteNavigationItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await prisma.navigationItem.findUnique({
      where: {
        id,
      },
    });

    if (!item) {
      return res.status(404).json({
        message: "A menüpont nem található.",
      });
    }

    await prisma.navigationItem.delete({
      where: {
        id,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Navigation item törlési hiba:", error);

    res.status(500).json({
      message: "Hiba történt a menüpont törlésekor.",
    });
  }
};

export const reorderNavigationItems = async (req, res) => {
  try {
    const { itemIds } = req.body;

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      return res.status(400).json({
        message: "Az itemIds mezőnek nem üres tömbnek kell lennie.",
      });
    }

    const items = await prisma.navigationItem.findMany({
      where: {
        id: {
          in: itemIds,
        },
      },
    });

    if (items.length !== itemIds.length) {
      return res.status(400).json({
        message: "Érvénytelen menüpont lista.",
      });
    }

    const first = items[0];

    const sameScope = items.every(
      (item) =>
        item.menuKey === first.menuKey &&
        item.parentId === first.parentId
    );

    if (!sameScope) {
      return res.status(400).json({
        message:
          "Csak azonos szinten lévő menüpontok rendezhetők egyszerre.",
      });
    }

    await prisma.$transaction(
      itemIds.map((itemId, index) =>
        prisma.navigationItem.update({
          where: {
            id: itemId,
          },
          data: {
            sortOrder: index,
          },
        })
      )
    );

    res.json({
      message: "Sorrend frissítve.",
    });
  } catch (error) {
    console.error("Navigation sorrend módosítási hiba:", error);

    res.status(500).json({
      message: "Hiba történt a sorrend módosításakor.",
    });
  }
};
