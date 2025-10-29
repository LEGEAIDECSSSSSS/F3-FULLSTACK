import React from "react";
import { motion } from "framer-motion";
import { useLibrary } from "../context/LibraryContext";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const BookSection = ({ title, books }) => {
  const { library, addToLibrary } = useLibrary();
  const navigate = useNavigate();

  const defaultImg = process.env.PUBLIC_URL + "/images/default-cover.jpg";

  const resolveImgUrl = (img) => {
    if (!img) return defaultImg;
    if (img.startsWith("http")) return img;
    if (img.startsWith("/images/")) return process.env.PUBLIC_URL + img;
    if (img.includes("/static/")) return process.env.PUBLIC_URL + img;

    const apiBase = process.env.REACT_APP_API_URL || "http://localhost:5000";
    return `${apiBase}${img.startsWith("/") ? img : `/${img}`}`;
  };

  return (
    <section className="py-16 px-6 bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="w-full px-6 lg:px-12">
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
        <div
          className="
            grid gap-4
            grid-cols-3
            sm:grid-cols-4
            md:grid-cols-5
            lg:grid-cols-6
          "
        >
          {books.map((book, index) => {
            const isAdded = library.some(
              (item) =>
                item.id === book.id ||
                item._id === book._id ||
                item.title === book.title
            );

            const imgSrc = resolveImgUrl(book.img);

            return (
              <motion.div
                key={index}
                className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 bg-transparent cursor-pointer"
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
                {/* Book Image */}
                <img
                  src={imgSrc}
                  alt={book.title}
                  onError={(e) => (e.target.src = defaultImg)}
                  className="
                    w-full
                    h-auto
                    aspect-[2/3]
                    object-cover rounded-2xl
                    group-hover:scale-105
                    transition-transform duration-500
                  "
                />

                {/* Overlay */}
                <div
                  className="
                    absolute inset-0
                    bg-black bg-opacity-0
                    group-hover:bg-opacity-60
                    flex flex-col justify-center items-center text-center
                    transition-all duration-300
                    p-2 sm:p-3
                  "
                >
                  <h3 className="text-white text-sm sm:text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {book.title}
                  </h3>

                  <div
                    className="
                      mt-2 sm:mt-3 opacity-0 group-hover:opacity-100
                      transition-opacity duration-300
                      flex flex-col sm:flex-row justify-center items-center gap-2
                    "
                  >
                    <button
                      onClick={() => navigate(`/book/${book.id || book._id}`)}
                      className="
                        px-2 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-sm
                        bg-indigo-600 text-white rounded-lg
                        hover:bg-indigo-700
                        whitespace-nowrap
                      "
                    >
                      Read Online
                    </button>

                    {/* Add to Library */}
                    <button
                      onClick={() => {
                        if (!isAdded) {
                          addToLibrary({
                            id: book.id,
                            title: book.title,
                            img: imgSrc,
                          });
                        }
                      }}
                      disabled={isAdded}
                      className={` 
                        px-2 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-sm
                        rounded-lg whitespace-nowrap transition-all duration-300
                        ${
                          isAdded
                            ? "bg-green-600 text-white cursor-default"
                            : "bg-white text-gray-800 hover:bg-gray-200"
                        }
                      `}
                    >
                      {isAdded ? "Added ✓" : "Add to Library"}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BookSection;
