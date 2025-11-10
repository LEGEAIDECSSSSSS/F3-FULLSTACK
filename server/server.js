// server/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server as IOServer } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import libraryRoutes from "./routes/LibraryRoutes.js";
import bookRoutesFactory from "./routes/bookRoutes.js";
import { protect } from "./middleware/authMiddleware.js";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, ".env") });

// Connect MongoDB
connectDB();

const app = express();

// ===== Middleware =====
app.use(express.json());
app.use(cookieParser());

// ===== CORS =====
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://funficfalls.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".onrender.com")) {
        callback(null, true);
      } else {
        console.warn("❌ Blocked by CORS:", origin);
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    credentials: true,
  })
);

// ===== Serve static files =====
const uploadsPath = path.join(__dirname, "uploads");
app.use(
  "/uploads",
  express.static(uploadsPath, {
    setHeaders: (res, filePath) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      // Serve PDFs, JS, WASM with proper MIME
      if (filePath.endsWith(".pdf")) res.setHeader("Content-Type", "application/pdf");
      if (filePath.endsWith(".js")) res.setHeader("Content-Type", "application/javascript");
      if (filePath.endsWith(".wasm")) res.setHeader("Content-Type", "application/wasm");
    },
  })
);

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/static", express.static(path.join(__dirname, "../build/static"))); // React static assets

// ===== API Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/library", protect, libraryRoutes);

// ===== Socket.IO =====
const server = http.createServer(app);

const io = new IOServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Book routes with socket support
app.use("/api/books", bookRoutesFactory(io));

// ===== Serve Frontend (React SPA) =====
const __buildpath = path.join(__dirname, "../build");
app.use(express.static(__buildpath));

// SPA fallback for React Router (Express + path-to-regexp compliant)
app.get(/^\/(?!api|uploads|images|static).*$/, (req, res) => {
  res.sendFile(path.join(__buildpath, "index.html"));
});

// ===== Socket.IO Events =====
io.on("connection", (socket) => {
  console.log("📡 Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
