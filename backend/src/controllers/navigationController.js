import prisma from "../lib/prisma.js";

const buildTree = (items, parentId = null) => {
  return items
    .filter((item) => item.parentId === parentId)
    .map((item) => ({
      id: item.id,
      label: item.label,
      url: item.externalUrl || (item.page ? `/${item.page.slug}` : null),
      external: Boolean(item.externalUrl),
      sortOrder: item.sortOrder,
      children: buildTree(items, item.id),
    }))
};

export const getNavigation = async (req, res) => {
  try {
    const { menuKey } = req.query;
    const items = await prisma.navigationItem.findMany({
      where: {
        visible: true,
        ...(menuKey && { menuKey }),
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

    const tree = buildTree(items);

    // const navigation = items.map((item) => ({
    //   id: item.id,
    //   label: item.label,
    //   url: item.externalUrl ? item.externalUrl : item.page ? `/${item.page.slug}` : null,
    //   external: Boolean(item.externalUrl),
    // }));

    res.json(tree);
  } catch (error) {
      console.error("Navigation error:", error);
      res.status(500).json({ message: "Hiba történt a navigációs adatok lekérésekor." 
    });
  }
};