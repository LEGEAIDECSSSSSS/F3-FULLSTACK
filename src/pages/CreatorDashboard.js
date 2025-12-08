// Full Creator Dashboard with sidebar, analytics, notifications, comments, settings, theme toggle
// NOTE: This is a full layout skeleton. You will need to hook real API data later.

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Moon, Sun, Bell, BarChart3, MessageSquare, Settings, BookOpen, PlusCircle, LogOut } from "lucide-react";
import axios from "axios";

export default function CreatorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState({ books: 0, totalReads: 0, likes: 0 });
  const [recentBooks, setRecentBooks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));

    const fetchData = async () => {
      try {
        const res = await axios.get("/api/creator/stats");
        setStats(res.data);

        const booksRes = await axios.get("/api/creator/recent-books");
        setRecentBooks(booksRes.data);

        const notifRes = await axios.get("/api/creator/notifications");
        setNotifications(notifRes.data);

        const commentsRes = await axios.get("/api/creator/comments");
        setComments(commentsRes.data);
      } catch {
        console.log("Using placeholder data");
      }
    };
    fetchData();
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-black">
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-black shadow-xl p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Creator Panel</h2>

          <nav className="space-y-4">
            <SidebarItem icon={<PlusCircle />} label="Create New Book" onClick={() => navigate("/create-book")} />
            <SidebarItem icon={<BookOpen />} label="Manage My Books" onClick={() => navigate("/creator-books")} />
            <SidebarItem icon={<BarChart3 />} label="Analytics" onClick={() => navigate("/analytics")} />
            <SidebarItem icon={<MessageSquare />} label="Comments" onClick={() => navigate("/comments")} />
            <SidebarItem icon={<Bell />} label="Notifications" onClick={() => navigate("/notifications")} />
            <SidebarItem icon={<Settings />} label="Settings" onClick={() => navigate("/settings")} />
          </nav>
        </div>

        <div className="space-y-4">
          <button onClick={toggleTheme} className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg flex items-center justify-center gap-2">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />} {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <button
            onClick={logout}
            className="w-full p-3 bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Header user={user} />
        <DashboardStats stats={stats} />
        <RecentBooks recentBooks={recentBooks} navigate={navigate} />
        <NotificationsPanel notifications={notifications} />
        <CommentsPanel comments={comments} />
        <SettingsPanel />
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
    >
      {icon} {label}
    </button>
  );
}

function Header({ user }) {
  return (
    <div className="mb-10">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
        Welcome back, {user?.username}
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mt-2">
        Here is your full creator dashboard with everything you need.
      </p>
    </div>
  );
}


function DashboardStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <StatCard label="Books" value={stats.books} color="emerald" />
      <StatCard label="Reads" value={stats.totalReads} color="blue" />
      <StatCard label="Likes" value={stats.likes} color="red" />
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{label}</h3>
      <p className={`text-4xl font-bold text-${color}-600 mt-2`}>{value}</p>
    </div>
  );
}

function RecentBooks({ recentBooks, navigate }) {
  return (
    <section className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-lg mb-10">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recently Added Books</h2>
      {recentBooks.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No books uploaded yet.</p>
      ) : (
        <div className="space-y-3">
          {recentBooks.map((b) => (
            <div key={b._id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl flex justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{b.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{new Date(b.createdAt).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => navigate(`/book/${b._id}`)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function NotificationsPanel({ notifications }) {
  return (
    <section className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-lg mb-10">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No new notifications.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n, i) => (
            <li key={i} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">{n.message}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

function CommentsPanel({ comments }) {
  return (
    <section className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-lg mb-10">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Comments</h2>
      {comments.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c, i) => (
            <li key={i} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
              <p className="font-semibold text-gray-900 dark:text-white">{c.username}</p>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{c.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function SettingsPanel() {
  return (
    <section className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-lg mb-10">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Settings</h2>
      <p className="text-gray-600 dark:text-gray-300">Profile settings, password change, and more can go here.</p>
    </section>
  );
}
