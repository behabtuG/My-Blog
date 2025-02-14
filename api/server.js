import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { globalErrorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import projectRoutes from "./routes/project.route.js";
import commentRoutes from "./routes/comment.route.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose
  .connect(process.env.MONGO, {})
  .then(() => console.log("MongoDB is connected ✅"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const app = express();
const allowedOrigins = [
  "https://https://behabtu-blogs.vercel.app",
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

// app.use(
//   cors({
//     origin: "https://behabtu-blogs.vercel.app",
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// Middleware order is crucial!
app.use(cors(corsOptions));
app.use(morgan("dev")); // Log requests *before* other middleware
app.use(cookieParser()); // Parse cookies *before* routes that use them
app.use(express.json({ limit: "50mb" })); // Parse JSON *before* routes that use it
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Parse URL-encoded *before* routes

//✅ Serve static files first
app.use(express.static(path.join(__dirname, "/client/dist")));

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/comment", commentRoutes);

//✅ Catch-all route for serving React frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//✅ Global error handler (must be last)
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT} ✅`));
