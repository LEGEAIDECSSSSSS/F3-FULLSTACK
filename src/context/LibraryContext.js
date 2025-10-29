import { createContext, useContext, useState, useEffect } from "react";

const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000";

  // ✅ Helper: Normalize image URLs safely (for both frontend & backend sources)
  const resolveImgUrl = (img) => {
    if (!img) return "/images/default-cover.jpg";

    // Already a full URL (e.g. http://localhost:3000/images/bg_dark.jpg or external link)
    if (/^https?:\/\//i.test(img)) return img;

    // Already points to /images/... → keep as-is
    if (img.startsWith("/images/")) return img;

    // Just a filename → build path from /images/
    return `/images/${img}`;
  };

  // ✅ Fetch user library
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

  // ✅ Add book to library
  const addToLibrary = async (book) => {
    if (!token) {
      alert("Please log in to add books to your library.");
      return;
    }

    try {
      const cleanImg = resolveImgUrl(book.img);

      const res = await fetch(`${API_BASE_URL}/api/library/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          book: { ...book, img: cleanImg },
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

  // ✅ Remove book from library
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
