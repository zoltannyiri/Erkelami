import prisma from "../lib/prisma.js";

const sourceBaseUrl = "https://www.erkelzistb.hu";

const seasons = [
  {
    label: "2025/26",
    items: [
      ["Ifjúsági gitárverseny \"Luigi Legnani\" Párkány", "/ifjusagi-gitarverseny--luigi-legnani--parkany.html"],
      ["III. Soproni Regionális „Kicsinyek” Fúvós Fesztiválja Horváth Rudolf emlékére", "/iii.-soproni-regionalis--kicsinyek--fuvos-fesztivalja-horvath-rudolf-emlekere.html"],
      ["Szőnyi Erzsébet Regionális Szolfézsverseny", "/sz-nyi-erzsebet-regionalis-szolfezsverseny.html"],
      ["I. Egressy fuvolaverseny, Komárom", "/i.-egressy-fuvolaverseny%2C-komarom.html"],
      ["MENNER BERNÁT és VINCZE IMRE SZÓLÓHANGSZERES ZENEI VERSENY", "/menner-bernat-es-vincze-imre-szolohangszeres-zenei-verseny.html"],
      ["II. KONDOR FERENC SZINTETIZÁTOR-KEYBOARD VERSENY", "/ii.-kondor-ferenc-szintetizator-keyboard-verseny.html"],
      ["VI. Nemzetközi Zongoramesék Zongoraverseny", "/vi.-nemzetkoezi-zongoramesek-zongoraverseny.html"],
      ["V. Komárom-Esztergom Vármegyei Művészeti Iskolák Négykezes Fesztiválja", "/v.-komarom-esztergom-varmegyei-m-veszeti-iskolak-negykezes-fesztivalja.html"],
      ["VI. Egressy Regionális Trombitaverseny", "/vi.-egressy-regionalis-trombitaverseny.html"],
      ["LX. Komárom-Esztergom Vármegyei Zeneiskolák Kamarazene Fesztiválja", "/lx.-komarom-esztergom-varmegyei-zeneiskolak-kamarazene-fesztivalja.html"],
      ["XXI. VÉRTES – DUNAZUG RÉGIÓ ZENEISKOLÁINAK GITÁR VERSENYE", "/xxi.-vertes---dunazug-regio-zeneiskolainak-gitar-versenye-.html"],
      ["III. Zeneiskolai Rézfúvós Fesztivál", "/iii.-zeneiskolai-rezfuvos-fesztival.html"],
      ["„Horváth József” Regionális Vonós és Akkordikus Fesztivál", "/-horvath-jozsef--regionalis-vonos-es-akkordikus-fesztival.html"],
      ["Danubia Talents Nemzetközi Zenei Verseny", "/danubia-talents-nemzetkoezi-zenei-verseny.html"],
      ["Erkel háziverseny", "/erkel-haziverseny.html"],
      ["Hegedű-, brácsa- és gordonkaverseny", "/heged---bracsa--es-gordonkaverseny.html"],
      ["XV. Fafúvós Fesztivál", "/xv.-fafuvos-fesztival.html"],
    ],
  },
  {
    label: "2024/25",
    items: [
      ["V. Nemzetközi Zongoramesék Zongoraverseny", "/v.-nemzetkoezi-zongoramesek-zongoraverseny.html"],
      ["XIV. Szobi Zongoraverseny", "/xiv.-szobi-zongoraverseny.html"],
      ["XV. Országos Kürtverseny", "/xv.-orszagos-kuertverseny.html"],
      ["V. Egressy Regionális Trombitaverseny", "/v.-egressy-regionalis-trombitaverseny.html"],
      ["LIX. Komárom-Esztergom Vármegyei Zeneiskolák Kamarazene Fesztiválja", "/lix.-komarom-esztergom-varmegyei-zeneiskolak-kamarazene-fesztivalja.html"],
      ["XX. Vértes-Dunazug Régió Zeneiskoláinak versenye", "/xx.-vertes-dunazug-regio-zeneiskolainak.html"],
      ["II. Regionális Rézfúvós Fesztivál", "/ii.-regionalis-rezfuvos-fesztival.html"],
      ["XX. Őszi Kortársművészeti Napok", "/xx.--szi-kortarsm-veszeti-napok.html"],
      ["VII. Országos Harmonika Fesztivál", "/vii.-orszagos-harmonika-fesztival.html"],
      ["XII. Komárom-Esztergom Vármegyei Bordács Béla Vonósverseny", "/xii.-komarom-esztergom-varmegyei-bordacs-bela-vonosverseny.html"],
    ],
  },
  {
    label: "2023/24",
    items: [
      ["XIV. Országos Mélyrézfúvós Verseny", "/xiv.-orszagos-melyrezfuvos-verseny.html"],
      ["I. Soproni Regionális „Kicsinyek” Fúvós Fesztiválja", "/i.-soproni-regionalis--kicsinyek--fuvos-fesztivalja.html"],
      ["VIII. Országos Harmonikaverseny", "/viii.-orszagos-harmonikaverseny-.html"],
      ["VIII. Egressy Zongoraverseny", "/viii.-egressy-zongoraverseny.html"],
      ["II. Regionális Fuvola Duó-Trió-Kvartett és Kisegyüttes Fesztivál", "/ii.-regionalis-fuvola-duo-trio--kvartett-es-kisegyuettes-fesztival.html"],
      ["IV. Nemzetközi Zongoramesék Zongoraverseny", "/iv.-nemzetkoezi-zongoramesek-zongoraverseny.html"],
      ["XXXV. Menner Bernát és Vincze Imre", "/xxxv.-menner-bernat-es-vincze-imre-.html"],
      ["IV. Egressy Regionális Trombitaverseny", "/iv.-egressy-regionalis-trombitaverseny-.html"],
      ["LVIII. Komárom-Esztergom Vármegyei Zeneiskolák Kamarazene Fesztiválja", "/lviii.-komarom-esztergom-varmegyei-zeneiskolak-kamarazene-fesztivalja.html"],
      ["XXII. Sistrum Zenei Versenyek", "/xxii.-sistrum-zenei-versenyek.html"],
      ["XIX. Vértes–Dunazug Gitárverseny, Nyergesújfalu", "/xix.-vertes---dunazug-gitar-verseny-nyergesujfalu.html"],
      ["KEM XIV. Fafúvós Fesztivál", "/kem-xiv.-fafuvos-fesztival.html"],
      ["XIX. Őszi Kortársművészeti Napok", "/xix.--szi-kortarsm-veszeti-napok.html"],
    ],
  },
];

