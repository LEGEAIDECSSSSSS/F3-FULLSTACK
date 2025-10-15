import { useState } from "react";
import { Moon, Sun, ShoppingCart, X, Menu } from "lucide-react";
import LogoBlack from "../Images/file_00000000c6b862438fe1abb3f4152911.png";
import LogoWhite from "../Images/LOGO LIGHT 1.png";

export default function Navbar({ cartItems = [], onRemoveItem, onCheckout }) {
  const [darkMode, setDarkMode] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  const toggleCart = () => setShowCart(!showCart);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 relative">
        {/* === LOGO === */}
        <div className="flex items-center">
          <img
            src={darkMode ? LogoWhite : LogoBlack}
            alt="BookVerse Logo"
            className="h-[65px] w-auto transition-all duration-300 cursor-pointer"
          />
        </div>

        {/* === NAV LINKS (Desktop) === */}
        <ul className="hidden md:flex items-center gap-8 text-gray-700 dark:text-gray-300 font-medium">
          <li className="hover:text-indigo-500 transition-colors cursor-pointer">Home</li>
          <li className="hover:text-indigo-500 transition-colors cursor-pointer">Comics</li>
          <li className="hover:text-indigo-500 transition-colors cursor-pointer">Shop</li>
          <li className="hover:text-indigo-500 transition-colors cursor-pointer">About</li>
        </ul>

        {/* === RIGHT ACTIONS === */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <div
            className="relative cursor-pointer hover:scale-110 transition-transform"
            onClick={toggleCart}
          >
            <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
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

          {/* Hamburger Menu (Mobile) */}
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

        {/* === Mobile Menu (Slide-In) === */}
        <div
          className={`fixed top-0 right-0 h-full w-[70%] ${
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

          <ul className="flex flex-col items-start p-5 space-y-6 font-medium text-lg">
            <li className="text-gray-800 dark:text-gray-200 hover:text-indigo-600 transition-colors cursor-pointer">
              Home
            </li>
            <li className="text-gray-800 dark:text-gray-200 hover:text-indigo-600 transition-colors cursor-pointer">
              Comics
            </li>
            <li className="text-gray-800 dark:text-gray-200 hover:text-indigo-600 transition-colors cursor-pointer">
              Shop
            </li>
            <li className="text-gray-800 dark:text-gray-200 hover:text-indigo-600 transition-colors cursor-pointer">
              About
            </li>
          </ul>
        </div>

        {/* === Mini Cart Dropdown === */}
        {showCart && (
          <div
            className="absolute right-0 top-16 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 
            dark:border-gray-700 overflow-hidden z-50 animate-fadeIn"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Your Cart
              </h3>
              <button
                onClick={toggleCart}
                className="text-gray-500 hover:text-red-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-6">
                Your cart is empty
              </p>
            ) : (
              <div className="max-h-60 overflow-y-auto">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {item.title}
                      </p>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.title)}
                      className="text-red-500 hover:text-red-600 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {cartItems.length > 0 && (
              <div className="p-4">
                <button
                  onClick={onCheckout}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-colors"
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* === Overlay when menu is open === */}
      {menuOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}
    </nav>
  );
}
