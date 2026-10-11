import prisma from "../lib/prisma.js";
import {
  DYNAMIC_NAVBAR_MENU_KEY,
  NAVBAR_MENUS,
  NAVBAR_MENU_KEYS,
} from "../config/navigationMenus.js";

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
    const { menuKey, grouped } = req.query;
    const items = await prisma.navigationItem.findMany({
      where: {
        visible: true,
        ...(menuKey
          ? { menuKey }
          : grouped === "true"
            ? { menuKey: { in: NAVBAR_MENU_KEYS } }
            : {}),
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

    if (grouped === "true") {
      const menuGroups = Object.fromEntries(
        NAVBAR_MENUS.map(({ menuKey: configuredMenuKey }) => [
          configuredMenuKey,
          buildTree(
            items.filter((item) => item.menuKey === configuredMenuKey)
          ),
        ])
      );

      menuGroups[DYNAMIC_NAVBAR_MENU_KEY] = buildTree(
        items.filter((item) => item.menuKey === DYNAMIC_NAVBAR_MENU_KEY)
      );

      return res.json(menuGroups);
    }

    const tree = buildTree(items);

    res.json(tree);
  } catch (error) {
      console.error("Navigation error:", error);
      res.status(500).json({ message: "Hiba történt a navigációs adatok lekérésekor." 
    });
  }
};
