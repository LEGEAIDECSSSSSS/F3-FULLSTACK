import express from "express";
import Chapter from "../models/Chapter.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* CREATOR STATS */
router.get("/stats", protect, async (req, res) => {
  const creatorId = req.user.id;

  const books = await Chapter.countDocuments({ creator: creatorId });

  res.json({
    books,
    totalReads: 0, // placeholder
    likes: 0,      // placeholder
  });
});

/* RECENT BOOKS */
router.get("/recent-books", protect, async (req, res) => {
  const creatorId = req.user.id;

  const chapters = await Chapter.find({ creator: creatorId })
    .sort({ updatedAt: -1 })
    .limit(5)
    .select("title updatedAt");

  res.json(chapters);
});

export default router;