async function main() {
  await prisma.$transaction(async (transaction) => {
    // A korábbi tesztadatok megmaradnak, csak kikerülnek a nyilvános menüből.
    // Így a művelet adatvesztés nélkül, szükség esetén visszafordítható.
    await transaction.navigationItem.updateMany({
      where: { menuKey: "SUCCESSES", visible: true },
      data: { visible: false },
    });

    for (const [seasonIndex, season] of seasons.entries()) {
      const existingSeason = await transaction.navigationItem.findFirst({
        where: {
          menuKey: "SUCCESSES",
          parentId: null,
          label: season.label,
        },
        orderBy: { createdAt: "asc" },
      });

      const seasonItem = existingSeason
        ? await transaction.navigationItem.update({
            where: { id: existingSeason.id },
            data: {
              visible: true,
              sortOrder: seasonIndex,
              pageId: null,
              externalUrl: null,
            },
          })
        : await transaction.navigationItem.create({
            data: {
              label: season.label,
              menuKey: "SUCCESSES",
              sortOrder: seasonIndex,
            },
          });

      for (const [itemIndex, [label, path]] of season.items.entries()) {
        const existingItem = await transaction.navigationItem.findFirst({
          where: {
            menuKey: "SUCCESSES",
            parentId: seasonItem.id,
            label,
          },
          orderBy: { createdAt: "asc" },
        });

        const data = {
          label,
          menuKey: "SUCCESSES",
          parentId: seasonItem.id,
          sortOrder: itemIndex,
          visible: true,
          pageId: null,
          externalUrl: `${sourceBaseUrl}${path}`,
        };

        if (existingItem) {
          await transaction.navigationItem.update({
            where: { id: existingItem.id },
            data,
          });
        } else {
          await transaction.navigationItem.create({ data });
        }
      }
    }
  });

  const itemCount = seasons.reduce(
    (total, season) => total + season.items.length,
    0
  );

  console.log(
    `A Sikereink menü elkészült: ${seasons.length} tanév, ${itemCount} bejegyzés.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
