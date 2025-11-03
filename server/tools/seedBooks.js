// server/tools/seedBooks.js (run once)
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Book from "../models/Book.js";
import booksData from "../../src/data/booksData.js"; // adjust path

dotenv.config();
await connectDB();

const allBooks = booksData.flatMap(s => s.books).map(b => ({
  title: b.title,
  author: b.author,
  genre: b.genre,
  img: b.img,
  synopsis: b.synopsis,
}));

await Book.deleteMany({});
await Book.insertMany(allBooks);
console.log("Seeded books");
process.exit(0);
