import React from "react";
import { useNavigate } from "react-router-dom";
import "./ComicCard.css";

export default function ComicCard({ comic }) {
  const navigate = useNavigate();

  const handleRead = () => navigate(`/read/${comic.id}`);
  const handleBuy = () => navigate(`/buy/${comic.id}`);

  return (
    <div className="comic-card">
      <img src={comic.cover} alt={comic.title} />
      <div className="overlay">
        <h3>{comic.title}</h3>
        <p>{comic.author}</p>
        <div className="buttons">
          <button onClick={handleRead}>Read Now</button>
          <button onClick={handleBuy}>Buy</button>
        </div>
      </div>
    </div>
  );
}
