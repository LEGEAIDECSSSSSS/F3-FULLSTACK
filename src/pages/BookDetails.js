import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import booksData from "../data/booksData";
import { FaStar, FaArrowLeft, FaRegBookmark, FaComments } from "react-icons/fa";
import { motion } from "framer-motion";
import { useLibrary } from "../context/LibraryContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToLibrary, removeFromLibrary, library } = useLibrary();
  const { user } = useAuth() || {};

  const [book, setBook] = useState(null);
  const [rating, setRating] = useState(0);
  const [avgRating, setAvgRating] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [added, setAdded] = useState(false);

  const userId = user?._id || user?.id;

  // --- Find book locally
  useEffect(() => {
    const allBooks = booksData.flatMap((section) => section.books);
    const found = allBooks.find((b) => b.id === Number(id));
    setBook(found || null);
  }, [id]);

  // --- Sync added state with library + localStorage
  useEffect(() => {
    if (!book) return;
    const saved = JSON.parse(localStorage.getItem("addedBooks")) || [];
    const inLibrary =
      saved.includes(book.id) || library.some((item) => item.id === book.id);

    if (inLibrary) {
      setAdded(true);
      if (!saved.includes(book.id)) {
        saved.push(book.id);
        localStorage.setItem("addedBooks", JSON.stringify(saved));
      }
    } else {
      setAdded(false);
      const updated = saved.filter((bid) => bid !== book.id);
      localStorage.setItem("addedBooks", JSON.stringify(updated));
    }
  }, [book, library]);

  // --- Fetch comments + ratings
  useEffect(() => {
    if (!book) return;
    const fetchData = async () => {
      try {
        const [c, r] = await Promise.allSettled([
          api.get(`/books/${id}/comments`),
          api.get(`/books/${id}/ratings`),
        ]);

        if (c.status === "fulfilled") setComments(c.value.data || []);
        if (r.status === "fulfilled") {
          setAvgRating(r.value.data.avg ?? book.rating);
          setRating(r.value.data.userRating ?? 0);
        } else {
          setAvgRating(book.rating);
        }
      } catch {
        setAvgRating(book.rating);
      }
    };
    fetchData();
  }, [book, id]);

  // --- Add to Library
  const handleAddToLibrary = async () => {
    if (!userId) return navigate("/login");
    if (added) return;

    setAdded(true);
    const saved = JSON.parse(localStorage.getItem("addedBooks")) || [];
    if (!saved.includes(book.id)) {
      saved.push(book.id);
      localStorage.setItem("addedBooks", JSON.stringify(saved));
    }

    try {
      await api.post("/library", { bookId: id });
      addToLibrary({ id: book.id, title: book.title, img: book.img });
    } catch {
      addToLibrary({ id: book.id, title: book.title, img: book.img });
    }
  };

  // --- Remove from Library
  const handleRemoveFromLibrary = async () => {
    if (!userId) return navigate("/login");

    setAdded(false);
    const saved = JSON.parse(localStorage.getItem("addedBooks")) || [];
    const updated = saved.filter((bid) => bid !== book.id);
    localStorage.setItem("addedBooks", JSON.stringify(updated));

    try {
      await api.delete(`/library/${book.id}`);
      removeFromLibrary(book.id);
    } catch {
      removeFromLibrary(book.id);
    }
  };

  // --- Ratings
  const handleRate = async (val) => {
    if (!userId) return navigate("/login");
    setRating(val);
    try {
      const res = await api.post(`/books/${id}/rate`, { rating: val });
      if (res?.data?.avg) setAvgRating(res.data.avg);
    } catch (err) {
      console.error("Rating failed:", err);
    }
  };

  // --- Comments
  const handlePostComment = async () => {
    if (!userId) return navigate("/login");
    if (!commentText.trim()) return;

    const tempComment = {
      _id: `temp-${Date.now()}`,
      author: user.username || "You",
      text: commentText,
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [tempComment, ...prev]);
    setCommentText("");

    try {
      const res = await api.post(`/books/${id}/comments`, {
        text: tempComment.text,
      });
      if (res?.data) {
        setComments((prev) =>
          prev.map((c) => (c._id === tempComment._id ? res.data : c))
        );
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  // --- Render
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
            by{" "}
            <span className="text-gray-800 dark:text-gray-200">
              {book.author}
            </span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {book.genre}
          </p>

          {/* --- Ratings --- */}
          <div className="flex items-center gap-1 mb-5">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                onClick={() => handleRate(i + 1)}
                className={`cursor-pointer ${
                  i < rating ? "text-yellow-400" : "text-gray-400"
                }`}
              />
            ))}
            <span className="ml-2 text-gray-500 dark:text-gray-400">
              {avgRating ? avgRating.toFixed(1) : "—"} / 5
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

            {added ? (
              <button
                onClick={handleRemoveFromLibrary}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all duration-300"
              >
                <FaRegBookmark />
                Remove from Library
              </button>
            ) : (
              <button
                onClick={handleAddToLibrary}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-all duration-300"
              >
                <FaRegBookmark />
                Add to Library
              </button>
            )}
          </div>

          {/* --- Comments --- */}
          <div className="mt-10 p-6 rounded-2xl bg-gray-100 dark:bg-gray-900 shadow-inner">
            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <FaComments />
              <h2 className="text-xl font-semibold">Comments</h2>
            </div>

            {userId ? (
              <div className="mb-4">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded bg-gray-800 text-gray-100"
                  placeholder="Write a comment..."
                />
                <button
                  onClick={handlePostComment}
                  className="mt-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white"
                >
                  Post Comment
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-400 mb-4">
                <a href="/login" className="text-indigo-400">
                  Log in
                </a>{" "}
                to rate or comment.
              </p>
            )}

            {comments.length === 0 ? (
              <p className="text-gray-500 italic">No comments yet.</p>
            ) : (
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c._id} className="p-3 bg-gray-800 rounded-lg">
                    <p className="text-sm text-indigo-300 font-semibold">
                      {c.author}
                    </p>
                    <p className="text-gray-300 mt-1">{c.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(c.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookDetails;
