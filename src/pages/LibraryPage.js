// src/pages/LibraryPage.jsx
import React from "react";
import { useLibrary } from "../context/LibraryContext";
import { motion } from "framer-motion";

const LibraryPage = () => {
  const { library, removeFromLibrary } = useLibrary();

  return (
    <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl font-bold mb-10 text-gray-800 dark:text-gray-100"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          My Library
        </motion.h2>

        {library.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">
            You haven’t added any books yet.
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {library.map((book, index) => (
              <motion.div
                key={index}
                className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden group"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <img
                  src={book.img}
                  alt={book.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-3 text-center">
                  <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-sm truncate">
                    {book.title}
                  </h3>
                  <button
                    onClick={() => removeFromLibrary(book.id)}
                    className="mt-2 px-3 py-1.5 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 transition"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LibraryPage;
