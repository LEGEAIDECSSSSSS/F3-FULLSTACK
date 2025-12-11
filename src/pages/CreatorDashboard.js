import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Bell,
  BarChart3,
  MessageSquare,
  Settings,
  BookOpen,
  PlusCircle,
  Upload,
  Edit3,
} from "lucide-react";
import axios from "axios";

export default function CreatorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState({ books: 0, totalReads: 0, likes: 0 });
  const [recentBooks, setRecentBooks] = useState([]);

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));

    const fetchData = async () => {
      try {
        const statsRes = await axios.get("/api/creator/stats");
        setStats(statsRes.data);

        const booksRes = await axios.get("/api/creator/recent-books");
        setRecentBooks(booksRes.data);
      } catch {
        console.log("Using placeholder data");
      }
    };
    fetchData();
  }, []);

  const tiles = [
    { icon: <Upload size={32} />, label: "Upload Book", onClick: () => navigate("/upload-book") },
    { icon: <Edit3 size={32} />, label: "Update / Edit", onClick: () => navigate("/edit-books") },
    { icon: <BookOpen size={32} />, label: "Manage My Books", onClick: () => navigate("/creator-books") },
    { icon: <BarChart3 size={32} />, label: "Analytics", onClick: () => navigate("/analytics") },
    { icon: <MessageSquare size={32} />, label: "Comments", onClick: () => navigate("/comments") },
    { icon: <Bell size={32} />, label: "Notifications", onClick: () => navigate("/notifications") },
    { icon: <Settings size={32} />, label: "Settings", onClick: () => navigate("/settings") },
  ];

  const statsTiles = [
    { label: "Books", value: stats.books },
    { label: "Reads", value: stats.totalReads },
    { label: "Likes", value: stats.likes },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-black">
      <Navbar />

      <main className="flex-1 pt-28 md:pt-32 px-4 md:px-10">
        {/* CENTRAL HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">Creator Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Welcome back, {user?.username} — manage your books and stats here.</p>
        </div>

       {/* CANVAS TILE */}
<div
  onClick={() => navigate("/create-book")}
  className="
    cursor-pointer w-full mb-10 
    px-6 sm:px-10 md:px-14 
    bg-transparent border-2 border-black dark:border-gray-600 
    text-gray-800 dark:text-white 
    shadow-xl flex flex-col items-center justify-center text-center 
    hover:bg-gray-50 dark:hover:bg-gray-800 transition
    py-10 sm:py-14
  "
  style={{ borderRadius: 0, minHeight: "45vh" }}
>
  <PlusCircle size={60} className="mb-6" />

  {/* Responsive title */}
  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
    CANVAS
  </h2>

  {/* Responsive paragraph */}
  <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl px-2">
    Start writing inside our clean, canvas-style editor. Build your book chapter
    by chapter with powerful formatting tools.
  </p>
</div>


        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 mb-10">
          {statsTiles.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 bg-white dark:bg-gray-700 shadow-lg flex flex-col items-center justify-center text-center rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
              <span className="text-gray-700 dark:text-gray-300 mt-2 text-lg">{stat.label}</span>
            </div>
          ))}
        </div>

<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
  {tiles.map((tile, idx) => {
    const isLast = idx === tiles.length - 1;

    return (
      <div
        key={idx}
        onClick={tile.onClick}
        className={`
          cursor-pointer h-36 sm:h-40 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-3 
          bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition
          ${isLast
            ? `
              col-span-full
              sm:col-span-1
              mx-auto
              w-2/3 sm:w-full
              lg:col-start-2
            `
            : "w-full"
          }
        `}
      >
        {/* FIXED ICON ALIGNMENT */}
        <div className="flex items-center justify-center h-10 w-10 text-gray-800 dark:text-white">
          {tile.icon}
        </div>

        <span className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          {tile.label}
        </span>
      </div>
    );
  })}
</div>




        {/* RECENT BOOKS */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Recently Added Books</h2>
          {recentBooks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No books uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {recentBooks.map((b) => (
                <div
                  key={b._id}
                  onClick={() => navigate(`/book/${b._id}`)}
                  className="cursor-pointer p-4 sm:p-6 bg-white dark:bg-gray-700 rounded-2xl shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                >
                  <h3 className="font-bold text-gray-900 dark:text-white">{b.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{new Date(b.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
