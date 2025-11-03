// server/models/Book.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  genre: String,
  img: String,
  synopsis: String,
  rating: { type: Number, default: 0 },      // average rating
  ratingCount: { type: Number, default: 0 }, // number of ratings
  comments: [commentSchema],
});

const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);
export default Book;
