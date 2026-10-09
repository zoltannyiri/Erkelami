import {
  isValidPageTemplateKey,
  PAGE_TEMPLATES,
} from "../config/pageTemplates.js";

export class PageCreationValidationError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "PageCreationValidationError";
    this.statusCode = statusCode;
  }
}

export const slugifyPage = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const createPageWithTemplate = async (
  database,
  {
    title,
    slug,
    published = false,
    metaTitle,
    metaDescription,
    templateKey = "EMPTY",
  }
) => {
  if (!title?.trim()) {
    throw new PageCreationValidationError("A cím megadása kötelező.");
  }

  const finalSlug = slugifyPage(slug?.trim() || title);

  if (!finalSlug) {
    throw new PageCreationValidationError("Érvénytelen slug.");
  }

  if (!isValidPageTemplateKey(templateKey)) {
    throw new PageCreationValidationError("Érvénytelen oldalsablon.");
  }

  const existingPage = await database.page.findUnique({
    where: { slug: finalSlug },
    select: { id: true },
  });

  if (existingPage) {
    throw new PageCreationValidationError(
      "Már létezik oldal ezzel a sluggal."
    );
  }

  const createdPage = await database.page.create({
    data: {
      title: title.trim(),
      slug: finalSlug,
      published,
      metaTitle: metaTitle?.trim() || null,
      metaDescription: metaDescription?.trim() || null,
    },
  });

  const template = PAGE_TEMPLATES[templateKey];

  if (template.sections.length > 0) {
    await database.pageSection.createMany({
      data: template.sections.map((section, sortOrder) => ({
        pageId: createdPage.id,
        type: section.type,
        content: section.content,
        sortOrder,
        visible: true,
      })),
    });
  }

  return createdPage;
};
