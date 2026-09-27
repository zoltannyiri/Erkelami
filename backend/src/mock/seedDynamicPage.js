import prisma from "../lib/prisma.js";

async function main() {
  const page = await prisma.page.upsert({
    where: {
      slug: "iskolank",
    },
    update: {
      title: "Iskolánk",
      published: true,
    },
    create: {
      title: "Iskolánk",
      slug: "iskolank",
      published: true,
    },
  });

  await prisma.pageSection.deleteMany({
    where: {
      pageId: page.id,
    },
  });

  await prisma.pageSection.createMany({
    data: [
      {
        pageId: page.id,
        type: "TEXT",
        sortOrder: 1,
        content: {
          heading: "Bemutatkozás",
          text: "Az Erkel Ferenc Alapfokú Művészeti Iskola bemutatkozó szövege kerül majd ide.",
        },
      },
      {
        pageId: page.id,
        type: "TEXT",
        sortOrder: 2,
        content: {
          heading: "Küldetésünk",
          text: "Célunk a zenei kultúra, a közösség és a tehetséggondozás támogatása.",
        },
      },
    ],
  });

  console.log("Dinamikus tesztoldal létrehozva.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });