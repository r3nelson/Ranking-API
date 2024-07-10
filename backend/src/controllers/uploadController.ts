import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// Set up storage for Multer
const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    // cb(null, Date.now() + path.extname(file.originalname));
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// File upload handler
export const uploadFile = (req: Request, res: Response) => {
  try {
    res.status(200).send("File uploaded successfully!");
  } catch (error) {
    res.status(500).send("File upload failed");
  }
};

// Export multer upload middleware
export const uploadMiddleware = upload.single("file");
