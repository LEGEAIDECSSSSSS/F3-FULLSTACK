// server/seedBooks.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Book from "./models/Book.js";

dotenv.config();

const books = [
  {
    title: "The Silent Library",
    author: "Emily Rivers",
    genre: "Mystery",
    img: "/images/book1.jpg",
    synopsis: "A haunting mystery unfolds within the walls of an ancient library.",
    rating: 4.5,
    ratingCount: 10,
    comments: [],
  },
  {
    title: "Echoes of Tomorrow",
    author: "Michael Storm",
    genre: "Science Fiction",
    img: "/images/book2.jpg",
    synopsis: "A gripping sci-fi tale exploring the paradox of time and identity.",
    rating: 4.2,
    ratingCount: 8,
    comments: [],
  },
  {
    title: "Whispers in the Dark",
    author: "Samantha Frost",
    genre: "Thriller",
    img: "/images/book3.jpg",
    synopsis: "A psychological thriller that will keep you awake at night.",
    rating: 4.8,
    ratingCount: 20,
    comments: [],
  },
];

const seedBooks = async () => {
  try {
    await connectDB();
    await Book.deleteMany(); // clear old books (optional)
    await Book.insertMany(books);
    console.log("✅ Books seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding books:", error);
    process.exit(1);
  }
};

seedBooks();
