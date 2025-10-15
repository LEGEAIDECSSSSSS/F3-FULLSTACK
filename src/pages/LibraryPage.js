// src/pages/LibraryPage.jsx
import React from "react";
import { useLibrary } from "../context/LibraryContext";

export default function LibraryPage() {
  const { library, removeFromLibrary } = useLibrary();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">
        My Library
      </h1>

      {library.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          You haven’t added any books yet.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {library.map((book) => (
            <div
              key={book.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col items-center"
            >
              <img
                src={book.img}
                alt={book.title}
                className="w-32 h-48 object-cover rounded-md mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center">
                {book.title}
              </h2>
              <button
                onClick={() => removeFromLibrary(book.id)}
                className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
