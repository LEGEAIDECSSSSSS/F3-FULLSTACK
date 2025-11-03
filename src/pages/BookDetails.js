// src/pages/BookDetails.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaArrowLeft, FaRegBookmark, FaComments } from "react-icons/fa";
import { motion } from "framer-motion";
import { useLibrary } from "../context/LibraryContext";
import { useAuth } from "../context/AuthContext";
import { io as ioClient } from "socket.io-client";
import booksData from "../data/booksData"; // ✅ added import for local data

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToLibrary, library } = useLibrary();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [userRated, setUserRated] = useState(false);
  const socketRef = useRef(null);

  const isAdded = book && library.some((item) => item.id === book.id);

  // ✅ Load book locally from booksData.js
  useEffect(() => {
    let mounted = true;

    const findBookLocally = () => {
      const allBooks = booksData.flatMap((section) => section.books);
      const found = allBooks.find((b) => String(b.id) === String(id));
      if (mounted) setBook(found || null);
    };

    findBookLocally();
    return () => {
      mounted = false;
    };
  }, [id]);

  // (Optional) Socket connection left in place for later real-time use
  useEffect(() => {
    socketRef.current = ioClient(undefined, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
    });

    const socket = socketRef.current;
    socket.on("connect", () => console.log("Socket connected:", socket.id));

    return () => {
      socket.disconnect();
    };
  }, [id]);

  // Comment and rating actions temporarily disabled until backend added
  const postComment = async () => {
    alert("Comments are disabled in offline mode (no backend).");
  };

  const submitRating = async () => {
    alert("Ratings are disabled in offline mode (no backend).");
  };

  if (!book) {
    return (
      <div className="text-center py-20 text-gray-600 dark:text-gray-400">
        <p>Looking for book...</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 py-10 px-6 md:px-20">
      <motion.button
        onClick={() => navigate(-1)}
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 mb-6 text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        <FaArrowLeft /> Back
      </motion.button>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        <motion.img
          src={book.img}
          alt={book.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl shadow-lg w-full h-auto object-cover"
        />

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
            {[...Array(5)].map((_, i) => {
              const starIndex = i + 1;
              const filled = starIndex <= Math.round(book.rating || 0);
              return (
                <FaStar
                  key={i}
                  className={filled ? "text-yellow-400" : "text-gray-400"}
                />
              );
            })}
            <span className="ml-2 text-gray-500 dark:text-gray-400">
              {(book.rating || 0).toFixed(1)} / 5
            </span>
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {book.synopsis}
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-all duration-300">
              Read Online
            </button>

            <button
              onClick={() =>
                !isAdded &&
                addToLibrary({ id: book.id, title: book.title, img: book.img })
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

          <div className="mb-8 p-4 rounded-lg bg-gray-100 dark:bg-gray-900">
            <h3 className="font-semibold mb-2">Rate this book</h3>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => {
                const active = n <= (hoverRating || Math.round(book.rating || 0));
                return (
                  <FaStar
                    key={n}
                    onMouseEnter={() => setHoverRating(n)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => submitRating(n)}
                    className={`cursor-pointer ${
                      active ? "text-yellow-400" : "text-gray-400"
                    }`}
                    size={22}
                  />
                );
              })}
              <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                {userRated ? "Thanks for rating!" : "Click a star to rate"}
              </span>
            </div>
          </div>

          <div className="mt-4 p-6 rounded-2xl bg-gray-100 dark:bg-gray-900 shadow-inner">
            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <FaComments />
              <h2 className="text-xl font-semibold">Comments</h2>
            </div>

            <p className="text-gray-600 dark:text-gray-400 italic">
              Comments are disabled in offline mode.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookDetails;
