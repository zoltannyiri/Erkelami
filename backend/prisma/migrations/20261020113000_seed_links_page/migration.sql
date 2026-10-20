-- Create the editable links page used by the fixed /linkek navbar item.
-- Existing page content is preserved; the custom block is only inserted when missing.
DO $$
DECLARE
    links_page_id TEXT;
BEGIN
    SELECT "id"
      INTO links_page_id
      FROM "Page"
     WHERE "slug" = 'linkek'
     LIMIT 1;

    IF links_page_id IS NULL THEN
        links_page_id := '2fb4dc5d-28a4-4719-88bc-6eb760a7f61d';

        INSERT INTO "Page" (
            "id", "title", "slug", "published", "metaTitle", "metaDescription",
            "createdAt", "updatedAt"
        )
        VALUES (
            links_page_id,
            'Linkek',
            'linkek',
            true,
            'Linkek | Erkel Ferenc AMI',
            'Hasznos oktatási, zenei és kulturális oldalak a Tatabányai Erkel Ferenc Alapfokú Művészeti Iskola ajánlásával.',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1
          FROM "PageSection"
         WHERE "pageId" = links_page_id
           AND "type" = 'LINK_DIRECTORY'
    ) THEN
        INSERT INTO "PageSection" (
            "id", "pageId", "type", "content", "sortOrder", "visible",
            "createdAt", "updatedAt"
        )
        VALUES (
            'b60a5ba3-150e-414d-aa65-2489d7fcd518',
            links_page_id,
            'LINK_DIRECTORY',
            $json$
            {
              "heading": "Fontos linkek",
              "intro": "Hasznos oktatási, zenei és kulturális oldalak egy helyen.",
              "links": [
                {
                  "title": "Klebelsberg Központ",
                  "url": "https://kk.gov.hu",
                  "description": "A magyarországi tankerületi központok szakmai és fenntartói központja."
                },
                {
                  "title": "Nemzeti Pedagógus Kar",
                  "url": "https://www.nemzetipedkar.hu",
                  "description": "A köznevelésben dolgozó pedagógusok szakmai köztestülete."
                },
                {
                  "title": "Magyar Zeneművészek és Táncművészek Szakszervezete",
                  "url": "https://www.mztsz.hu",
                  "description": "A zene- és táncművészeti területen dolgozók szakmai érdekképviselete."
                },
                {
                  "title": "Liszt Ferenc Zeneművészeti Egyetem",
                  "url": "https://www.zeneakademia.hu",
                  "description": "A magyar zenei felsőoktatás és koncertélet meghatározó intézménye."
                },
                {
                  "title": "Müpa Budapest",
                  "url": "https://mupa.hu",
                  "description": "Hangversenyek, előadások és kulturális programok Budapesten."
                },
                {
                  "title": "Magyar Állami Operaház",
                  "url": "https://www.opera.hu",
                  "description": "Opera- és balettelőadások, műsorok és intézményi hírek."
                },
                {
                  "title": "Parlando",
                  "url": "https://www.parlando.hu",
                  "description": "Zenepedagógiai folyóirat tanulmányokkal, hírekkel és módszertani anyagokkal."
                },
                {
                  "title": "Fidelio",
                  "url": "https://fidelio.hu",
                  "description": "Kulturális magazin zenei, színházi és művészeti hírekkel."
                },
                {
                  "title": "Tatabányai Múzeum",
                  "url": "https://www.tbmuzeum.hu",
                  "description": "Tatabánya történetét és kulturális örökségét bemutató intézmény."
                },
                {
                  "title": "A Vértes Agorája",
                  "url": "https://www.avertesagoraja.hu",
                  "description": "Tatabánya kulturális központjának programjai és közösségi eseményei."
                },
                {
                  "title": "Kulturális és Innovációs Minisztérium",
                  "url": "https://kormany.hu/kulturalis-es-innovacios-miniszterium",
                  "description": "A kultúráért, innovációért, felsőoktatásért és szakképzésért felelős minisztérium."
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
            (SELECT COALESCE(MAX("sortOrder"), -1) + 1 FROM "PageSection" WHERE "pageId" = links_page_id),
            true,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END IF;
END $$;
