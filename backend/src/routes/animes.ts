import express, { Request, Response } from "express";

import {
  getAnimes,
  getAnime,
  createAnime,
  deleteAnime,
  updateAnime,
} from "../controllers/animeController";

const router = express.Router();

// GET all animes
router.get("/", getAnimes);

// GET a single anime
router.get("/:id", getAnime);

// POST a new anime
router.post("/", createAnime);

// DELETE a anime
router.delete("/:id", deleteAnime);

// UPDATE a anime
router.patch("/:id", updateAnime);

export default router;
