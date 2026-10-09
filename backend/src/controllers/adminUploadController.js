import path from 'node:path';
import { uploadFile } from '../services/storage/index.js';

const FILE_RULES = {
  image: {
    maxSize: 10 * 1024 * 1024, // 10 MB
    extensions: new Set([".jpg", ".jpeg", ".png", ".webp"]),
    mimeTypes: new Set(["image/jpeg", "image/png", "image/webp"]),
  },

  document: {
    maxSize: 25 * 1024 * 1024, // 25 MB
    extensions: new Set([".pdf", ".doc", ".docx", ".txt", ".xls", ".xlsx", ".zip"]),
    mimeTypes: new Set([
      "application/pdf",

      "application/msword",

      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

      "application/vnd.ms-excel",

      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

      "application/zip",
      "application/x-zip-compressed",
    ]),
  },
};

const getFileType = (extension) => {
  const types = {
    ".pdf": "PDF",
    ".doc": "DOC",
    ".docx": "DOCX",
    ".txt": "TXT",
    ".xls": "XLS",
    ".xlsx": "XLSX",
    ".zip": "ZIP",
  };
  return types[extension] || "OTHER";
};

export const uploadAdminFile = async (req, res) => {
  try {
    const { category } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Nincs feltöltött fájl." });
    }
    if (!FILE_RULES[category]) {
      return res.status(400).json({ message: "Érvénytelen fájlkategória." });
    }
    const rules = FILE_RULES[category];
    const extension = path
      .extname(req.file.originalname)
      .toLowerCase();
    
    if (!rules.extensions.has(extension)) {
      return res.status(400).json({
        message: "Ez a fájlkiterjesztés nem engedélyezett.",
      });
    }

    if (!rules.mimeTypes.has(req.file.mimetype)) {
      return res.status(400).json({ message: "Ez a fájltípus nem engedélyezett." });
    }

    if (req.file.size > rules.maxSize) {
      return res.status(400).json({
        message: category === "image" ? "A kép maximális mérete 10 MB." : "A dokumentum maximális mérete 25 MB.",
      });
    }

    const result = await uploadFile({ file: req.file, category });

    res.status(201).json({
      ...result,
      ...(category === "document" ? { fileType: getFileType(extension) } : {}),
    });
  } catch (error) {
    console.error("Fájlfeltöltési hiba:", error);
    res.status(500).json({ message: "Hiba történt a fájl feltöltése során." });
  }
}; 