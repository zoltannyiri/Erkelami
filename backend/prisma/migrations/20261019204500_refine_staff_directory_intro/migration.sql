-- Keep the directory factual and concise; the introduction remains editable in admin.
UPDATE "PageSection"
   SET "content" = jsonb_set("content", '{intro}', '""'::jsonb, true),
       "updatedAt" = CURRENT_TIMESTAMP
 WHERE "type" = 'STAFF_DIRECTORY'
   AND "pageId" = (
     SELECT "id" FROM "Page" WHERE "slug" = 'tanaraink-alkalmazottaink' LIMIT 1
   );
