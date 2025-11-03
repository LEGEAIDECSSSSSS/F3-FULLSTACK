// server/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server as IOServer } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import libraryRoutes from "./routes/LibraryRoutes.js";
import bookRoutesFactory from "./routes/bookRoutes.js"; // NEW
import { protect } from "./middleware/authMiddleware.js";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(express.json());

// Serve static image files
app.use("/images", express.static(path.join(__dirname, "images")));

// Configure CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://funficfalls.onrender.com"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/library", protect, libraryRoutes);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
  // you can configure path/transport if needed
});

// Make io available to other modules via routes factory
app.use("/api/books", bookRoutesFactory(io));

// Serve frontend (in production)
const __buildpath = path.join(__dirname, "../build");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(__buildpath));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__buildpath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// Socket.IO events (optional logging)
io.on("connection", (socket) => {
  console.log("New socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
