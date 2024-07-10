import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import animeRoutes from "./routes/animes";
import uploadRoutes from "./routes/upload";

// Load environment variables from .env file
dotenv.config();

// Express app
const app: Application = express();

// Middleware
app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:8080", // Replace with your frontend's origin
//   })
// );
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use("/api/animes/", animeRoutes);
app.use("/api", uploadRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "", {})
  .then(() => {
    console.log("MongoDB Connected");

    // Listen for requests
    app.listen(process.env.PORT, () => {
      console.log(`Listening for requests on port ${process.env.PORT}!`);
    });
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));
