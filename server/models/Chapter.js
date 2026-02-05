import mongoose from "mongoose";

const ChapterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String, // HTML from TipTap
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chapter", ChapterSchema);
