import express from "express";
import Chapter from "../models/Chapter.js";

const router = express.Router();

/* Create or update a chapter */
router.post("/", async (req, res) => {
  try {
    const { id, title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Missing fields" });
    }

    let chapter;

    if (id) {
      chapter = await Chapter.findByIdAndUpdate(
        id,
        { title, content },
        { new: true }
      );
    } else {
      chapter = await Chapter.create({ title, content });
    }

    res.json(chapter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* Get one chapter */
router.get("/:id", async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(chapter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
