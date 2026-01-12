// src/context/LibraryContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const { authApi, accessToken } = useAuth();
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper: normalize image URLs safely
  const resolveImgUrl = (img) => {
    if (!img) return "/images/default-cover.jpg";
    if (/^https?:\/\//i.test(img)) return img;
    if (img.startsWith("/images/")) return img;
    return `/images/${img}`;
  };

  // Map backend book data → frontend book data (use 'img' field)
  const mapBookData = (books) =>
    (books || []).map((b) => ({
      ...b,
      img: resolveImgUrl(b.img), // <-- use 'img' from backend
    }));

  // Fetch library whenever accessToken changes
  useEffect(() => {
    const fetchLibrary = async () => {
      if (!accessToken) {
        setLibrary([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await authApi.get("/library");
        setLibrary(mapBookData(res.data.books));
      } catch (err) {
        console.error("Error fetching library:", err);
        setLibrary([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [accessToken, authApi]);

  // Add a book to library
  const addToLibrary = async (book) => {
    if (!accessToken) {
      alert("Please log in to add books.");
      return;
    }

    try {
      // Send the book to backend exactly as it expects
      const res = await authApi.post("/library/add", { book });

      // Update local library state
      setLibrary(mapBookData(res.data.books));
    } catch (err) {
      console.error("Error adding book:", err);
      alert(err.response?.data?.message || "Failed to add book.");
    }
  };

  // Remove a book from library
  const removeFromLibrary = async (id) => {
    if (!accessToken) {
      alert("Please log in to remove books.");
      return;
    }

    try {
      const res = await authApi.delete(`/library/remove/${id}`);
      setLibrary(mapBookData(res.data.books));
    } catch (err) {
      console.error("Error removing book:", err);
      alert(err.response?.data?.message || "Failed to remove book.");
    }
  };

  return (
    <LibraryContext.Provider
      value={{
        library,
        loading,
        addToLibrary,
        removeFromLibrary,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => useContext(LibraryContext);
