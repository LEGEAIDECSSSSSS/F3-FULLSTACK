import { useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          <span className="text-indigo-500">Book</span>Verse
        </h1>

        <ul className="hidden md:flex items-center gap-8 text-gray-700 dark:text-gray-300 font-medium">
          <li className="hover:text-indigo-500 transition-colors cursor-pointer">Home</li>
          <li className="hover:text-indigo-500 transition-colors cursor-pointer">Comics</li>
          <li className="hover:text-indigo-500 transition-colors cursor-pointer">Shop</li>
          <li className="hover:text-indigo-500 transition-colors cursor-pointer">About</li>
        </ul>

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
    </nav>
  );
}
