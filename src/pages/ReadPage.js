// src/pages/ReadPage.js (Fully responsive PDF scaling — fits width & height without clipping)
import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const ReadPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [pdfWidth, setPdfWidth] = useState(0);
  const [pdfHeight, setPdfHeight] = useState(0);
  const [loading, setLoading] = useState(true);

  const viewerRef = useRef(null);
  const touchStartX = useRef(null);

  const apiBase =
    process.env.REACT_APP_API_URL ||
    (window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://funficfalls.onrender.com");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/books/${id}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setBook(res.data);
      } catch (err) {
        console.error("Error fetching book:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, user, apiBase]);

  const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

  const onPageLoad = ({ width, height }) => {
  setPdfWidth(prev => (prev === 0 ? width : prev));
  setPdfHeight(prev => (prev === 0 ? height : prev));
};

  // === TRUE RESPONSIVE PDF SCALING ===
  useEffect(() => {
    const updateScale = () => {
      const container = viewerRef.current;
      if (!container || pdfWidth === 0 || pdfHeight === 0) return;

      const containerWidth = container.clientWidth - 20;
      const containerHeight = container.clientHeight - 20;

      const scaleX = containerWidth / pdfWidth;
      const scaleY = containerHeight / pdfHeight;

      setScale(Math.min(scaleX, scaleY));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [pdfWidth, pdfHeight]);

  const nextPage = () => pageNumber < numPages && setPageNumber(pageNumber + 1);
  const prevPage = () => pageNumber > 1 && setPageNumber(pageNumber - 1);

  // === TOUCH SWIPE HANDLERS ===
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;

    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - endX;

    if (Math.abs(diff) > 60) {
      diff > 0 ? nextPage() : prevPage();
    }
    touchStartX.current = null;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-700 dark:text-gray-200">
        Loading book...
      </div>
    );

  if (!book)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700 dark:text-gray-200">
        <p>Book not found or access denied.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Go Back
        </button>
      </div>
    );

  const pdfFileUrl = book.pdfUrl
    ? book.pdfUrl.startsWith("http")
      ? book.pdfUrl
      : `${apiBase}/uploads/${book.pdfUrl}`
    : null;

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Top Bar */}
      <div className="w-full sticky top-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-sm py-3 flex items-center px-4 border-b border-gray-200/30 dark:border-gray-700/30">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-800 dark:text-gray-100 hover:opacity-70 mr-3"
        >
          <FaArrowLeft size={22} />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate tracking-wide">
          {book.title}
        </h1>
      </div>

      {/* PDF Viewer - True Fit */}
      <div
        ref={viewerRef}
        className="relative w-full flex justify-center items-center overflow-hidden mt-2"
        style={{ height: "calc(100vh - 80px)" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Desktop Arrows */}
        <button
          onClick={prevPage}
          className="hidden md:flex absolute left-3 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full"
        >
          <FaArrowLeft size={22} />
        </button>

        {/* PDF */}
        <div className="bg-white dark:bg-gray-800 p-1 rounded-xl shadow-xl border border-gray-200/40 dark:border-gray-700/40 max-h-full overflow-hidden">
          {pdfFileUrl ? (
            <Document file={pdfFileUrl} onLoadSuccess={onDocumentLoadSuccess}>
              <Page
                pageNumber={pageNumber}
                scale={scale}
                onLoadSuccess={onPageLoad}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          ) : (
            <p className="text-gray-700 dark:text-gray-300 py-10 text-center">
              No PDF available.
            </p>
          )}
        </div>

        <button
          onClick={nextPage}
          className="hidden md:flex absolute right-3 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full"
        >
          <FaArrowRight size={22} />
        </button>
      </div>
    </motion.div>
  );
};

export default ReadPage;
