// src/components/BookSection.jsx
import React from "react";
import { motion } from "framer-motion";

const BookSection = ({ title, books }) => {
  return (
    <section className="py-12 px-6 md:px-12 bg-white dark:bg-gray-950 transition-colors duration-300">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
        {title}
      </h2>

      <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
        {books.map((book, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative min-w-[200px] md:min-w-[250px] rounded-xl overflow-hidden shadow-lg group cursor-pointer"
          >
            <img
              src={book.img}
              alt={book.title}
              className="w-full h-[300px] md:h-[380px] object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

            <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
              <h3 className="font-semibold text-lg mb-2">{book.title}</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-emerald-600 hover:bg-emerald-700 rounded-full">
                  Read
                </button>
                <button className="px-3 py-1 text-sm bg-white/90 text-black hover:bg-white rounded-full">
                  Buy
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BookSection;
