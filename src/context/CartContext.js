import React, { createContext, useContext, useState } from "react";

// Create the context
const CartContext = createContext();

// Custom hook for easy access
export const useCart = () => useContext(CartContext);

// Provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add book to cart
  const addToCart = (book) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.title === book.title);
      if (existing) return prev; // avoid duplicates
      return [...prev, book];
    });
  };

  // Remove book from cart
  const removeFromCart = (title) => {
    setCartItems((prev) => prev.filter((item) => item.title !== title));
  };

  // Clear cart
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
