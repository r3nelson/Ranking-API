import { Request, Response } from "express";
import Anime from "../models/animeModel";

// GET all animes
export const getAnimes = async (req: Request, res: Response) => {
  try {
    const animes = await Anime.find();
    res.json(animes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET a single anime
export const getAnime = async (req: Request, res: Response) => {
  const animeId = req.params.id;
  try {
    const anime = await Anime.findById(animeId);
    if (!anime) {
      return res.status(404).json({ message: "Anime not found" });
    }
    res.json(anime);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST a new anime
export const createAnime = async (req: Request, res: Response) => {
  try {
    const newAnime = new Anime(req.body);
    await newAnime.save();
    res.status(201).json({ message: "Anime created", data: newAnime });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE a anime
export const deleteAnime = async (req: Request, res: Response) => {
  const animeId = req.params.id;
  try {
    const deletedAnime = await Anime.findByIdAndDelete(animeId);
    if (!deletedAnime) {
      return res.status(404).json({ message: "Anime not found" });
    }
    res.json({
      message: `Deleted anime with ID ${animeId}`,
      data: deletedAnime,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE a anime
export const updateAnime = async (req: Request, res: Response) => {
  const animeId = req.params.id;
  try {
    const updatedAnime = await Anime.findByIdAndUpdate(animeId, req.body, {
      new: true,
    });
    if (!updatedAnime) {
      return res.status(404).json({ message: "Anime not found" });
    }
    res.json({
      message: `Updated anime with ID ${animeId}`,
      data: updatedAnime,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
