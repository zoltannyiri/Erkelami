import prisma from "./lib/prisma.js";

const page = await prisma.page.create({
  data: {
    title: "Iskolánk",
    slug: "iskolank",
  },
});

await prisma.navigationItem.create({
  data: {
    label: "Iskolánk",
    sortOrder: 1,
    visible: true,
    pageId: page.id,
  },
});

console.log("Létrehozva:", page);

await prisma.$disconnect();