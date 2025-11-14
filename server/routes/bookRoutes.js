// server/routes/bookRoutes.js
import express from "express";
import mongoose from "mongoose";
import Book from "../models/Book.js";
import { protect } from "../middleware/authMiddleware.js";

export default function (io) {
  const router = express.Router();

  // ============================================================
  // Helper: Convert relative PDF paths → full absolute URLs
  // ============================================================
  const makeFullPdfUrl = (pdfUrl) => {
    if (!pdfUrl) return null;

    // Already full URL → return as-is
    if (pdfUrl.startsWith("http://") || pdfUrl.startsWith("https://")) {
      return pdfUrl;
    }

    // Use BASE_URL from Render environment OR local fallback
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";

    // Ensure single slash between baseUrl and path
    return `${baseUrl}${pdfUrl.startsWith("/") ? "" : "/"}${pdfUrl}`;
  };

  // ============================================================
  // GET /api/books → Fetch all books
  // ============================================================
  router.get("/", async (req, res) => {
    try {
      const books = await Book.find().lean();

      const updatedBooks = books.map((book) => ({
        ...book,
        pdfUrl: makeFullPdfUrl(book.pdfUrl),
      }));

      res.json(updatedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ============================================================
  // GET /api/books/:id → Fetch one book
  // ============================================================
  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }

      const book = await Book.findById(id).lean();
      if (!book) return res.status(404).json({ message: "Book not found" });

      // Fix pdf URL
      book.pdfUrl = makeFullPdfUrl(book.pdfUrl);

      res.json(book);
    } catch (error) {
      console.error("Error fetching book:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ============================================================
  // POST /api/books/:id/comments → Add comment
  // ============================================================
  router.post("/:id/comments", protect, async (req, res) => {
    try {
      const { text } = req.body;

      if (!text || !text.trim()) {
        return res.status(400).json({ message: "Comment text required" });
      }

      const book = await Book.findById(req.params.id);
      if (!book) return res.status(404).json({ message: "Book not found" });

      const comment = {
        userId: req.user._id,
        username: req.user.email || req.user.username || "Anonymous",
        text: text.trim(),
        createdAt: new Date(),
      };

      book.comments.push(comment);
      await book.save();

      io.emit(`bookUpdated:${book._id}`, { type: "comment", comment });

      res.status(201).json(comment);
    } catch (error) {
      console.error("Error posting comment:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // ============================================================
  // POST /api/books/:id/rate → Add rating
  // ============================================================
  router.post("/:id/rate", protect, async (req, res) => {
    try {
      const { rating } = req.body;
      const r = Number(rating);

      if (!r || r < 1 || r > 5) {
        return res.status(400).json({ message: "Rating must be 1–5" });
      }

      const book = await Book.findById(req.params.id);
      if (!book) return res.status(404).json({ message: "Book not found" });

      book.ratingCount = book.ratingCount || 0;
      book.rating = book.rating || 0;

      // Update average
      book.rating = (book.rating * book.ratingCount + r) / (book.ratingCount + 1);
      book.ratingCount += 1;

      await book.save();

      const payload = {
        rating: book.rating,
        ratingCount: book.ratingCount,
      };

      io.emit(`bookUpdated:${book._id}`, { type: "rating", payload });

      res.json(payload);
    } catch (error) {
      console.error("Error posting rating:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  return router;
}
