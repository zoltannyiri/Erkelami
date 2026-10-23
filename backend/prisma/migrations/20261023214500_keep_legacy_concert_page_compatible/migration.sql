-- Keep the existing page readable by the currently deployed frontend.
-- The new frontend recognizes this legacy TEXT block as a concert archive,
-- while newly created concert blocks use CONCERT_ARCHIVE directly.
UPDATE "PageSection"
SET "type" = 'TEXT'
WHERE "pageId" = (
  SELECT "id"
  FROM "Page"
  WHERE "slug" = 'zeneiskolai-koncertjeink'
)
AND "type" = 'CONCERT_ARCHIVE';

