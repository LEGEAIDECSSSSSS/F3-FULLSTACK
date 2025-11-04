// src/App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BookSection from "./components/BookSection";
import FeaturedComics from "./components/FeaturedComics";
import Newsletter from "./components/Newsletter";
import Explore from "./components/Explore";
import AboutPage from "./pages/AboutPage";
import Footer from "./components/Footer";
import LibraryPage from "./pages/LibraryPage";
import BookDetails from "./pages/BookDetails";
import { LibraryProvider, useLibrary } from "./context/LibraryContext";
import axios from "axios";

const API_BASE =
  process.env.REACT_APP_API_URL?.trim() ||
  (window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : window.location.origin);

// 🏠 HomePage component
const HomePage = ({ addToLibrary, darkMode, toggleDarkMode }) => {
  const [booksByGenre, setBooksByGenre] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/books`);
        const books = res.data;

        // Group by genre
        const grouped = books.reduce((acc, book) => {
          const genre = book.genre || "Others";
          if (!acc[genre]) acc[genre] = [];
          acc[genre].push(book);
          return acc;
        }, {});
        setBooksByGenre(grouped);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />

      <main className="flex-grow">
        <Hero />

        {loading ? (
          <p className="text-center py-20">Loading books...</p>
        ) : (
          Object.keys(booksByGenre).map((genre, i) => (
            <BookSection
              key={i}
              title={genre}
              books={booksByGenre[genre]}
              addToLibrary={addToLibrary}
            />
          ))
        )}

        <FeaturedComics />
        <Newsletter />
        <Explore />
      </main>

      <Footer />
    </div>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <LibraryProvider>
      <AuthProvider>
        <Router>
          <AppContent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </Router>
      </AuthProvider>
    </LibraryProvider>
  );
}

function AppContent({ darkMode, toggleDarkMode }) {
  const { addToLibrary } = useLibrary();

  return (
    <div
      className={`app flex flex-col min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              addToLibrary={addToLibrary}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />
        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <LibraryPage />
            </ProtectedRoute>
          }
        />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </div>
  );
}

export default App;
