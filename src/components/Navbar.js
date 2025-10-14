import { useState } from "react";
import { Moon, Sun, ShoppingCart } from "lucide-react";
import LogoBlack from "../Images/file_00000000c6b862438fe1abb3f4152911.png";
import LogoWhite from "../Images/LOGO LIGHT 1.png";

export default function Navbar({ cartCount = 0 }) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        
        {/* === LOGO === */}
        <div className="flex items-center">
          <img
            src={darkMode ? LogoWhite : LogoBlack}
            alt="BookVerse Logo"
            className="h-[65px] w-auto transition-all duration-300"
          />
        </div>

        {/* === NAV LINKS === */}
        <ul className="hidden md:flex items-center gap-8 text-gray-700 dark:text-gray-300 font-medium">
          <li className="hover:text-indigo-500 transition-colors cursor-pointer">Home</li>
          <li className="hover:text-indigo-500 transition-colors cursor-pointer">Comics</li>
          <li className="hover:text-indigo-500 transition-colors cursor-pointer">Shop</li>
          <li className="hover:text-indigo-500 transition-colors cursor-pointer">About</li>
        </ul>

        {/* === RIGHT ACTIONS === */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <div className="relative cursor-pointer hover:scale-110 transition-transform">
            <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>

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
        </div>
      </div>
    </nav>
  );
}
