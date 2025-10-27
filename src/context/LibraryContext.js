import { createContext, useContext, useState, useEffect } from "react";

const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000";

  // ✅ Improved Helper: Normalize image URL
  const resolveImgUrl = (img) => {
    if (!img) return "/default-cover.jpg";

    // ✅ Case 1: Imported or locally served image (React static files)
    if (img.startsWith("/") || img.includes("static/")) return img;

    // ✅ Case 2: Fully qualified external link
    if (img.startsWith("http")) return img;

    // ✅ Case 3: Backend-served path (e.g., from /uploads)
    return `${API_BASE_URL}${img.startsWith("/") ? img : `/${img}`}`;
  };

  // Fetch user library
  useEffect(() => {
    const fetchLibrary = async () => {
      if (!token) {
        setLibrary([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/library`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch library");

        const data = await res.json();

        const updatedBooks = (data.books || []).map((book) => ({
          ...book,
          img: resolveImgUrl(book.img),
        }));

        setLibrary(updatedBooks);
      } catch (error) {
        console.error("Error fetching library:", error);
        setLibrary([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [token, API_BASE_URL]);

  // Add book
  const addToLibrary = async (book) => {
    if (!token) {
      alert("Please log in to add books to your library.");
      return;
    }

    try {
      const fullImgUrl = resolveImgUrl(book.img);

      const res = await fetch(`${API_BASE_URL}/api/library/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          book: { ...book, img: fullImgUrl },
        }),
      });

      if (!res.ok) throw new Error("Failed to add book");

      const data = await res.json();

      const updatedBooks = (data.books || []).map((b) => ({
        ...b,
        img: resolveImgUrl(b.img),
      }));

      setLibrary(updatedBooks);
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  // Remove book
  const removeFromLibrary = async (id) => {
    if (!token) {
      alert("Please log in to remove books.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/library/remove/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to remove book");

      const data = await res.json();

      const updatedBooks = (data.books || []).map((b) => ({
        ...b,
        img: resolveImgUrl(b.img),
      }));

      setLibrary(updatedBooks);
    } catch (error) {
      console.error("Error removing book:", error);
    }
  };

  return (
    <LibraryContext.Provider
      value={{ library, addToLibrary, removeFromLibrary, loading }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => useContext(LibraryContext);
