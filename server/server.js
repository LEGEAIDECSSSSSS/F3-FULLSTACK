// server/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import libraryRoutes from "./routes/LibraryRoutes.js";
import { protect } from "./middleware/authMiddleware.js";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ Middlewares
app.use(express.json());

// ✅ Serve static image files
app.use("/images", express.static(path.join(__dirname, "images")));


// ✅ Configure CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://funficfalls.onrender.com" // 🔹 Replace with your Render frontend URL
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/library", protect, libraryRoutes);

// ✅ Serve frontend (in production)
const __buildpath = path.join(__dirname, "../build");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(__buildpath));

  // 🟩 FIX FOR EXPRESS 5 — use regex route instead of '*'
  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__buildpath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
