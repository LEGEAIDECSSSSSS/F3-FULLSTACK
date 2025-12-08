import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CreatorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Creator Dashboard
        </h1>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Welcome, <span className="font-semibold">{user?.username}</span> 👋  
          <br />
          Manage your books, create new ones, and track engagement.
        </p>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => navigate("/create-book")}
            className="p-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
          >
            ➕ Create New Book
          </button>

          <button
            onClick={() => navigate("/creator-books")}
            className="p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            📚 Manage My Books
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
