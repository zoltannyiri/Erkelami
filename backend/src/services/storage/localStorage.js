import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const UPLOAD_ROOT = path.resolve(process.cwd(), "../web/public/uploads");

const getFolderName = (category) => {
  switch (category) {
    case "image":
      return "images";

    case "document":
      return "documents";

    case "video":
      return "videos";

    default:
      throw new Error(`Unknown category: ${category}`);
  }
};

export const uploadFile = async ({ file, category }) => {
  const folderName = getFolderName(category);
  const targetDirectory = path.join(UPLOAD_ROOT, folderName);
  await fs.mkdir(targetDirectory, {recursive: true});
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  const targetPath = path.join(targetDirectory, fileName);
  await fs.writeFile(targetPath, file.buffer);
  return {
    url: `/uploads/${folderName}/${fileName}`,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    category,
  };
};
