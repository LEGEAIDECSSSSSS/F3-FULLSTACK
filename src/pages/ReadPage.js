// src/pages/ReadPage.js
import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${
  pdfjs.version
}/build/pdf.worker.min.mjs`;

const ReadPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2); // responsive PDF scaling
  const [loading, setLoading] = useState(true);

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

  // Make PDF responsive
  useEffect(() => {
    const updateScale = () => {
      if (window.innerWidth < 500) setScale(0.9);
      else if (window.innerWidth < 768) setScale(1);
      else setScale(1.2);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const nextPage = () => pageNumber < numPages && setPageNumber(pageNumber + 1);
  const prevPage = () => pageNumber > 1 && setPageNumber(pageNumber - 1);

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
          className="mt-4 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
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
      className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* === FIXED TOP BAR === */}
      <div className="w-full sticky top-0 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-md py-3 flex items-center px-4">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-800 dark:text-gray-100 hover:opacity-80 mr-3"
        >
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white truncate">
          {book.title}
        </h1>
      </div>

      {/* === PDF CONTAINER === */}
      <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg w-[95%] max-w-3xl flex justify-center">
        {pdfFileUrl ? (
          <Document
            file={pdfFileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<p>Loading PDF...</p>}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">
            No PDF available for this book.
          </p>
        )}
      </div>

      {/* === CONTROLS === */}
      {numPages && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={prevPage}
            disabled={pageNumber <= 1}
            className="bg-gray-800 dark:bg-gray-700 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-600 disabled:opacity-30"
          >
            <FaArrowLeft /> Prev
          </button>

          <span className="text-gray-800 dark:text-gray-200 text-lg">
            {pageNumber} / {numPages}
          </span>

          <button
            onClick={nextPage}
            disabled={pageNumber >= numPages}
            className="bg-gray-800 dark:bg-gray-700 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-600 disabled:opacity-30"
          >
            Next <FaArrowRight />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ReadPage;
