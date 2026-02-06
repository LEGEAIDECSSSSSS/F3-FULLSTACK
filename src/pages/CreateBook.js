import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateBook() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [synopsis, setSynopsis] = useState("");

  useEffect(() => {
    if (!thumbnail) {
      setThumbnailPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(thumbnail);
    setThumbnailPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [thumbnail]);

  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click(); // Trigger hidden file input
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const bookData = {
      thumbnail,
      title,
      author,
      synopsis,
    };

    console.log("Book Data:", bookData);
    navigate("/create-chapter", { state: { bookData } });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-black px-4 py-10">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-gray-900 dark:text-white text-center">
        New Book Details
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-8"
      >
        {/* LEFT: Book Cover Box */}
        <div className="flex flex-col items-center w-full md:w-1/3">
          <span className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
            Book Cover
          </span>

          <div className="relative w-48 h-64 border-2 border-gray-300 dark:border-gray-600 rounded-xl shadow-lg overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-700 mb-4">
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                alt="Book Cover Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-center px-2">
                Upload an image to see the cover
              </span>
            )}

            {/* Overlay Title & Author */}
            {(title || author) && (
              <div className="absolute bottom-2 left-2 right-2 text-center text-white drop-shadow-lg">
                {title && (
                  <h2 className="text-sm sm:text-base font-bold truncate">
                    {title}
                  </h2>
                )}
                {author && (
                  <p className="text-xs sm:text-sm font-medium truncate">
                    {author}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Custom Upload Button */}
          <button
            type="button"
            onClick={handleUploadClick}
            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl shadow-lg transition-all"
          >
            {thumbnail ? "Change Cover" : "Upload Cover"}
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleThumbnailChange}
            className="hidden"
            required={!thumbnail}
          />
        </div>

        {/* RIGHT: Form Fields */}
        <div className="flex-1 flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-gray-700 dark:text-gray-300 font-semibold">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600"
              placeholder="Book Title"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-gray-700 dark:text-gray-300 font-semibold">Author</span>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="p-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600"
              placeholder="Author Name"
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-gray-700 dark:text-gray-300 font-semibold">Synopsis</span>
            <textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              className="p-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600"
              placeholder="Brief synopsis of the book"
              rows={6}
              required
            />
          </label>

          <button
            type="submit"
            className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            Continue to Canvas
          </button>
        </div>
      </form>
    </div>
  );
}
