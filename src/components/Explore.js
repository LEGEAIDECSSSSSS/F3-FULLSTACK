import React from "react";
import { FaTwitter, FaInstagram, FaFacebook, FaEnvelope } from "react-icons/fa";

const About = () => {
  return (
    <section className="py-20 px-6 bg-gray-50 dark:bg-black text-gray-800 dark:text-gray-200">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h2 className="text-4xl font-bold text-center mb-6">
          About Fun, Fiction & Fallacies
        </h2>
        <p className="text-center max-w-3xl mx-auto text-gray-600 dark:text-gray-400 mb-12">
          Fun, Fiction & Fallacies is where storytellers come to break the rules.
          We’re an indie home for writers and artists who want to tell raw,
          creative, and boundary-pushing stories — from graphic novels and web
          fiction to original short stories. Our goal is to give creators freedom,
          and give readers stories that make them think, laugh, and question
          everything they thought they knew.
        </p>

        {/* Cards Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Mission */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-400">
              To create a space where imagination runs wild, stories challenge
              convention, and artists are empowered to express freely without
              filters or limitations.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
            <p className="text-gray-600 dark:text-gray-400">
              To become a global hub for creative storytelling — a platform that
              connects diverse voices and inspires a new generation of storytellers.
            </p>
          </div>

          {/* Join Us */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Join Us</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Want to write, illustrate, or collaborate? We’re always looking for
              passionate creators who aren’t afraid to think differently. Let’s make
              something amazing together.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 dark:border-gray-700 my-12"></div>

        {/* Socials */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-4">Connect With Us</h3>
          <div className="flex justify-center gap-6 mb-4">
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition"
            >
              <FaTwitter size={26} />
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-pink-500 transition"
            >
              <FaInstagram size={26} />
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-700 transition"
            >
              <FaFacebook size={26} />
            </a>
            <a
              href="mailto:info@funfictionfallacies.com"
              className="text-gray-600 dark:text-gray-400 hover:text-red-500 transition"
            >
              <FaEnvelope size={26} />
            </a>
          </div>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            Let’s stay connected. Follow us on social media or reach out directly.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
