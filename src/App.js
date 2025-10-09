// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import BookCard from "./components/BookCard";
import ReaderPage from "./components/ReaderPage";
import books from "./data";
import "./App.css";
import BuyPage from "./components/BuyPage";


function HomePage() {
  return (
    <>
      <header className="hero">
        <h2>Welcome to BookVerse</h2>
        <p>Your world of stories — read online or buy a physical copy.</p>
      </header>

      <section id="books" className="book-section">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </section>
    </>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/read/:id" element={<ReaderPage />} />
        <Route path="/buy/:id" element={<BuyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
