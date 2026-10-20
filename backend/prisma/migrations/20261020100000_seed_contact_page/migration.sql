-- Create the editable contact page used by the fixed /kapcsolat navbar item.
-- Existing page content is preserved; the custom block is only inserted when missing.
DO $$
DECLARE
    contact_page_id TEXT;
BEGIN
    SELECT "id"
      INTO contact_page_id
      FROM "Page"
     WHERE "slug" = 'kapcsolat'
     LIMIT 1;

    IF contact_page_id IS NULL THEN
        contact_page_id := '1edb50bd-09ee-4d64-a256-19fdb3910e78';

        INSERT INTO "Page" (
            "id", "title", "slug", "published", "metaTitle", "metaDescription",
            "createdAt", "updatedAt"
        )
        VALUES (
            contact_page_id,
            'Kapcsolat',
            'kapcsolat',
            true,
            'Kapcsolat | Erkel Ferenc AMI',
            'A Tatabányai Erkel Ferenc Alapfokú Művészeti Iskola elérhetőségei és kapcsolattartói.',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1
          FROM "PageSection"
         WHERE "pageId" = contact_page_id
           AND "type" = 'CONTACT_INFO'
    ) THEN
        INSERT INTO "PageSection" (
            "id", "pageId", "type", "content", "sortOrder", "visible",
            "createdAt", "updatedAt"
        )
        VALUES (
            '1e17ed91-f05d-42fb-8fe1-6d667d4d80a7',
            contact_page_id,
            'CONTACT_INFO',
            $json$
            {
              "institutionName": "Tatabányai Erkel Ferenc Alapfokú Művészeti Iskola",
              "address": "2800 Tatabánya, Fő tér 34.",
              "coordinates": "47.582289, 18.398334",
              "phones": ["34/311-238", "30/214-3243"],
              "generalEmail": "info@erkelzistb.hu",
              "website": "www.erkelzistb.hu",
              "contacts": [
                {
                  "position": "Intézményvezető",
                  "name": "Pereszlényiné Kovács Judit",
                  "email": "info@erkelzistb.hu"
                },
                {
                  "position": "Intézményvezető-helyettes",
                  "name": "Kiss Szilvia",
                  "email": "info@erkelzistb.hu"
                },
                {
                  "position": "Intézményvezető-helyettes",
                  "name": "Kerti István",
                  "email": "kerti.istván@erkelzistb.hu"
                },
                {
                  "position": "Iskolatitkár",
                  "name": "Grenitzer Krisztina",
                  "email": "info@erkelzistb.hu"
                }
              ],
              "privacyOfficer": {
                "name": "Dr. Lórodi László",
                "organization": "Reé Consulting Nonprofit Kft.",
                "address": "8000 Székesfehérvár, Várkörút 4. II/26.",
                "email": "dpo@reeconsulting.eu"
              },
              "style": {
                "background": "white",
                "width": "wide",
                "spacing": "large",
                "textAlign": "left"
              }
            }
            $json$::jsonb,
            (SELECT COALESCE(MAX("sortOrder"), -1) + 1 FROM "PageSection" WHERE "pageId" = contact_page_id),
            true,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END IF;
END $$;
