import { useState, useEffect } from "react";
import { Moon, Sun, X, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoBlack from "../Images/file_00000000c6b862438fe1abb3f4152911.png";
import LogoWhite from "../Images/LOGO LIGHT 1.png";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ✅ Sync with system theme or saved user preference
  useEffect(() => {
    const isDark =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const newMode = !darkMode;

    if (newMode) {
      html.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      html.classList.remove("dark");
      localStorage.theme = "light";
    }

    setDarkMode(newMode);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* === LOGO === */}
        <Link to="/" className="flex items-center">
          <img
            src={darkMode ? LogoWhite : LogoBlack}
            alt="BookVerse Logo"
            className="h-[60px] w-auto transition-all duration-300 cursor-pointer"
          />
        </Link>

        {/* === DESKTOP NAV LINKS === */}
        <ul className="hidden md:flex items-center gap-8 text-gray-700 dark:text-gray-300 font-medium">
          <li>
            <Link to="/" className="hover:text-indigo-500 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link to="/comics" className="hover:text-indigo-500 transition-colors">
              Graphic Novels
            </Link>
          </li>
          <li>
            <Link to="/comics" className="hover:text-indigo-500 transition-colors">
              Web Novels
            </Link>
          </li>
          <li>
            <Link to="/shop" className="hover:text-indigo-500 transition-colors">
              Shop
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-indigo-500 transition-colors">
              About
            </Link>
          </li>

          {/* Only show My Library if logged in */}
          {user && (
            <li>
              <Link to="/library" className="hover:text-indigo-500 transition-colors">
                My Library
              </Link>
            </li>
          )}

          {/* === AUTH LINKS === */}
          {!user ? (
            <>
              <li>
                <Link to="/login" className="hover:text-indigo-500 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-indigo-500 transition-colors">
                  Signup
                </Link>
              </li>
            </>
          ) : (
            <li className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Hi, {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="bg-indigo-500 text-white px-3 py-1 rounded-md hover:bg-indigo-600 transition"
              >
                Logout
              </button>
            </li>
          )}
        </ul>

        {/* === RIGHT ACTIONS === */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:scale-105 transition-transform"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            {menuOpen ? (
              <X className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            )}
          </button>
        </div>
      </div>

      {/* === MOBILE SLIDE-IN MENU === */}
      <div
        className={`fixed top-0 right-0 h-full w-[75%] sm:w-[60%] md:hidden ${
          darkMode ? "bg-gray-900" : "bg-white"
        } shadow-2xl transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 border-l border-gray-200 dark:border-gray-700`}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Menu
          </h2>
          <button onClick={toggleMenu}>
            <X className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        <ul className="flex flex-col items-start p-6 space-y-5 font-medium text-base">
          {[
            { name: "Home", path: "/" },
            { name: "Graphic Novels", path: "/comics" },
            { name: "Web Novels", path: "/comics" },
            { name: "Shop", path: "/shop" },
            { name: "About", path: "/about" },
          ]
            .concat(user ? [{ name: "My Library", path: "/library" }] : [])
            .map((item, idx) => (
              <li key={idx}>
                <Link
                  to={item.path}
                  className="text-gray-800 dark:text-gray-200 hover:text-indigo-600 transition-colors"
                  onClick={toggleMenu}
                >
                  {item.name}
                </Link>
              </li>
            ))}

          {/* === AUTH LINKS MOBILE === */}
          {!user ? (
            <>
              <li>
                <Link
                  to="/login"
                  className="text-gray-800 dark:text-gray-200 hover:text-indigo-600 transition-colors"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="text-gray-800 dark:text-gray-200 hover:text-indigo-600 transition-colors"
                  onClick={toggleMenu}
                >
                  Signup
                </Link>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="w-full text-left text-indigo-500 font-semibold hover:text-indigo-600 transition"
              >
                Logout ({user.username})
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* === DARK OVERLAY WHEN MENU IS OPEN === */}
      {menuOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}
    </nav>
  );
}
