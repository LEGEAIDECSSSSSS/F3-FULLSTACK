import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Library from "../models/Library.js";

const router = express.Router();

// Get user library
router.get("/", protect, async (req, res) => {
  const library = await Library.findOne({ user: req.user.id });
  res.json(library || { books: [] });
});

// Add a book
router.post("/add", protect, async (req, res) => {
  let { book } = req.body;

  if (!book) {
    return res.status(400).json({ message: "Book data missing" });
  }

  // ✅ Ensure image URL is absolute
  if (book.img && !book.img.startsWith("http")) {
    const baseUrl = process.env.BASE_URL || "https://funficfalls.onrender.com";
    // handle both /Images/bg_dark.jpg and ./Images/bg_dark.jpg
    const cleanPath = book.img.replace(/^\.\//, "").replace(/^\/?/, "/");
    book.img = `${baseUrl}${cleanPath}`;
  }

  let library = await Library.findOne({ user: req.user.id });
  if (!library) library = await Library.create({ user: req.user.id, books: [] });

  const exists = library.books.find((b) => b.id === book.id);
  if (!exists) {
    library.books.push(book);
    await library.save();
  }

  res.json(library);
});

// Remove a book
router.delete("/remove/:id", protect, async (req, res) => {
  const library = await Library.findOne({ user: req.user.id });
  if (!library) return res.status(404).json({ message: "Library not found" });

  library.books = library.books.filter((b) => b.id !== req.params.id);
  await library.save();

  res.json(library);
});

export default router;
