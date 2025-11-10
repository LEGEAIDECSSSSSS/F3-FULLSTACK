import dotenv from "dotenv";
import mongoose from "mongoose";
import Book from "./models/Book.js";
import booksData from "../src/data/booksData.js"; // adjust path if needed

dotenv.config();

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const seedBooks = async () => {
  try {
    await connectDB();

    // Flatten books from each category into one array
    const allBooks = booksData.flatMap(category =>
      category.books.map(b => ({
        title: b.title,
        author: b.author,
        genre: b.genre,
        type: b.type,
        img: b.img,
        synopsis: b.synopsis,
        rating: b.rating || 0,
        ratingCount: b.ratingCount || 0,
        comments: [],
        pdfUrl: `${BASE_URL}${b.pdfUrl}`, // 👈 include PDF URLs here
      }))
    );

    await Book.deleteMany();
    console.log("🗑️ Old books cleared.");

    await Book.insertMany(allBooks);
    console.log(`✅ ${allBooks.length} books added successfully.`);

    process.exit();
  } catch (error) {
    console.error(`❌ Error seeding books: ${error}`);
    process.exit(1);
  }
};

seedBooks();
