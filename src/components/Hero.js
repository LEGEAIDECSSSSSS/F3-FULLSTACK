export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center text-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-gray-900 transition-colors">
      <div className="max-w-2xl px-6">
        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
          Dive into <span className="text-indigo-500">Epic Stories</span> and
          Legendary Worlds
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Explore comics and graphic novels that inspire imagination. Read
          online or grab a physical copy — the adventure begins here.
        </p>
        <div className="flex justify-center gap-4">
          <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition-colors">
            Read Now
          </button>
          <button className="px-6 py-3 border border-gray-300 dark:border-gray-700 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-800 dark:text-gray-200">
            Shop Comics
          </button>
        </div>
      </div>
    </section>
  );
}
