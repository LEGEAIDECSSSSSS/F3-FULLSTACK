import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

const categories = [
  {
    title: "New Releases",
    books: [
      { title: "The Silent Heir", img: "https://picsum.photos/300/450?random=1" },
      { title: "Whispers of Dawn", img: "https://picsum.photos/300/450?random=2" },
      { title: "Echoes of Time", img: "https://picsum.photos/300/450?random=3" },
      { title: "Shadowborn", img: "https://picsum.photos/300/450?random=4" },
      { title: "Moonlight Prophecy", img: "https://picsum.photos/300/450?random=5" },
    ],
  },
  {
    title: "Best Sellers",
    books: [
      { title: "Crimson Skies", img: "https://picsum.photos/300/450?random=6" },
      { title: "The Lost Path", img: "https://picsum.photos/300/450?random=7" },
      { title: "Rise of the Ember", img: "https://picsum.photos/300/450?random=8" },
      { title: "Last Voyage", img: "https://picsum.photos/300/450?random=9" },
      { title: "Frozen Legacy", img: "https://picsum.photos/300/450?random=10" },
    ],
  },
  {
    title: "Fantasy & Adventure",
    books: [
      { title: "Crown of Mist", img: "https://picsum.photos/300/450?random=11" },
      { title: "Warden of Fire", img: "https://picsum.photos/300/450?random=12" },
      { title: "The Hidden Realm", img: "https://picsum.photos/300/450?random=13" },
      { title: "Oathbreaker", img: "https://picsum.photos/300/450?random=14" },
      { title: "The Last Mage", img: "https://picsum.photos/300/450?random=15" },
    ],
  },
];

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <div className="content">
        {categories.map((category, i) => (
          <div key={i} className="category">
            <h2 className="category-title">{category.title}</h2>
            <div className="book-row">
              {category.books.map((book, j) => (
                <div key={j} className="book-card">
                  <img src={book.img} alt={book.title} className="book-img" />
                  <div className="book-overlay">
                    <h3>{book.title}</h3>
                    <div className="book-actions">
                      <button className="read-btn">Read Online</button>
                      <button className="buy-btn">Buy Physical Copy</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
