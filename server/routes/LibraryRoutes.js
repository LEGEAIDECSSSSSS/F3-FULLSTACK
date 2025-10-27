import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Library from "../models/Library.js";

const router = express.Router();

// ✅ Get user library
router.get("/", protect, async (req, res) => {
  const library = await Library.findOne({ user: req.user.id });
  res.json(library || { books: [] });
});

// ✅ Add a book
router.post("/add", protect, async (req, res) => {
  const { book } = req.body;
  console.log("📚 Received book from frontend:", book);


  if (!book || !book.id) {
    return res.status(400).json({ message: "Invalid book data" });
  }

  let library = await Library.findOne({ user: req.user.id });
  if (!library) {
    library = await Library.create({ user: req.user.id, books: [] });
  }

  // ✅ Check if book already exists
  const exists = library.books.some(
    (b) => String(b.id) === String(book.id)
  );

  if (!exists) {
    // ✅ Normalize image URL
    const formattedImg = book.img
      ? book.img.startsWith("http")
        ? book.img
        : `https://funficfalls.onrender.com${book.img.startsWith("/") ? book.img : "/" + book.img}`
      : null;

    const newBook = {
      id: String(book.id),
      title: book.title,
      img: formattedImg, // ✅ Store image in DB
    };

    library.books.push(newBook);
    await library.save();
  }

  res.json(library);
});

// ✅ Remove a book
router.delete("/remove/:id", protect, async (req, res) => {
  const library = await Library.findOne({ user: req.user.id });
  if (!library) return res.status(404).json({ message: "Library not found" });

  library.books = library.books.filter(
    (b) => String(b.id) !== String(req.params.id)
  );
  await library.save();

  res.json(library);
});

export default router;
