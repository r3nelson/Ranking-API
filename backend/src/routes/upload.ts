import express from "express";
import { uploadFile, uploadMiddleware } from "../controllers/uploadController";

const router = express.Router();

// File upload route
router.post("/upload", uploadMiddleware, uploadFile);

export default router;
