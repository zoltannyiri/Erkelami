-- Create the editable staff directory page and add it to the Iskolánkról menu.
-- Existing administrator-created content is preserved.
DO $$
DECLARE
    staff_page_id TEXT;
    staff_section_id TEXT;
BEGIN
    SELECT "id"
      INTO staff_page_id
      FROM "Page"
     WHERE "slug" = 'tanaraink-alkalmazottaink'
     LIMIT 1;

    IF staff_page_id IS NULL THEN
        staff_page_id := '8935fda6-6445-472d-89ad-539d9879c77f';

        INSERT INTO "Page" (
            "id", "title", "slug", "published", "metaTitle", "metaDescription",
            "createdAt", "updatedAt"
        )
        VALUES (
            staff_page_id,
            'Tanáraink, alkalmazottaink',
            'tanaraink-alkalmazottaink',
            true,
            'Tanáraink, alkalmazottaink | Erkel Ferenc AMI',
            'A Tatabányai Erkel Ferenc Alapfokú Művészeti Iskola tanárainak és munkatársainak névsora.',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END IF;

    SELECT "id"
      INTO staff_section_id
      FROM "PageSection"
     WHERE "pageId" = staff_page_id
       AND "type" = 'STAFF_DIRECTORY'
     ORDER BY "createdAt"
     LIMIT 1;

    IF staff_section_id IS NULL THEN
        INSERT INTO "PageSection" (
            "id", "pageId", "type", "content", "sortOrder", "visible",
            "createdAt", "updatedAt"
        )
        VALUES (
            '42050ddc-602e-4af4-af4c-f1e67d41454b',
            staff_page_id,
            'STAFF_DIRECTORY',
            $json$
            {
              "academicYear": "2026/2027",
              "intro": "Iskolánk pedagógusai és munkatársai közösen dolgoznak azért, hogy minden növendék biztos szakmai alapokat és személyes figyelmet kapjon.",
              "groups": [
                {
                  "title": "Vezetőség",
                  "featured": true,
                  "members": [
                    { "name": "Pereszlényiné Kovács Judit", "role": "igazgató, fuvola" },
                    { "name": "Kiss Szilvia", "role": "igazgatóhelyettes, zongora, szolfézs" },
                    { "name": "Kerti István", "role": "igazgatóhelyettes, klarinét" }
                  ]
                },
                {
                  "title": "Pedagógusok",
                  "featured": false,
                  "members": [
                    { "name": "Bánfi Krisztina", "role": "fafúvó" },
                    { "name": "Demeniv Igor", "role": "harmonika" },
                    { "name": "Forgácsné Szayer Éva", "role": "zongora" },
                    { "name": "Juhász Zoltán Árpád", "role": "gitár, jazz-gitár" },
                    { "name": "Keresztesi Anikó", "role": "hegedű" },
                    { "name": "Kiss András", "role": "klarinét, szintetizátor" },
                    { "name": "Laskay Péter", "role": "ütő, jazz-dob" },
                    { "name": "Laskay Zsolt Géza", "role": "szintetizátor, klarinét" },
                    { "name": "Laskay Zsoltné", "role": "hegedű" },
                    { "name": "Lázár Nóra", "role": "fuvola" },
                    { "name": "Nagy Ildikó", "role": "fuvola" },
                    { "name": "Nagy Kristóf", "role": "rézfúvó" },
                    { "name": "Ocskai Gabriella", "role": "zongora, korrepetíció" },
                    { "name": "Radis Afrodite", "role": "népi ének" },
                    { "name": "Radvan Eszter", "role": "magánének" },
                    { "name": "Román Géza", "role": "rézfúvó" },
                    { "name": "Rózsa Beáta", "role": "zongora, korrepetíció" },
                    { "name": "Ruska Anett", "role": "hegedű" },
                    { "name": "Sági Balázs", "role": "zongora, korrepetíció" },
                    { "name": "Sárközyné Pomázi Ágnes", "role": "szolfézs" },
                    { "name": "Schäffer László", "role": "gitár" },
                    { "name": "Simó Anna", "role": "fuvola" },
                    { "name": "Somorjai Ildikó", "role": "zongora" },
                    { "name": "Szabóné Lakatos Judit", "role": "szolfézs" },
                    { "name": "Szalacsovis Sándor", "role": "zongora, korrepetíció" },
                    { "name": "Szicsó István", "role": "rézfúvó, fúvószenekar" },
                    { "name": "Tóth Mónika", "role": "szolfézs" },
                    { "name": "Varga Eszter", "role": "oboa, furulya" },
                    { "name": "Weisz Péter", "role": "gordonka, vonószenekar" },
                    { "name": "Weiszné Romhányi Krisztina", "role": "hegedű, szolfézs" }
                  ]
                },
                {
                  "title": "Tartósan távol",
                  "featured": false,
                  "members": [
                    { "name": "Cseh-Molnár Johanna", "role": "szolfézs" }
                  ]
                },
                {
                  "title": "Nevelést és oktatást közvetlenül segítők",
                  "featured": false,
                  "members": [
                    { "name": "Grenitzer Krisztina", "role": "iskolatitkár" },
                    { "name": "Kovács Zsigmondné", "role": "hivatalsegéd" },
                    { "name": "Hegedűsné Perjési Ilona", "role": "hivatalsegéd" },
                    { "name": "Bernáth Beatrix", "role": "hivatalsegéd" },
                    { "name": "Lanka Lajos", "role": "gondnok" }
                  ]
                }
              ],
              "style": {
                "background": "white",
                "width": "wide",
                "spacing": "large",
                "textAlign": "left"
              }
            }
            $json$::jsonb,
            0,
            true,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1
          FROM "NavigationItem"
         WHERE "menuKey" = 'ABOUT'
           AND "parentId" IS NULL
           AND LOWER(TRIM("label")) = LOWER('Tanáraink, alkalmazottaink')
    ) THEN
        INSERT INTO "NavigationItem" (
            "id", "label", "sortOrder", "visible", "menuKey", "parentId",
            "pageId", "externalUrl", "createdAt", "updatedAt"
        )
        VALUES (
            '2c649735-f3df-4b88-bb5a-871d358562bd',
            'Tanáraink, alkalmazottaink',
            (SELECT COALESCE(MAX("sortOrder"), -1) + 1
               FROM "NavigationItem"
              WHERE "menuKey" = 'ABOUT' AND "parentId" IS NULL),
            true,
            'ABOUT',
            NULL,
            staff_page_id,
            NULL,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END IF;
END $$;
