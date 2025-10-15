// src/context/LibraryContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const [library, setLibrary] = useState([]);

  // Load saved library from localStorage on mount
  useEffect(() => {
    const savedLibrary = localStorage.getItem("library");
    if (savedLibrary) setLibrary(JSON.parse(savedLibrary));
  }, []);

  // Save to localStorage whenever library changes
  useEffect(() => {
    localStorage.setItem("library", JSON.stringify(library));
  }, [library]);

  // Add book (if not already added)
  const addToLibrary = (book) => {
    if (!library.find((item) => item.id === book.id)) {
      setLibrary([...library, book]);
    }
  };

  // Remove book
  const removeFromLibrary = (id) => {
    setLibrary(library.filter((item) => item.id !== id));
  };

  return (
    <LibraryContext.Provider value={{ library, addToLibrary, removeFromLibrary }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => useContext(LibraryContext);
