// server/routes/bookRoutes.js
import express from "express";
import Book from "../models/Book.js";
import { protect } from "../middleware/authMiddleware.js";

/**
 * Exports a function that accepts `io` and returns an Express router.
 * This lets us emit socket events from route handlers.
 */
export default function (io) {
  const router = express.Router();

  // GET /api/books/:id  -> get book with comments & rating
  router.get("/:id", async (req, res) => {
    try {
      const book = await Book.findById(req.params.id).lean();
      if (!book) return res.status(404).json({ message: "Book not found" });
      res.json(book);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // POST /api/books/:id/comments -> add a comment (protected)
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
      };

      book.comments.push(comment);
      await book.save();

      // Emit realtime update for this book
      io.emit(`bookUpdated:${book._id.toString()}`, { type: "comment", comment });

      res.status(201).json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // POST /api/books/:id/rate -> add a rating (protected)
  router.post("/:id/rate", protect, async (req, res) => {
    try {
      const { rating } = req.body;
      const r = Number(rating);
      if (!r || r < 1 || r > 5) {
        return res.status(400).json({ message: "Rating must be 1-5" });
      }

      const book = await Book.findById(req.params.id);
      if (!book) return res.status(404).json({ message: "Book not found" });

      // **Basic approach**: add rating into the average (does not track per-user rating)
      book.rating = (book.rating * book.ratingCount + r) / (book.ratingCount + 1);
      book.ratingCount = (book.ratingCount || 0) + 1;

      await book.save();

      const payload = {
        rating: book.rating,
        ratingCount: book.ratingCount,
      };

      // Emit realtime update for this book
      io.emit(`bookUpdated:${book._id.toString()}`, { type: "rating", payload });

      res.json(payload);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  return router;
}
