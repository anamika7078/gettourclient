import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import axios from "axios";
import { useState } from "react";

export default function ActivityManage() {
  const API_BASE = import.meta.env.VITE_API_URL;
  const [title, setTitle] = useState("");
  const [locationName, setLocationName] = useState("");
  const [locationLink, setLocationLink] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    message: "",
  });
  const [categories, setCategories] = useState([
    { value: "", label: "-- Select Category --" },
    { value: "best-cities", label: "Best Cities to Visit" },
    { value: "activities-dubai", label: "Best Activities in Dubai" },
    { value: "activities-abu-dhabi", label: "Best Activities in Abu Dhabi" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [charCount, setCharCount] = useState(0);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: true }),
      Link.configure({ openOnClick: true }),
      Image,
      Placeholder.configure({ placeholder: "Write all content here..." }),
    ],
    content: "",
    editable: true,
    onUpdate: ({ editor }) => {
      const div = document.createElement("div");
      div.innerHTML = editor.getHTML();
      const count = (div.textContent || div.innerText || "").trim().length;
      setCharCount(count);
    },
  });

  const handleSaveCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return alert("⚠️ Please enter a valid category name.");
    const value = trimmed.toLowerCase().replace(/\s+/g, "-");
    if (categories.some((c) => c.value === value))
      return alert("⚠️ Category already exists.");
    setCategories([...categories, { value, label: trimmed }]);
    setSelectedCategory(value);
    setNewCategory("");
    setShowNewCategory(false);
    alert("✅ New category added successfully!");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result }).run();
    };
    reader.readAsDataURL(file);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    editor
      .chain()
      .focus()
      .insertContent(
        `<video controls src="${url}" class="my-2 max-w-full"></video>`
      )
      .run();
  };

  const handleLink = () => {
    const url = prompt("Enter link URL");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      import Image from "@tiptap/extension-image";
      import Link from "@tiptap/extension-link";
      import Placeholder from "@tiptap/extension-placeholder";
      import { EditorContent, useEditor } from "@tiptap/react";
      import StarterKit from "@tiptap/starter-kit";
      import axios from "axios";
      import { useState } from "react";

      export default function ActivityManage() {
        const API_BASE = import.meta.env.VITE_API_URL;
        const [title, setTitle] = useState("");
        const [locationName, setLocationName] = useState("");
        const [locationLink, setLocationLink] = useState("");
        const [price, setPrice] = useState("");
        const [image, setImage] = useState(null);
        const [loading, setLoading] = useState(false);
        const [alert, setAlert] = useState({ show: false, type: "success", message: "" });
        const [categories, setCategories] = useState([
          { value: "", label: "-- Select Category --" },
          { value: "best-cities", label: "Best Cities to Visit" },
          { value: "activities-dubai", label: "Best Activities in Dubai" },
          { value: "activities-abu-dhabi", label: "Best Activities in Abu Dhabi" },
        ]);
        const [selectedCategory, setSelectedCategory] = useState("");
        const [showNewCategory, setShowNewCategory] = useState(false);
        const [newCategory, setNewCategory] = useState("");

        const [charCount, setCharCount] = useState(0);
        const editor = useEditor({
          extensions: [
            StarterKit.configure({ codeBlock: true }),
            Link.configure({ openOnClick: true }),
            Image,
            Placeholder.configure({ placeholder: "Write all content here..." }),
          ],
          content: "",
          editable: true,
          onUpdate: ({ editor }) => {
            const div = document.createElement("div");
            div.innerHTML = editor.getHTML();
            const count = (div.textContent || div.innerText || "").trim().length;
            setCharCount(count);
          },
        });

        const handleSaveCategory = () => {
          const trimmed = newCategory.trim();
          if (!trimmed) return alert("⚠️ Please enter a valid category name.");
          const value = trimmed.toLowerCase().replace(/\s+/g, "-");
          if (categories.some((c) => c.value === value)) return alert("⚠️ Category already exists.");
          setCategories([...categories, { value, label: trimmed }]);
          setSelectedCategory(value);
          setNewCategory("");
          setShowNewCategory(false);
          alert("✅ New category added successfully!");
        };

        const handleImageUpload = (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          import Image from "@tiptap/extension-image";
          import Link from "@tiptap/extension-link";
          import Placeholder from "@tiptap/extension-placeholder";
          import { EditorContent, useEditor } from "@tiptap/react";
          import StarterKit from "@tiptap/starter-kit";
          import axios from "axios";
          import { useState } from "react";

          export default function ActivityManage() {
            const API_BASE = import.meta.env.VITE_API_URL;
            const [title, setTitle] = useState("");
            const [locationName, setLocationName] = useState("");
            const [locationLink, setLocationLink] = useState("");
            const [price, setPrice] = useState("");
            const [image, setImage] = useState(null);
            const [loading, setLoading] = useState(false);
            const [alert, setAlert] = useState({ show: false, type: "success", message: "" });
            const [categories, setCategories] = useState([
              { value: "", label: "-- Select Category --" },
              { value: "best-cities", label: "Best Cities to Visit" },
              { value: "activities-dubai", label: "Best Activities in Dubai" },
              { value: "activities-abu-dhabi", label: "Best Activities in Abu Dhabi" },
            ]);
            const [selectedCategory, setSelectedCategory] = useState("");
            const [showNewCategory, setShowNewCategory] = useState(false);
            const [newCategory, setNewCategory] = useState("");

            const [charCount, setCharCount] = useState(0);
            const editor = useEditor({
              extensions: [
                StarterKit.configure({ codeBlock: true }),
                Link.configure({ openOnClick: true }),
                Image,
                Placeholder.configure({ placeholder: "Write all content here..." }),
              ],
              content: "",
              editable: true,
              onUpdate: ({ editor }) => {
                const div = document.createElement("div");
                div.innerHTML = editor.getHTML();
                const count = (div.textContent || div.innerText || "").trim().length;
                setCharCount(count);
              },
            });

            const handleSaveCategory = () => {
              const trimmed = newCategory.trim();
              if (!trimmed) return alert("⚠️ Please enter a valid category name.");
              const value = trimmed.toLowerCase().replace(/\s+/g, "-");
              if (categories.some((c) => c.value === value)) return alert("⚠️ Category already exists.");
              setCategories([...categories, { value, label: trimmed }]);
              setSelectedCategory(value);
              setNewCategory("");
              setShowNewCategory(false);
              alert("✅ New category added successfully!");
            };

            const handleImageUpload = (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => editor.chain().focus().setImage({ src: reader.result }).run();
              reader.readAsDataURL(file);
            };

            const handleVideoUpload = (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = URL.createObjectURL(file);
              editor.chain().focus().insertContent(`<video controls src="${url}" class="my-2 max-w-full"></video>`).run();
            };

            const handleLink = () => {
              const url = prompt("Enter link URL");
              if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
            };

            const handleSubmit = (e) => {
              e.preventDefault();
              if (!title.trim()) {
                setAlert({ show: true, type: "error", message: "Please enter a title." });
                return;
              }

              const detailsHTML = editor.getHTML();
              const fd = new FormData();
              fd.append("title", title);
              fd.append("locationName", locationName);
              fd.append("locationLink", locationLink);
              fd.append("price", price);
              fd.append("category", selectedCategory);
              fd.append("details", detailsHTML);
              if (image) fd.append("image", image);

              setLoading(true);
              axios
                .post(`${API_BASE}/api/activities`, fd)
                .then(() => {
                  setAlert({ show: true, type: "success", message: "Activity added successfully." });
                  setTitle("");
                  setLocationName("");
                  setLocationLink("");
                  setPrice("");
                  setSelectedCategory("");
                  setImage(null);
                  editor?.commands?.setContent("");
                })
                .catch((err) => {
                  const msg = err?.response?.data?.error || err?.message || "Failed to add activity.";
                  setAlert({ show: true, type: "error", message: msg });
                })
                .finally(() => setLoading(false));
            };

            return (
              <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
                <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">Add New Activity</h1>

                {alert.show && (
                  <div
                    className={`mb-6 rounded-lg p-4 text-sm ${
                      alert.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{alert.message}</span>
                      <button
                        type="button"
                        onClick={() => setAlert({ ...alert, show: false })}
                        className="ml-3 text-xs opacity-70 hover:opacity-100"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">🟩 Basic Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Title"
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Location Name"
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                      />
                      <input
                        type="url"
                        placeholder="Location Link"
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                        value={locationLink}
                        onChange={(e) => setLocationLink(e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                      <input
                        type="file"
                        className="w-full border rounded-lg px-4 py-2 md:col-span-2"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                      />
                    </div>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">🟦 Detail Page Content</h2>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-medium text-gray-600">Category</label>
                        <button
                          type="button"
                          className="text-blue-600 hover:underline text-sm"
                          onClick={() => setShowNewCategory((v) => !v)}
                        >
                          + Add New Category
                        </button>
                      </div>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 bg-white"
                      >
                        {categories.map((c) => (
                          <option key={c.value || "placeholder"} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>

                      {showNewCategory && (
                        <div className="mt-2 flex gap-2">
                          <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="flex-1 border rounded-lg px-3 py-2"
                            placeholder="New category name"
                          />
                          <button
                            type="button"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            onClick={handleSaveCategory}
                          >
                            Save
                          </button>
                        </div>
                      )}
                    </div>

                    {editor && (
                      <div className="mb-2 border rounded-lg p-2">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {[
                            "Bold",
                            "Italic",
                            "Strike",
                            "H1",
                            "H2",
                            "Bullet List",
                            "Ordered List",
                            "Link",
                            "Code Block",
                            "Clear",
                          ].map((btn) => {
                            const actions = {
                              Bold: () => editor.chain().focus().toggleBold().run(),
                              Italic: () => editor.chain().focus().toggleItalic().run(),
                              Strike: () => editor.chain().focus().toggleStrike().run(),
                              H1: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
                              H2: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
                              "Bullet List": () => editor.chain().focus().toggleBulletList().run(),
                              "Ordered List": () => editor.chain().focus().toggleOrderedList().run(),
                              Link: handleLink,
                              "Code Block": () => editor.chain().focus().toggleCodeBlock().run(),
                              Clear: () => editor.chain().focus().unsetAllMarks().clearNodes().run(),
                            };
                            return (
                              <button
                                type="button"
                                key={btn}
                                onClick={actions[btn]}
                                className="px-2 py-1 border rounded hover:bg-gray-100"
                              >
                                {btn}
                              </button>
                            );
                          })}
                          <label className="px-2 py-1 border rounded hover:bg-gray-100 cursor-pointer">
                            Image
                            <input type="file" className="hidden" onChange={handleImageUpload} />
                          </label>
                          <label className="px-2 py-1 border rounded hover:bg-gray-100 cursor-pointer">
                            Video
                            <input type="file" className="hidden" onChange={handleVideoUpload} />
                          </label>
                        </div>

                        <EditorContent editor={editor} className="border rounded-lg p-3 min-h-[300px] focus:outline-none" />
                      </div>
                    )}
                    <div className="text-right text-sm text-gray-500">Characters: {charCount}</div>
                  </section>

                  <div className="text-center">
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60" disabled={loading}>
                      {loading ? "Saving..." : "Save Activity"}
                    </button>
                  </div>
                </form>
              </div>
            );
          }
