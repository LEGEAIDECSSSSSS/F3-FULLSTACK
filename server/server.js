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

// ✅ Fix: ensure correct relative path for uploaded PDFs
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath, {
  setHeaders: (res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  },
}));

// ✅ Serve images if any
app.use("/images", express.static(path.join(__dirname, "images")));

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/library", protect, libraryRoutes);
const server = http.createServer(app);

const io = new IOServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.use("/api/books", bookRoutesFactory(io));

// ===== Serve Frontend (Render) =====
const __buildpath = path.join(__dirname, "../build");

if (process.env.NODE_ENV === "production" || process.env.RENDER === "true") {
  app.use(express.static(__buildpath));

  // ✅ Fix: ensure uploads still work when frontend is served
  app.use("/uploads", express.static(uploadsPath));

app.get("*", (req, res, next) => {
  // Express 5 treats "*" differently — handle it manually
  if (req.path.startsWith("/api") || req.path.startsWith("/uploads") || req.path.startsWith("/images")) {
    return next(); // don’t interfere with API or static routes
  }

  res.sendFile(path.join(__buildpath, "index.html"));
});


} else {
  app.get("/", (req, res) => res.send("📚 API running locally..."));
}

// ===== Socket.IO =====
io.on("connection", (socket) => {
  console.log("📡 Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// ===== Start server =====
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
