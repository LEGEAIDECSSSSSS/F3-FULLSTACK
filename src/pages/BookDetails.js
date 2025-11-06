import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaArrowLeft, FaRegBookmark, FaComments } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useLibrary } from "../context/LibraryContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { io as ioClient } from "socket.io-client";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToLibrary, library } = useLibrary();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [userRated, setUserRated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const socketRef = useRef(null);

  const isAdded = book && library.some((item) => item.id === book._id);

  const API_BASE =
    process.env.REACT_APP_API_URL?.trim() ||
    (window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : window.location.origin);

  // Fetch book details
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/books/${id}`, {
          withCredentials: true,
          headers: {
            Authorization: user
              ? `Bearer ${localStorage.getItem("token")}`
              : "",
          },
        });
        setBook(res.data);
      } catch (err) {
        console.error("Error fetching book:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, API_BASE, user]);

  // Socket for real-time updates
  useEffect(() => {
    const socket = ioClient(API_BASE, { withCredentials: true });
    socketRef.current = socket;

    socket.on(`bookUpdated:${id}`, (update) => {
      setBook((prev) => {
        if (!prev) return prev;
        if (update.type === "comment") {
          return {
            ...prev,
            comments: [...(prev.comments || []), update.comment],
          };
        } else if (update.type === "rating") {
          return {
            ...prev,
            rating: update.payload.rating,
            ratingCount: update.payload.ratingCount,
          };
        }
        return prev;
      });
    });

    return () => socket.disconnect();
  }, [id, API_BASE]);

  // Add to library
  const handleAddToLibrary = () => {
    if (!user) return alert("You must be logged in to add to library.");
    if (!isAdded)
      addToLibrary({ id: book._id, title: book.title, img: book.img });
  };

  // Submit rating (only once)
  const submitRating = async (value) => {
    if (!user) return alert("You must be logged in to rate.");
    if (userRated) return;

    try {
      const res = await axios.post(
        `${API_BASE}/api/books/${id}/rate`,
        { rating: value },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUserRated(true);
      setBook((prev) => ({
        ...prev,
        rating: res.data.rating,
        ratingCount: res.data.ratingCount,
      }));

      setToastMessage("Thanks for rating!");
      setTimeout(() => setToastMessage(""), 3000); // fade out toast
    } catch (err) {
      console.error("Rating error:", err.response?.data || err.message);
      alert(
        `Failed to submit rating: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  // Submit comment
  const submitComment = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to comment.");
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(
        `${API_BASE}/api/books/${id}/comments`,
        { text: commentText },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setBook((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), res.data],
      }));
      setCommentText("");
    } catch (err) {
      console.error("Comment error:", err.response?.data || err.message);
      alert(
        `Failed to submit comment: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-500">Loading book...</p>
    );

  if (!book)
    return (
      <p className="text-center mt-20 text-red-500">
        Book not found.
        <button
          onClick={() => navigate(-1)}
          className="ml-2 underline text-blue-500"
        >
          Go back
        </button>
      </p>
    );

  return (
    <div className="relative min-h-screen py-10 px-6 md:px-20 bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
      {/* Toast Message */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => navigate(-1)}
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 mb-6 text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        <FaArrowLeft /> Back
      </motion.button>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Book Image */}
        <motion.img
          src={
            book.img.startsWith("http")
              ? book.img
              : `${book.img.startsWith("/") ? "" : "/"}${book.img}`
          }
          alt={book.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl shadow-lg w-full h-auto object-cover"
        />

        {/* Book Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold mb-3">{book.title}</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-1">
            by{" "}
            <span className="text-gray-800 dark:text-gray-200">
              {book.author}
            </span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {book.genre}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-5">
            {[...Array(5)].map((_, i) => {
              const filled = i < Math.round(book.rating || 0);
              return (
                <FaStar
                  key={i}
                  className={filled ? "text-yellow-400" : "text-gray-400"}
                />
              );
            })}
            <span className="ml-2 text-gray-500 dark:text-gray-400">
              {(book.rating || 0).toFixed(1)} ({book.ratingCount || 0} ratings)
            </span>
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {book.synopsis}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg">
              Read Online
            </button>

            <button
              onClick={handleAddToLibrary}
              disabled={!user || isAdded}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg ${
                isAdded
                  ? "bg-green-600 text-white cursor-default"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              <FaRegBookmark />
              {isAdded ? "Added to Library ✓" : "Add to Library"}
            </button>
          </div>

          {/* Submit Rating */}
          <div className="mb-8 p-4 rounded-lg bg-gray-100 dark:bg-gray-900">
            <h3 className="font-semibold mb-2">Rate this book</h3>

            {!userRated ? (
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <FaStar
                    key={n}
                    size={22}
                    onMouseEnter={() => setHoverRating(n)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => submitRating(n)}
                    className={`cursor-pointer ${
                      n <=
                      (hoverRating || Math.round(book.rating || 0))
                        ? "text-yellow-400"
                        : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">
                You’ve already rated this book.
              </p>
            )}
          </div>

          {/* Comments */}
          <div className="mt-4 p-6 rounded-2xl bg-gray-100 dark:bg-gray-900 shadow-inner">
            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <FaComments />
              <h2 className="text-xl font-semibold">Comments</h2>
            </div>

            <form onSubmit={submitComment} className="mb-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  user ? "Add a comment..." : "Log in to comment"
                }
                className="w-full bg-gray-700 rounded-lg p-3 resize-none text-white placeholder-gray-400"
                rows="3"
                disabled={!user}
              />
              <button
                type="submit"
                className="mt-3 bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition"
                disabled={!user || !commentText.trim()}
              >
                Submit Comment
              </button>
            </form>

            {!book.comments || book.comments.length === 0 ? (
              <p className="text-gray-400">No comments yet.</p>
            ) : (
              book.comments.map((c, i) => (
                <div
                  key={i}
                  className="bg-gray-700 p-3 rounded-lg mb-3 text-gray-100"
                >
                  <strong>{c.username || "Anonymous"}</strong>
                  <p>{c.text}</p>
                  <small className="text-gray-400 block mt-1">
                    {new Date(c.createdAt).toLocaleString()}
                  </small>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookDetails;
