import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function CreateChapter() {
  const [chapterTitle, setChapterTitle] = useState("");

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  const handleSave = () => {
    const html = editor.getHTML();
    console.log("Chapter Title:", chapterTitle);
    console.log("Content:", html);
    alert("Chapter saved (check console)");
  };

  if (!editor) return null;

  return (
    <div className="w-full min-h-screen px-6 sm:px-10 md:px-20 lg:px-32 py-10">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Create New Chapter
      </h1>

      {/* TITLE INPUT */}
      <input
        type="text"
        placeholder="Chapter title..."
        value={chapterTitle}
        onChange={(e) => setChapterTitle(e.target.value)}
        className="w-full mb-6 p-3 rounded-xl border border-gray-300 dark:border-gray-700 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                   focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
      />

      {/* TOOLBAR */}
      <div className="flex gap-3 mb-4 bg-gray-200 dark:bg-gray-700 p-3 rounded-xl">

        {/* Bold */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded-lg ${
            editor.isActive("bold")
              ? "bg-black text-white"
              : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          }`}
        >
          B
        </button>

        {/* Italic */}
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded-lg ${
            editor.isActive("italic")
              ? "bg-black text-white"
              : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          }`}
        >
          I
        </button>

        {/* Heading */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded-lg ${
            editor.isActive("heading", { level: 2 })
              ? "bg-black text-white"
              : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          }`}
        >
          H2
        </button>

        {/* Undo */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="px-3 py-1 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          Undo
        </button>

        {/* Redo */}
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="px-3 py-1 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          Redo
        </button>
      </div>

      {/* EDITOR */}
      <div
        className="border border-gray-300 dark:border-gray-700 rounded-xl min-h-[300px] 
                   p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        <EditorContent editor={editor} />
      </div>

      {/* SAVE BUTTON */}
      <button
        onClick={handleSave}
        className="mt-6 bg-black text-white px-6 py-3 rounded-xl shadow-md 
                   hover:bg-gray-800 transition-all"
      >
        Save Chapter
      </button>
    </div>
  );
}
