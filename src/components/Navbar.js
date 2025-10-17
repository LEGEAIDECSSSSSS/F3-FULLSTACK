// src/components/Navbar.jsx
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

  // Sync darkMode with localStorage / system preference on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && prefersDark);

    if (isDark) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }

    const onResize = () => {
      if (window.innerWidth >= 768 && menuOpen) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen]);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const newMode = !darkMode;

    if (newMode) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    setDarkMode(newMode);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => setMenuOpen((s) => !s);

  return (
    <>
      {/* NAVBAR */}
      <nav
        className="fixed top-0 left-0 w-full z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-700 transition-all duration-300"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between w-full px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 py-3">
          {/* LEFT: Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src={darkMode ? LogoWhite : LogoBlack}
              alt="Site logo"
              className="h-[56px] w-auto transition-all duration-300"
            />
          </Link>

          {/* CENTER: Nav links */}
          <ul
            className="hidden md:flex flex-1 justify-center items-center gap-6 lg:gap-10 text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base lg:text-lg"
            role="menubar"
          >
            <li role="none">
              <Link
                role="menuitem"
                to="/"
                className="hover:text-indigo-500 transition px-1"
              >
                Home
              </Link>
            </li>
            <li role="none">
              <Link
                role="menuitem"
                to="/comics"
                className="hover:text-indigo-500 transition px-1"
              >
                Graphic Novels
              </Link>
            </li>
            <li role="none">
              <Link
                role="menuitem"
                to="/web-novels"
                className="hover:text-indigo-500 transition px-1"
              >
                Web Novels
              </Link>
            </li>
            <li role="none">
              <Link
                role="menuitem"
                to="/shop"
                className="hover:text-indigo-500 transition px-1"
              >
                Shop
              </Link>
            </li>
            <li role="none">
              <Link
                role="menuitem"
                to="/about"
                className="hover:text-indigo-500 transition px-1"
              >
                About
              </Link>
            </li>
            {user && (
              <li role="none">
                <Link
                  role="menuitem"
                  to="/library"
                  className="hover:text-indigo-500 transition px-1"
                >
                  My Library
                </Link>
              </li>
            )}
          </ul>

          {/* RIGHT: Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:scale-105 transition-transform"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {/* Auth Buttons (desktop) */}
            <div className="hidden md:flex items-center gap-3">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-500 text-sm sm:text-base font-medium transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-indigo-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm sm:text-base hover:bg-indigo-600 transition"
                  >
                    Signup
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-300 hidden lg:inline">
                    Hi, {user.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-indigo-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm sm:text-base hover:bg-indigo-600 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              aria-label="Open menu"
            >
              {menuOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE SLIDE-IN MENU */}
      <div
        className={`fixed top-0 right-0 h-full w-[75%] sm:w-[60%] md:hidden z-50 transform transition-transform duration-300 ease-in-out
                    ${menuOpen ? "translate-x-0" : "translate-x-full"}
                    ${darkMode ? "bg-gray-900 bg-opacity-100" : "bg-white bg-opacity-100"} shadow-2xl border-l ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-5 border-b ${
            darkMode ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <h3
            className={`text-lg font-semibold ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Menu
          </h3>
          <button onClick={toggleMenu} aria-label="Close menu">
            <X className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        {/* Links */}
        <nav className="p-6">
          <ul className="flex flex-col gap-5 font-medium text-base">
            <li>
              <Link
                to="/"
                onClick={toggleMenu}
                className="block text-gray-800 dark:text-gray-200 hover:text-indigo-600 transition"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/comics"
                onClick={toggleMenu}
                className="block text-gray-800 dark:text-gray-200 hover:text-indigo-600 transition"
              >
                Graphic Novels
              </Link>
            </li>
            <li>
              <Link
                to="/web-novels"
                onClick={toggleMenu}
                className="block text-gray-800 dark:text-gray-200 hover:text-indigo-600 transition"
              >
                Web Novels
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                onClick={toggleMenu}
                className="block text-gray-800 dark:text-gray-200 hover:text-indigo-600 transition"
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={toggleMenu}
                className="block text-gray-800 dark:text-gray-200 hover:text-indigo-600 transition"
              >
                About
              </Link>
            </li>
            {user && (
              <li>
                <Link
                  to="/library"
                  onClick={toggleMenu}
                  className="block text-gray-800 dark:text-gray-200 hover:text-indigo-600 transition"
                >
                  My Library
                </Link>
              </li>
            )}
          </ul>

          {/* Mobile auth actions */}
          <div className="mt-8 border-t pt-6">
            {!user ? (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={toggleMenu}
                  className="text-gray-800 dark:text-gray-200 hover:text-indigo-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={toggleMenu}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-md text-center hover:bg-indigo-600 transition"
                >
                  Signup
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <span className="text-gray-200">
                  Signed in as <strong>{user.username}</strong>
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          aria-hidden="true"
        />
      )}
    </>
  );
}
