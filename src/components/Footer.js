import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-black text-black dark:text-white py-10 text-center">
     <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium px-4">
        &copy; {new Date().getFullYear()} Fun, Fiction & Fallacies. All rights reserved.
      </p>
      <div className="mt-3 space-x-4">
        {/* Add any footer icons or links here later */}
      </div>
    </footer>
  );
};

export default Footer;
