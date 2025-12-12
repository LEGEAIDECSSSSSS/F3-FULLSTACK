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
    alert("Chapter saved.");
  };

  if (!editor) return null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4 py-10 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black">

      {/* Hero Heading */}
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 text-center text-gray-900 dark:text-white tracking-tight">
        Canvas
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-xl">
        Start writing inside our clean, canvas-style editor. Build your book chapter by chapter with powerful formatting tools.
      </p>

      {/* White Card */}
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 shadow-xl rounded-3xl p-8 border border-gray-200 dark:border-gray-700 transition-all">

        {/* Title Input */}
        <input
          type="text"
          placeholder="Enter chapter title..."
          value={chapterTitle}
          onChange={(e) => setChapterTitle(e.target.value)}
          className="w-full mb-6 p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-300 
                     dark:border-gray-700 text-gray-900 dark:text-white text-xl font-semibold 
                     focus:outline-none focus:ring-4 focus:ring-black/20 dark:focus:ring-white/20 transition-all"
        />

        {/* Floating Toolbar */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-black/40 shadow-lg border border-gray-300 dark:border-gray-700 
                        rounded-2xl px-4 py-2 flex items-center gap-3 sticky top-4 z-20 mb-4">

          {/* Tool Button Component */}
          {[
            { label: "B", action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
            { label: "I", action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
            {
              label: "H2",
              action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
              active: editor.isActive("heading", { level: 2 }),
            },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.action}
              className={`px-3 py-1.5 text-sm rounded-xl transition-all font-semibold
                ${btn.active
                  ? "bg-black text-white dark:bg-white dark:text-black shadow"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                }`}
            >
              {btn.label}
            </button>
          ))}

          {/* Undo */}
          <button
            onClick={() => editor.chain().focus().undo().run()}
            className="px-3 py-1.5 text-sm rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 
                       dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
          >
            Undo
          </button>

          {/* Redo */}
          <button
            onClick={() => editor.chain().focus().redo().run()}
            className="px-3 py-1.5 text-sm rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 
                       dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
          >
            Redo
          </button>
        </div>

        {/* Writing Canvas */}
        <div className="min-h-[400px] p-6 rounded-3xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white 
                        shadow-inner border border-gray-300 dark:border-gray-700 prose dark:prose-invert max-w-none">
          <EditorContent editor={editor} />
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-semibold
                       shadow-md hover:shadow-xl transition-all"
          >
            Save Chapter
          </button>
        </div>
      </div>
    </div>
  );
}
