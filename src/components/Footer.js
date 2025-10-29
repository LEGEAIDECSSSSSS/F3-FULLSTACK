import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-black text-black dark:text-white py-10 text-center">
      <p>&copy; {new Date().getFullYear()} Fun, Fiction & Fallacies. All rights reserved.</p>
      <div className="mt-3 space-x-4">
      </div>
    </footer>
  );
};

export default Footer;
