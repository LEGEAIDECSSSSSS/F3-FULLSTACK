import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const BookSection = ({ title, books, addToCart }) => {
  return (
    <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Section title */}
        <motion.h2
          className="text-3xl font-bold mb-10 text-gray-800 dark:text-gray-100"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          {title}
        </motion.h2>

        {/* Book grid */}
       <div className="grid gap-4 grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-6">

          {books.map((book, index) => (
            <motion.div
              key={index}
              className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: { opacity: 0, y: 60 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, delay: index * 0.1 },
                },
              }}
            >
              <img
                src={book.img}
                alt={book.title}
                className="w-full h-55 object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 sm:group-hover:bg-opacity-40 flex flex-col justify-center items-center text-center transition-all duration-300">

                <h3 className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {book.title}
                </h3>
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-wrap justify-center gap-2">
  <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 whitespace-nowrap sm:px-2 sm:py-1 sm:text-xs">
    Read Online
  </button>
  <button
    onClick={() => addToCart(book)}
    className="px-3 py-1.5 bg-white text-gray-800 rounded-lg text-sm hover:bg-gray-200 whitespace-nowrap sm:px-2 sm:py-1 sm:text-xs"
  >
    Add to Cart
  </button>
</div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookSection;
