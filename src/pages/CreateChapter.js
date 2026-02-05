import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function CreateChapter() {
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterId, setChapterId] = useState(null); // 🔑 MongoDB ID
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: {
      attributes: {
        class:
          "focus:outline-none min-h-full prose dark:prose-invert max-w-none",
      },
    },
  });

  // Word count
  const wordCount = editor
    ? editor.getText().trim().split(/\s+/).filter(Boolean).length
    : 0;

  // 🔹 SAVE TO MONGODB
  const handleSave = async () => {
    if (!editor || !chapterTitle.trim() || !editor.getText().trim()) return;

    setSaving(true);

    try {
      const res = await fetch("http://localhost:5000/api/chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: chapterId, // if null → create, else → update
          title: chapterTitle,
          content: editor.getHTML(),
        }),
      });

      const data = await res.json();

      // store ID so future saves update same chapter
      if (!chapterId) {
        setChapterId(data._id);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save chapter", err);
    } finally {
      setSaving(false);
    }
  };

  // 🔹 AUTO-SAVE (ONLINE)
  useEffect(() => {
    if (!editor) return;

    const interval = setInterval(() => {
      if (chapterTitle || editor.getText()) {
        handleSave();
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [editor, chapterTitle, chapterId]);

  if (!editor) return null;

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-black">

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <input
            type="text"
            placeholder="Chapter title..."
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
            className="w-full sm:max-w-xl px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border 
                       border-gray-300 dark:border-gray-700 text-lg font-semibold 
                       focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
          />

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>{wordCount} words</span>
            {saving && <span className="text-yellow-500">Saving…</span>}
            {saved && <span className="text-green-500">Saved</span>}
          </div>
        </div>

        {/* Toolbar */}
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {[
            {
              label: "B",
              action: () =>
                editor.chain().focus().toggleBold().run(),
              active: editor.isActive("bold"),
            },
            {
              label: "I",
              action: () =>
                editor.chain().focus().toggleItalic().run(),
              active: editor.isActive("italic"),
            },
            {
              label: "H2",
              action: () =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: 2 })
                  .run(),
              active: editor.isActive("heading", { level: 2 }),
            },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.action}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap
                ${
                  btn.active
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
            >
              {btn.label}
            </button>
          ))}

          <button
            onClick={() => editor.chain().focus().undo().run()}
            className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-800 text-sm"
          >
            Undo
          </button>

          <button
            onClick={() => editor.chain().focus().redo().run()}
            className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-800 text-sm"
          >
            Redo
          </button>
        </div>
      </header>

      {/* Editor */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-4xl h-full bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-inner border border-gray-200 dark:border-gray-800">
          <EditorContent editor={editor} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex justify-end">
        <button
          onClick={handleSave}
          disabled={
            saving ||
            !chapterTitle.trim() ||
            !editor.getText().trim()
          }
          className="px-6 py-2 rounded-xl font-semibold 
                     bg-black dark:bg-white text-white dark:text-black 
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Chapter"}
        </button>
      </footer>
    </div>
  );
}
