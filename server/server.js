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

// ===== Load backend environment variables =====
dotenv.config({ path: path.join(__dirname, ".env") });

// ===== Verify critical env variables =====
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in server/.env");
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

// ===== Initialize Express app =====
const app = express();
app.disable("x-powered-by");

// ===== Core middleware =====
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// ===== CORS configuration =====
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://funficfalls.onrender.com",
];

app.use(
  cors({
    origin(origin, callback) {
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

// Pass io instance into book routes
app.use("/api/books", bookRoutesFactory(io));

// ===== React frontend serving =====
const buildPath = path.join(__dirname, "../build");
app.use(express.static(buildPath));

// SPA fallback (Express 5)
app.use((req, res, next) => {
  // ignore API/static routes
  if (req.path.startsWith("/api") || req.path.startsWith("/uploads") || req.path.startsWith("/images")) {
    return next();
  }
  res.sendFile(path.join(buildPath, "index.html"));
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
