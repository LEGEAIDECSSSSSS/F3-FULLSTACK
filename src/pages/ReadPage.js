// src/pages/ReadPage.js
import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

// ✅ Updated CSS imports for react-pdf v10+
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// ✅ Correct worker setup for pdfjs-dist v5+
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const ReadPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Fetch book details dynamically from backend
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`/api/books/${id}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setBook(res.data);
      } catch (err) {
        console.error("Error fetching book:", err.response?.data || err.message);
        setError("Failed to load book details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, user]);

  // ✅ Handle PDF page count once loaded
  const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

  // ✅ Page navigation
  const nextPage = () => pageNumber < numPages && setPageNumber(pageNumber + 1);
  const prevPage = () => pageNumber > 1 && setPageNumber(pageNumber - 1);

  // ✅ Loading state
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-700 dark:text-gray-200">
        Loading book...
      </div>
    );

  // ✅ Error state
  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700 dark:text-gray-200">
        <p>{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Go Back
        </button>
      </div>
    );

  // ✅ If book data failed or is missing
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

  // ✅ Use relative path for PDF source — works for production and localhost
  const pdfSource = book.pdfUrl || null;

  console.log("📄 PDF source URL:", pdfSource);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        {book.title}
      </h1>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg w-[90%] max-w-4xl">
        {pdfSource ? (
          <Document
            file={pdfSource}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<p>Loading PDF...</p>}
            onLoadError={(err) => console.error("PDF Load Error:", err)}
          >
            <Page pageNumber={pageNumber} renderTextLayer renderAnnotationLayer />
          </Document>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">
            No PDF available for this book.
          </p>
        )}
      </div>

      {numPages && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={prevPage}
            disabled={pageNumber <= 1}
            className="bg-gray-700 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-600 disabled:opacity-40"
          >
            <FaArrowLeft /> Prev
          </button>

          <span className="text-gray-800 dark:text-gray-200">
            Page {pageNumber} of {numPages}
          </span>

          <button
            onClick={nextPage}
            disabled={pageNumber >= numPages}
            className="bg-gray-700 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-600 disabled:opacity-40"
          >
            Next <FaArrowRight />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ReadPage;
