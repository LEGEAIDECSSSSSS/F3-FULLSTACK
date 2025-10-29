// src/pages/BookDetails.js
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios"; // your axios instance
import booksData from "../data/booksData"; // fallback local data file (adjust path/name)
import { FaStar, FaRegStar, FaArrowLeft, FaRegBookmark } from "react-icons/fa";
import { motion } from "framer-motion";
import { useLibrary } from "../context/LibraryContext";
import { useAuth } from "../context/AuthContext"; // adjust if your hook is named differently

const Stars = ({ value = 0, editable = false, onChange }) => {
  const stars = [...Array(5)].map((_, i) => i + 1);
  return (
    <div className="flex items-center gap-1">
      {stars.map((s) =>
        editable ? (
          <button
            key={s}
            onClick={() => onChange(s)}
            className="text-xl focus:outline-none"
            aria-label={`Rate ${s} star`}
          >
            {s <= value ? (
              <FaStar className="text-yellow-400" />
            ) : (
              <FaRegStar className="text-gray-400" />
            )}
          </button>
        ) : (
          <span key={s} className="text-xl">
            {s <= value ? (
              <FaStar className="text-yellow-400" />
            ) : (
              <FaRegStar className="text-gray-400" />
            )}
          </span>
        )
      )}
    </div>
  );
};

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToLibrary: addToLocalLibrary, library } = useLibrary();
  const { user } = useAuth() || {}; // if your AuthContext hook differs rename accordingly

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // comments & rating state
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [userRating, setUserRating] = useState(0); // current user's rating (if any)
  const [avgRating, setAvgRating] = useState(null);

  const userId = user?.id || user?._id || null;

  // check if locally added in library
  const isAdded = useMemo(
    () => library.some((it) => Number(it.id) === Number(id)),
    [library, id]
  );

  useEffect(() => {
    let mounted = true;

    const fetchBook = async () => {
      setLoading(true);
      try {
        // Try loading from API first
        const res = await api.get(`/books/${id}`); // expected route
        if (!mounted) return;
        setBook(res.data);
      } catch (err) {
        // fallback to local data
        const all = booksData.flatMap((s) => s.books || []);
        const found = all.find((b) => Number(b.id) === Number(id));
        setBook(found || null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const fetchCommentsAndRating = async () => {
      try {
        const [cRes, rRes] = await Promise.allSettled([
          api.get(`/books/${id}/comments`),
          api.get(`/books/${id}/ratings`),
        ]);

        if (cRes.status === "fulfilled") setComments(cRes.value.data || []);
        else setComments([]);

        if (rRes.status === "fulfilled") {
          const data = rRes.value.data;
          setAvgRating(data.avg ?? null);
          if (data.userRating) setUserRating(data.userRating);
        } else {
          setAvgRating((prev) => prev ?? null);
        }
      } catch (e) {
        // ignore; handled above per promise
      }
    };

    fetchBook();
    fetchCommentsAndRating();

    return () => {
      mounted = false;
    };
  }, [id]);

  // -----------------------
  // Add to library (server + local fallback)
  // -----------------------
  const handleAddToLibrary = async () => {
    if (!userId) return navigate("/login");
    try {
      await api.post("/library", { bookId: id }); // expected route
      // update local context / UI
      addToLocalLibrary({ id: Number(id), title: book.title, img: book.img || book.cover });
    } catch (err) {
      // If API call fails, still add locally so user sees immediate effect
      addToLocalLibrary({ id: Number(id), title: book.title, img: book.img || book.cover });
      console.error("Add to library failed (server) — added locally", err);
    }
  };

  // -----------------------
  // Ratings
  // -----------------------
  const handleRate = async (starValue) => {
    if (!userId) return navigate("/login");
    setUserRating(starValue);

    try {
      // POST or PUT to server
      const res = await api.post(`/books/${id}/rate`, { rating: starValue }); // expected
      // server returns updated avg
      if (res?.data?.avg) setAvgRating(res.data.avg);
    } catch (err) {
      console.error("Rating API failed", err);
    }
  };

  // -----------------------
  // Comments
  // -----------------------
  const handlePostComment = async () => {
    if (!userId) return navigate("/login");
    if (!commentText.trim()) return;

    const newComment = {
      author: user.username || user.email || "You",
      userId,
      text: commentText.trim(),
      createdAt: new Date().toISOString(),
      // optional: temp id
      _id: `temp-${Date.now()}`,
    };

    // optimistic update
    setComments((c) => [newComment, ...c]);
    setCommentText("");

    try {
      const res = await api.post(`/books/${id}/comments`, { text: newComment.text });
      // replace temp comment with server-sent comment if returned
      if (res?.data) {
        setComments((c) => c.map((cm) => (cm._id === newComment._id ? res.data : cm)));
      }
    } catch (err) {
      // if error, rollback optimistic update (or keep with "failed" UI — here we rollback)
      setComments((c) => c.filter((cm) => cm._id !== newComment._id));
      console.error("Failed to post comment", err);
      alert("Failed to post comment. Try again.");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p>Book not found</p>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-indigo-600 text-white rounded">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 py-10 px-6 md:px-20">
      <motion.button
        onClick={() => navigate(-1)}
        whileHover={{ scale: 1.02 }}
        className="text-indigo-400 mb-6 flex items-center gap-2"
      >
        <FaArrowLeft /> Back
      </motion.button>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        <motion.img
          src={book.img || book.cover}
          alt={book.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl shadow-lg w-full object-cover max-h-[640px]"
        />

        <div>
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-sm text-gray-400 mb-1">
            by <span className="text-indigo-300">{book.author}</span>
          </p>
          <p className="text-xs text-gray-500 mb-4">{book.genre}</p>

          <div className="flex items-center gap-4 mb-6">
            <div>
              <div className="text-sm text-gray-300">Your rating</div>
              <Stars value={userRating} editable={!!userId} onChange={handleRate} />
            </div>

            <div className="ml-4">
              <div className="text-sm text-gray-300">Average</div>
              <div className="flex items-center gap-2">
                <Stars value={Math.round((avgRating || book.rating || 0) || 0)} />
                <span className="text-sm text-gray-400">
                  { (avgRating ?? book.rating)?.toFixed(1) || "—" } / 5
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-300 leading-relaxed mb-6">{book.synopsis || book.description}</p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate(`/read/${book.id}`)}
              className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded text-white"
            >
              Read Now
            </button>

            <button
              onClick={handleAddToLibrary}
              disabled={isAdded}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                isAdded ? "bg-green-600 text-white" : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              <FaRegBookmark /> {isAdded ? "Added ✓" : "Add to Library"}
            </button>
          </div>

          {/* Comments */}
          <div className="mt-10 bg-gray-900 p-5 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Comments</h3>

            {userId ? (
              <div className="mb-4">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded bg-gray-800 text-gray-100"
                  placeholder="Share your thoughts..."
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handlePostComment}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                  >
                    Post
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-4 text-sm text-gray-400">
                <a href="/login" className="text-indigo-400">Log in</a> to post comments or rate.
              </div>
            )}

            <div className="space-y-3">
              {comments.length === 0 ? (
                <p className="text-gray-500">No comments yet — be the first to say something.</p>
              ) : (
                comments.map((c) => (
                  <div key={c._id || c.createdAt} className="p-3 bg-gray-800 rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-indigo-300">
                          {c.author || (c.userId === userId ? (user.username || "You") : "Anonymous")}
                        </div>
                        <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-200">{c.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
