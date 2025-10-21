import mongoose from "mongoose";

const librarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  books: [
    {
      id: { type: String, required: true },
      title: String,
      author: String,
      cover: String,
      // any other book fields you use
    },
  ],
});

export default mongoose.model("Library", librarySchema);
