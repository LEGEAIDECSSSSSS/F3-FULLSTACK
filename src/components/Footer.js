import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 text-center">
      <p>&copy; {new Date().getFullYear()} Fun, Fiction & Fallacies. All rights reserved.</p>
      <div className="mt-3 space-x-4">
        <a href="#" className="hover:text-indigo-400">Privacy Policy</a>
        <a href="#" className="hover:text-indigo-400">Terms of Use</a>
      </div>
    </footer>
  );
};

export default Footer;
