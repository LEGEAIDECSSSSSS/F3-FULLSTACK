// src/components/Hero.jsx
import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative w-full h-[85vh] flex items-center justify-center bg-gradient-to-b from-emerald-900/80 to-black/90 dark:from-gray-900 dark:to-black overflow-hidden">
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1950&q=80"
        alt="Books Background"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg"
        >
          Dive Into New Worlds
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-200 mt-4"
        >
          Explore thrilling comics and graphic novels — read online or grab your copy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex justify-center gap-4 mt-8"
        >
          <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full shadow-md transition-all duration-300 hover:scale-105">
            Read Now
          </button>
          <button className="px-6 py-3 bg-white text-emerald-700 font-semibold rounded-full shadow-md transition-all duration-300 hover:bg-gray-100 hover:scale-105">
            Shop Books
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
