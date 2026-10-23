UPDATE "PageSection"
SET "type" = 'CONCERT_ARCHIVE'
WHERE "pageId" = (
  SELECT "id"
  FROM "Page"
  WHERE "slug" = 'zeneiskolai-koncertjeink'
)
AND "type" = 'TEXT';

