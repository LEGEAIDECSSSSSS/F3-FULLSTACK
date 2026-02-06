import mongoose from "mongoose";

const ChapterSchema = new mongoose.Schema(
  {
    title: String,
    content: String,

    // 👇 VERY IMPORTANT
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chapter", ChapterSchema);
