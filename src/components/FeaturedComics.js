// src/components/FeaturedComics.js
import React from "react";
import { motion } from "framer-motion";
import bg_dark from "../Images/bg_dark.jpg"
import { img } from "framer-motion/client";

const comics = [
  {
    title: "The Orisha Chronicles", 
    genre: "Fantasy • Adventure",
    image: bg_dark,
  },
  {
    title: "Neon Shadows",
    genre: "Cyberpunk • Thriller",
    image: bg_dark,
  },
  {
    title: "The Forgotten Blade",
    genre: "Action • Mystery",
    image: bg_dark,
  },
];

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const FeaturedComics = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Section title */}
        <motion.h2
          className="text-3xl font-bold mb-12 text-gray-800 dark:text-gray-100"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          Featured Novels
        </motion.h2>

        {/* Comic cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {comics.map((comic, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, delay: index * 0.2 },
                },
              }}
            >
              <img
                src={comic.image}
                alt={comic.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {comic.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  {comic.genre}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More button */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-300">
            View More
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedComics;
