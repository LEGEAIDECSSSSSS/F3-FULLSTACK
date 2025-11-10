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

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

// Connect MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS setup — must come before static routes
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
    credentials: true, // Allow cookies and headers
  })
);

// ✅ Explicitly set CORS headers for static files
app.use("/uploads", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // You can restrict this if needed
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Static images
app.use("/images", express.static(path.join(__dirname, "images")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/library", protect, libraryRoutes);

// Create HTTP + Socket.IO server
const server = http.createServer(app);

const io = new IOServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Book routes with socket support
app.use("/api/books", bookRoutesFactory(io));

// Serve frontend
const __buildpath = path.join(__dirname, "../build");

if (process.env.NODE_ENV === "production" || process.env.RENDER === "true") {
  app.use(express.static(__buildpath));
  app.get(/.*/, (req, res) => res.sendFile(path.resolve(__buildpath, "index.html")));
} else {
  app.get("/", (req, res) => res.send("📚 API is running locally..."));
}

// Socket.IO events
io.on("connection", (socket) => {
  console.log("📡 Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
