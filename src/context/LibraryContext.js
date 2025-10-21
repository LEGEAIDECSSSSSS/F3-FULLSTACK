import { createContext, useContext, useState, useEffect } from "react";

const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Fetch user library from backend
  useEffect(() => {
    const fetchLibrary = async () => {
      if (!token) {
        setLibrary([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/library", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch library");

        const data = await res.json();
        setLibrary(data.books || []);
      } catch (error) {
        console.error("Error fetching library:", error);
        setLibrary([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [token]);

  // Add book to library
  const addToLibrary = async (book) => {
    if (!token) {
      alert("Please log in to add books to your library.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/library/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ book }),
      });

      if (!res.ok) throw new Error("Failed to add book");

      const data = await res.json();
      setLibrary(data.books || []);
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  // Remove book from library
  const removeFromLibrary = async (id) => {
    if (!token) {
      alert("Please log in to remove books.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/library/remove/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to remove book");

      const data = await res.json();
      setLibrary(data.books || []);
    } catch (error) {
      console.error("Error removing book:", error);
    }
  };

  return (
    <LibraryContext.Provider value={{ library, addToLibrary, removeFromLibrary, loading }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => useContext(LibraryContext);
