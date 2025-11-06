// src/pages/ReadPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaMoon, FaSun, FaExpand } from "react-icons/fa";

const ReadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [sampleText, setSampleText] = useState("");

  useEffect(() => {
    // Simulate fetching book content (later this can fetch a PDF)
    setTimeout(() => {
      setSampleText(`
        Chapter 1: The Beginning

        The rain fell softly against the windowpane, each drop echoing like a whisper in the quiet room. 
        In the dim glow of her reading lamp, Amelia turned another page of the ancient book, 
        unaware that the words she read would soon change everything...

        Chapter 2: The Stranger

        The knock came at midnight — sharp, deliberate, and far too confident. 
        She hesitated only a moment before opening the door to find a man who looked as though 
        he’d stepped out of the very pages she’d been reading.

        (Sample text — this is where your book content or embedded PDF will load.)
      `);
    }, 1000);
  }, [id]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-black text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Top bar */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700 bg-opacity-80 backdrop-blur-md sticky top-0 z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-500 hover:text-indigo-400"
        >
          <FaArrowLeft /> Back
        </motion.button>

        <div className="flex gap-4 items-center">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-lg hover:scale-110 transition-transform"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="text-lg hover:scale-110 transition-transform"
          >
            <FaExpand />
          </button>
        </div>
      </div>

      {/* Reading area */}
      <div className="max-w-4xl mx-auto py-10 px-6 md:px-10 leading-relaxed text-lg font-serif">
        {!sampleText ? (
          <p className="text-center mt-20 text-gray-400 animate-pulse">
            Loading content...
          </p>
        ) : (
          <pre
            className="whitespace-pre-wrap"
            style={{
              lineHeight: "1.9rem",
              fontSize: "1.05rem",
              fontFamily: "Georgia, serif",
            }}
          >
            {sampleText}
          </pre>
        )}
      </div>
    </div>
  );
};

export default ReadPage;
