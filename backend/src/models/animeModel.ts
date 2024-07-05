import mongoose, { Schema } from "mongoose";

// Define the schema
const animeSchema: Schema = new Schema({
  title: { type: String, required: true },
  status: {
    type: String,
    enum: ["Watching", "Completed", "On Hold", "Dropped", "Plan to Watch"],
    required: true,
  },
  rating: { type: Number },
  comments: { type: String },
});

// Create a Mongoose model
// 3rd arg in .model specfies specific collection within database
const Anime = mongoose.model("Anime", animeSchema, "Anime");

export default Anime;
