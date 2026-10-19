-- Seed the editable "Iskolánkról > Tanszakok" navigation tree.
-- The guards make this safe when an administrator already created some items.
DO $$
DECLARE
    departments_id TEXT;
BEGIN
    SELECT "id"
      INTO departments_id
      FROM "NavigationItem"
     WHERE "menuKey" = 'ABOUT'
       AND "parentId" IS NULL
       AND LOWER(TRIM("label")) = LOWER('Tanszakok')
     ORDER BY "createdAt"
     LIMIT 1;

    IF departments_id IS NULL THEN
        departments_id := '5e143cb6-6a22-4d38-a588-ce683b52f05a';

        INSERT INTO "NavigationItem" (
            "id", "label", "sortOrder", "visible", "menuKey", "parentId",
            "pageId", "externalUrl", "createdAt", "updatedAt"
        )
        VALUES (
            departments_id,
            'Tanszakok',
            (SELECT COALESCE(MAX("sortOrder"), -1) + 1
               FROM "NavigationItem"
              WHERE "menuKey" = 'ABOUT' AND "parentId" IS NULL),
            true, 'ABOUT', NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END IF;

    INSERT INTO "NavigationItem" (
        "id", "label", "sortOrder", "visible", "menuKey", "parentId",
        "pageId", "externalUrl", "createdAt", "updatedAt"
    )
    SELECT seed."id", seed."label", seed."sortOrder", true, 'ABOUT', departments_id,
           NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      FROM (VALUES
        ('1468fd9c-53f1-4212-90a9-440c24d2f9bc', 'Fafúvós', 0),
        ('20c723f7-e495-421c-bf24-a879ab90c505', 'Rézfúvós', 1),
        ('6b6a6c63-18d7-4a18-b6de-ebfc62d49a64', 'Akkordikus', 2),
        ('47a455af-c55b-443a-aa36-abaa264e498c', 'Billentyűs', 3),
        ('be071032-7979-4f24-bf69-92e48ba02575', 'Vonós', 4),
        ('a417a933-b25c-4d5d-9e93-61623879224f', 'Vokális', 5),
        ('58366a5c-baba-4c9f-a9dd-544fd1245d81', 'Elektroakusztikus', 6),
        ('c87931af-e395-4d06-957a-815f71467407', 'Zeneismeret', 7),
        ('66cab8af-2886-4e20-9874-142b3d848f74', 'Kötelező', 8),
        ('7fcf42bc-5399-4c5a-882d-ac6979df0c59', 'Népzene', 9),
        ('eb482391-7455-4823-8a98-4ed4a13af252', 'Jazz zene', 10),
        ('e80c587e-4798-4ac5-a07e-dbe7085a234c', 'Táncművészet', 11)
      ) AS seed("id", "label", "sortOrder")
     WHERE NOT EXISTS (
        SELECT 1
          FROM "NavigationItem" existing
         WHERE existing."parentId" = departments_id
           AND LOWER(TRIM(existing."label")) = LOWER(seed."label")
     );
END $$;
