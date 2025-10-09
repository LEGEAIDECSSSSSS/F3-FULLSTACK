// src/components/BookCard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./BookCard.css";

export default function BookCard({ book }) {
  const navigate = useNavigate();

  const handleRead = () => {
    navigate(`/read/${book.id}`);
  };

  const handleBuy = () => {
    navigate(`/buy/${book.id}`);
  };

  return (
    <div className="book-card">
      <img src={book.cover} alt={book.title} />
      <h3>{book.title}</h3>
      <p>By {book.author}</p>
      <p className="price">${book.price.toFixed(2)}</p>
      <div className="buttons">
        <button className="read-btn" onClick={handleRead}>
          Read Online
        </button>
        <button className="buy-btn" onClick={handleBuy}>
          Buy Physical Copy
        </button>
      </div>
    </div>
  );
}
