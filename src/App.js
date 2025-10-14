import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BookSection from "./components/BookSection";
import FeaturedComics from "./components/FeaturedComics";
import Newsletter from "./components/Newsletter";
import About from "./components/About";
import Footer from "./components/Footer";

const categories = [
  {
    title: "New Releases",
    books: [
      { id: 1, title: "The Silent Heir", img: "https://picsum.photos/300/450?random=1", price: 10 },
      { id: 2, title: "Whispers of Dawn", img: "https://picsum.photos/300/450?random=2", price: 12 },
      { id: 3, title: "Echoes of Time", img: "https://picsum.photos/300/450?random=3", price: 14 },
      { id: 4, title: "Shadowborn", img: "https://picsum.photos/300/450?random=4", price: 11 },
      { id: 5, title: "Moonlight Prophecy", img: "https://picsum.photos/300/450?random=5", price: 13 },
    ],
  },
  {
    title: "Best Sellers",
    books: [
      { id: 6, title: "Crimson Skies", img: "https://picsum.photos/300/450?random=6", price: 15 },
      { id: 7, title: "The Lost Path", img: "https://picsum.photos/300/450?random=7", price: 17 },
      { id: 8, title: "Rise of the Ember", img: "https://picsum.photos/300/450?random=8", price: 20 },
      { id: 9, title: "Last Voyage", img: "https://picsum.photos/300/450?random=9", price: 13 },
      { id: 10, title: "Frozen Legacy", img: "https://picsum.photos/300/450?random=10", price: 18 },
    ],
  },
  {
    title: "Fantasy & Adventure",
    books: [
      { id: 11, title: "Crown of Mist", img: "https://picsum.photos/300/450?random=11", price: 14 },
      { id: 12, title: "Warden of Fire", img: "https://picsum.photos/300/450?random=12", price: 16 },
      { id: 13, title: "The Hidden Realm", img: "https://picsum.photos/300/450?random=13", price: 19 },
      { id: 14, title: "Oathbreaker", img: "https://picsum.photos/300/450?random=14", price: 15 },
      { id: 15, title: "The Last Mage", img: "https://picsum.photos/300/450?random=15", price: 18 },
    ],
  },
];

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // ✅ Add to cart
  const addToCart = (book) => {
    setCartItems((prev) => {
      if (!prev.find((item) => item.id === book.id)) {
        return [...prev, book];
      }
      return prev;
    });
  };

  // ✅ Remove from cart
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ Toggle Dark Mode
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`app min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Navbar (Global Cart + Dark Mode) */}
      <Navbar
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
      />

      <Hero />

      {/* Book Categories */}
      {categories.map((category, i) => (
        <BookSection
          key={i}
          title={category.title}
          books={category.books}
          addToCart={addToCart}
        />
      ))}

      <FeaturedComics />
      <Newsletter />
      <About />
      <Footer />
    </div>
  );
}

export default App;
