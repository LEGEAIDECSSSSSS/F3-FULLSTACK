import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope } from "react-icons/fa";

const AboutPage = () => {
  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 py-20 px-6 text-center">
      <h1 className="text-4xl font-bold mb-6">About Fun, Fiction & Fallacies</h1>
      <p className="max-w-2xl mx-auto text-lg leading-relaxed mb-10">
        Fun, Fiction & Fallacies is where storytellers come to break the rules.
        <br />
        <br />
        We’re an indie home for writers and artists who want to tell raw,
        creative, and boundary-pushing stories — from graphic novels and web
        novels to original fiction.
        <br />
        <br />
        Our goal is to give creators freedom, and give readers stories that make
        them think, laugh, and question everything they thought they knew.
      </p>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Connect With Us</h2>
        <div className="flex justify-center space-x-6 text-2xl">
          <a href="#" className="hover:text-indigo-500">
            <FaFacebook />
          </a>
          <a href="#" className="hover:text-pink-500">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-sky-500">
            <FaTwitter />
          </a>
          <a href="mailto:contact@funfictionfallacies.com" className="hover:text-red-500">
            <FaEnvelope />
          </a>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="max-w-md mx-auto text-gray-600 dark:text-gray-400">
          Got questions, ideas, or stories to share?  
          <br />Reach out to us anytime at{" "}
          <span className="text-indigo-500">contact@funfictionfallacies.com</span>.
        </p>
      </div>
    </section>
  );
};

export default AboutPage;
