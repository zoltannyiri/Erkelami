import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { UPLOADS_DIR } from "../../config/paths.js";

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

const getBaseUrl = () => {
  const url = process.env.PUBLIC_BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`;
  return url.replace(/\/+$/, "");
};

export const uploadFile = async ({ file, category }) => {
  const folderName = getFolderName(category);
  const targetDirectory = path.join(UPLOADS_DIR, folderName);
  
  await fs.mkdir(targetDirectory, { recursive: true });

  const extension = path.extname(file.originalname).toLowerCase();
  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  const targetPath = path.join(targetDirectory, fileName);

  await fs.writeFile(targetPath, file.buffer);

  const baseUrl = getBaseUrl();

  return {
    url: `${baseUrl}/uploads/${folderName}/${fileName}`,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    category,
  };
};
