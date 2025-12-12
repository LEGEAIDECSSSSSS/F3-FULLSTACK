import express from "express";
import Book from "../models/Book.js"; // Make sure this points to your Book model
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/creator/save-chapter
 * @desc    Save a new chapter for the logged-in creator
 * @access  Private
 */
router.post("/save-chapter", protect, async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validate input
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    // Save chapter to DB
    const chapter = await Book.create({
      title,
      content,
      author: req.user._id, // assuming your auth middleware sets req.user
    });

    res.status(201).json({ message: "Chapter saved successfully", chapter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
