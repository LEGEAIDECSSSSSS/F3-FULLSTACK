// src/App.js
import React, { useState } from "react";
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
import About from "./components/About";
import Footer from "./components/Footer";
import LibraryPage from "./pages/LibraryPage";
import { LibraryProvider, useLibrary } from "./context/LibraryContext";
import bg_dark from "./Images/bg_dark.jpg";
const categories = [
  {
    title: "New Releases",
    books: [
      { id: 1, title: "The Silent Heir", img: bg_dark, price: 10 },
      { id: 2, title: "Whispers of Dawn", img: bg_dark, price: 12 },
      { id: 3, title: "Echoes of Time", img: bg_dark, price: 14 },
      { id: 4, title: "Shadowborn", img: bg_dark, price: 11 },
      { id: 5, title: "Moonlight Prophecy", img: bg_dark, price: 13 },
    ],
  },
  {
    title: "Web Novels",
    books: [
      { id: 6, title: "Crimson Skies", img: bg_dark, price: 15 },
      { id: 7, title: "The Lost Path", img: bg_dark, price: 17 },
      { id: 8, title: "Rise of the Ember", img: bg_dark, price: 20 },
      { id: 9, title: "Last Voyage", img: bg_dark, price: 13 },
      { id: 10, title: "Frozen Legacy", img: bg_dark, price: 18 },
    ],
  },
  {
    title: "Graphic Novels",
    books: [
      { id: 11, title: "Crown of Mist", img: bg_dark, price: 14 },
      { id: 12, title: "Warden of Fire", img: bg_dark, price: 16 },
      { id: 13, title: "The Hidden Realm", img: bg_dark, price: 19 },
      { id: 14, title: "Oathbreaker", img: bg_dark, price: 15 },
      { id: 15, title: "The Last Mage", img: bg_dark, price: 18 },
    ],
  },
];

// 🏠 HomePage component
const HomePage = ({ addToLibrary, darkMode, toggleDarkMode }) => (
  <>
    <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
    <Hero />
    {categories.map((category, i) => (
      <BookSection
        key={i}
        title={category.title}
        books={category.books}
        addToLibrary={addToLibrary}
      />
    ))}
    <FeaturedComics />
    <Newsletter />
    <About />
    <Footer />
  </>
);

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
      className={`app min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"
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
         <Route path="/library" element={
          <ProtectedRoute>
            <LibraryPage />
          </ProtectedRoute>
        } 
      />
         <Route path="/login" element={<LoginPage />} />
         <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </div>
  );
}

export default App;
