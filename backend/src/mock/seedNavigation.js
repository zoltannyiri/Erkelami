import prisma from "../lib/prisma.js";

async function main() {
  // Tesztoldalak
  const zongoraPage = await prisma.page.upsert({
    where: {
      slug: "zongora-eredmenyek",
    },
    update: {},
    create: {
      title: "Zongora eredmények",
      slug: "zongora-eredmenyek",
    },
  });

  const koncertPage = await prisma.page.upsert({
    where: {
      slug: "koncertek-2025-26",
    },
    update: {},
    create: {
      title: "Koncertek 2025/26",
      slug: "koncertek-2025-26",
    },
  });

  // 1. szint
  const season = await prisma.navigationItem.create({
    data: {
      label: "2025/26",
      sortOrder: 1,
      menuKey: "SUCCESSES",
    },
  });

  // 2. szint
  const competitions = await prisma.navigationItem.create({
    data: {
      label: "Versenyek",
      sortOrder: 1,
      menuKey: "SUCCESSES",
      parentId: season.id,
    },
  });

  // 3. szint
  await prisma.navigationItem.create({
    data: {
      label: "Zongora",
      sortOrder: 1,
      menuKey: "SUCCESSES",
      parentId: competitions.id,
      pageId: zongoraPage.id,
    },
  });

  // 2. szint
  await prisma.navigationItem.create({
    data: {
      label: "Koncertek",
      sortOrder: 2,
      menuKey: "SUCCESSES",
      parentId: season.id,
      pageId: koncertPage.id,
    },
  });

  console.log("Teszt navigáció létrehozva.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });