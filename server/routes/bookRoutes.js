// server/routes/bookRoutes.js
import express from "express";
import mongoose from "mongoose";
import Book from "../models/Book.js";
import { protect } from "../middleware/authMiddleware.js";

/**
 * Book Routes
 * Exported as a function that receives `io` for real-time updates
 */
export default function (io) {
  const router = express.Router();

  /**
   * Helper to build absolute PDF URL
   */
  const getPdfUrl = (pdfPath) => {
    if (!pdfPath) return null;
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    return `${baseUrl.replace(/\/$/, "")}/${pdfPath.replace(/^\//, "")}`;
  };

  /**
   * GET /api/books
   * Fetch all books
   */
  router.get("/", async (req, res) => {
    try {
      const books = await Book.find().lean();

      const updatedBooks = books.map((book) => {
        if (book.pdfUrl && !book.pdfUrl.startsWith("http")) {
          book.pdfUrl = getPdfUrl(book.pdfUrl);
        }
        return book;
      });

      res.json(updatedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  /**
   * GET /api/books/:id
   * Fetch a single book by ID
   */
  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid book ID format" });
      }

      const book = await Book.findById(id).lean();
      if (!book) return res.status(404).json({ message: "Book not found" });

      if (book.pdfUrl && !book.pdfUrl.startsWith("http")) {
        book.pdfUrl = getPdfUrl(book.pdfUrl);
      }

      res.json(book);
    } catch (error) {
      console.error("Error fetching book:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  /**
   * POST /api/books/:id/comments
   * Add a comment (requires authentication)
   */
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

      io.emit(`bookUpdated:${book._id.toString()}`, { type: "comment", comment });

      res.status(201).json(comment);
    } catch (error) {
      console.error("Error posting comment:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  /**
   * POST /api/books/:id/rate
   * Add a rating (requires authentication)
   */
  router.post("/:id/rate", protect, async (req, res) => {
    try {
      const { rating } = req.body;
      const r = Number(rating);

      if (!r || r < 1 || r > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }

      const book = await Book.findById(req.params.id);
      if (!book) return res.status(404).json({ message: "Book not found" });

      book.ratingCount = book.ratingCount || 0;
      book.rating = book.rating || 0;

      book.rating = (book.rating * book.ratingCount + r) / (book.ratingCount + 1);
      book.ratingCount += 1;

      await book.save();

      const payload = {
        rating: book.rating,
        ratingCount: book.ratingCount,
      };

      io.emit(`bookUpdated:${book._id.toString()}`, { type: "rating", payload });

      res.json(payload);
    } catch (error) {
      console.error("Error posting rating:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  return router;
}
