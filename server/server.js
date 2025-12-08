// server/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import fs from "fs";
import { Server as IOServer } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import libraryRoutes from "./routes/LibraryRoutes.js";
import bookRoutesFactory from "./routes/bookRoutes.js";
import { protect } from "./middleware/authMiddleware.js";

// ===== __dirname for ES modules =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Load environment variables =====
dotenv.config({ path: path.join(__dirname, ".env") });

// ===== Validate critical env variables =====
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("❌ Missing critical environment variables in server/.env");
  process.exit(1);
}

// ===== Connect to MongoDB =====
try {
  await connectDB();
  console.log("✅ MongoDB connected");
} catch (err) {
  console.error("❌ Failed to connect to MongoDB:", err.message);
  process.exit(1);
}

// ===== Initialize Express =====
const app = express();
app.disable("x-powered-by");

// ===== Middleware =====
app.use(express.json({ limit: "10mb" }));
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
      // Allow requests from tools like Postman (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || origin.endsWith(".onrender.com")) {
        return callback(null, true);
      }

      console.warn("❌ Blocked by CORS:", origin);
      return callback(new Error("CORS not allowed for this origin"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ===== Static asset routes =====
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/images", express.static(path.join(__dirname, "images")));

// ===== API routes =====
app.use("/api/auth", authRoutes);
app.use("/api/library", protect, libraryRoutes);

// ===== Socket.IO setup =====
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: { origin: allowedOrigins, credentials: true },
});
app.use("/api/books", bookRoutesFactory(io));

// ===== Serve React frontend =====
const buildPath = path.join(__dirname, "../build");

// 1️⃣ Serve React build static files first
app.use(express.static(buildPath));

// 2️⃣ Serve pdf.worker.js and other library assets (if needed)
app.use("/pdf-worker", express.static(path.join(__dirname, "../node_modules/pdfjs-dist/build")));

// 3️⃣ SPA fallback (catch-all) AFTER static files
app.use((req, res, next) => {
  // Skip API/static routes
  if (
    req.path.startsWith("/api") ||
    req.path.startsWith("/uploads") ||
    req.path.startsWith("/images") ||
    req.path.startsWith("/pdf-worker")
  ) {
    return next();
  }

  const requestedFile = path.join(buildPath, req.path);
  if (fs.existsSync(requestedFile)) {
    res.sendFile(requestedFile);
  } else {
    res.sendFile(path.join(buildPath, "index.html"));
  }
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error("🔥 Express Error:", err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});

// ===== Socket.IO events =====
io.on("connection", (socket) => {
  console.log("📡 Socket connected:", socket.id);
  socket.on("disconnect", () => console.log("❌ Socket disconnected:", socket.id));
});

// ===== Start server =====
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
