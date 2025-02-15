import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import projectRoutes from "./routes/project.route.js";
import commentRoutes from "./routes/comment.route.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO, {})
  .then(() => console.log("MongoDB is connected ✅"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const app = express();
const allowedOrigins = [
  "https://behabtu-blogs.vercel.app",
  "http://localhost:5173", // For local development
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan("dev")); // Log requests *before* other middleware
app.use(cookieParser()); // Parse cookies *before* routes that use them
app.use(express.json({ limit: "50mb" })); // Parse JSON *before* routes that use it
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Parse URL-encoded *before* routes

// API routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/comment", commentRoutes);

app.get("/", (req, res) => {
  res.send("Hello Welcome! to Beget");
});

// Global error handler (must be last)
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT} ✅`));
