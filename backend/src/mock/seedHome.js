import prisma from "../lib/prisma.js";

async function main() {
  const highlights = await prisma.homeSection.create({
    data: {
      key: "HIGHLIGHTS",
      title: "Aktuális információk",
      type: "CARD_GRID",
      sortOrder: 1,
      items: {
        create: [
          {
            title: "Szolfézs csoportok és órarend",
            description: "A 2026/2027-es tanév szolfézs csoportjai és órarendje.",
            imageUrl: null,
            linkUrl: "/szolfezs",
            buttonText: "Megnézem",
            sortOrder: 1,
          },
          {
            title: "Zeneiskolai koncertjeink",
            description: "Koncertfelvételeink és videóink.",
            imageUrl: null,
            linkUrl: "/koncertek",
            buttonText: "Videók",
            sortOrder: 2,
          },
          {
            title: "Hírek rólunk",
            description: "Legfrissebb hírek és aktualitások.",
            imageUrl: null,
            linkUrl: "/hirek",
            buttonText: "Tovább",
            sortOrder: 3,
          },
        ],
      },
    },
  });

  const featured = await prisma.homeSection.create({
    data: {
      key: "FEATURED",
      title: null,
      type: "FEATURE_GRID",
      sortOrder: 2,
      items: {
        create: [
          {
            title: "Tanévnyitó információk 2026/2027",
            description: "Fontos tudnivalók az új tanév kezdéséről.",
            linkUrl: "/tanevnyito",
            buttonText: "Részletek",
            sortOrder: 1,
          },
          {
            title: "KRÉTA",
            description: "Belépés az elektronikus ügyintézési rendszerbe.",
            linkUrl: "https://e-kreta.hu",
            buttonText: "Belépés",
            sortOrder: 2,
          },
        ],
      },
    },
  });

  console.log("Homepage tesztadatok létrehozva.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });