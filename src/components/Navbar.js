// src/components/Navbar.js
import React from "react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1>📚 BookVerse</h1>
      <div className="nav-links">
        <a href="#books">Books</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  );
}
