import React from "react";

const Newsletter = () => {
  return (
    <section className="py-20 text-center bg-gray-100 dark:bg-black">
      <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Subscribe to our Newsletter
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Get the latest releases, updates, and offers directly to your inbox.
      </p>
      <form className="flex justify-center gap-2 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Enter your email"
          className="px-4 py-2 w-full rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
};

export default Newsletter;
