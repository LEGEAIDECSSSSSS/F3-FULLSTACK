import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import booksData from "../data/booksData"; // adjust this path if your data file is elsewhere
import { FaStar, FaArrowLeft, FaRegBookmark, FaComments } from "react-icons/fa";
import { motion } from "framer-motion";
import { useLibrary } from "../context/LibraryContext";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToLibrary, library } = useLibrary();

  // Find the selected book
  const allBooks = booksData.flatMap((section) => section.books);
  const book = allBooks.find((b) => b.id === Number(id));

  if (!book) {
    return (
      <div className="text-center py-20 text-gray-600 dark:text-gray-400">
        <p>Book not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isAdded = library.some((item) => item.id === book.id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 py-10 px-6 md:px-20">
      <motion.button
        onClick={() => navigate(-1)}
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 mb-6 text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        <FaArrowLeft /> Back
      </motion.button>

      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* --- Book Cover --- */}
        <motion.img
          src={book.img}
          alt={book.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl shadow-lg w-full h-auto object-cover"
        />

        {/* --- Book Info --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold mb-3">{book.title}</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-1">
            by <span className="text-gray-800 dark:text-gray-200">{book.author}</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {book.genre}
          </p>

          <div className="flex items-center gap-1 mb-5">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < Math.floor(book.rating) ? "text-yellow-400" : "text-gray-400"}
              />
            ))}
            <span className="ml-2 text-gray-500 dark:text-gray-400">
              {book.rating.toFixed(1)} / 5
            </span>
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {book.synopsis}
          </p>

          {/* --- Action Buttons --- */}
          <div className="flex flex-wrap gap-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-all duration-300">
              Read Online
            </button>

            <button
              onClick={() =>
                !isAdded && addToLibrary({ id: book.id, title: book.title, img: book.img })
              }
              disabled={isAdded}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-300 ${
                isAdded
                  ? "bg-green-600 text-white cursor-default"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              <FaRegBookmark />
              {isAdded ? "Added to Library ✓" : "Add to Library"}
            </button>
          </div>

          {/* --- Comments & Ratings Placeholder --- */}
          <div className="mt-10 p-6 rounded-2xl bg-gray-100 dark:bg-gray-900 shadow-inner">
            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <FaComments />
              <h2 className="text-xl font-semibold">Comments</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm italic">
              Comment section coming soon...
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookDetails;
