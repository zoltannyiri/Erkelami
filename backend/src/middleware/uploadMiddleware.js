import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB
  },
});

export const uploadSingleFile = (req, res, next) => {
  upload.single('file')(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "A fájl túl nagy. A maximális méret 25 MB." });
      }

      return res.status(400).json({ message: "Hiba történt a fájl feldolgozásakor." });
    }

    if (error) {
      return res.status(400).json({ message: "A fájl nem dolgozható fel." });
    }

    next();
  });
};