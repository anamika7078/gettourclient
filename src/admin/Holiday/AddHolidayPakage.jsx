import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Icons (using Heroicons)
const icons = {
  back: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
  ),
  plus: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  ),
  delete: (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  ),
  image: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  success: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  error: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  close: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
};

export default function AddHolidayPakage({ onClose, onSaved }) {
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [keepImages, setKeepImages] = useState(new Set());
  const [category, setCategory] = useState("");
  // Dynamic categories from backend holiday-categories
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    message: "",
  });
  const API_BASE = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { id } = useParams();

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder:
          "Write all content here including overview, highlights, itinerary, inclusions, exclusions, important info, etc...",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ header: [1, 2, 3, false] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "code-block"],
            [{ color: [] }, { background: [] }],
            ["clean"],
          ],
        },
      });

      quillRef.current.on("text-change", () => {
        const text = quillRef.current.getText().trim();
        setCharCount(text.length);
      });
    }
  }, []);

  // Load categories list
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/holiday-categories`);
        const data = await res.json();
        if (!res.ok)
          throw new Error(data?.error || "Failed to load holiday categories");
        const rows = Array.isArray(data) ? data : [];
        setCategories(rows);
        if (category && !rows.some((r) => r.name === category)) {
          setCategories((prev) => [...prev, { id: null, name: category }]);
        }
      } catch (e) {
        console.warn("Holiday categories load failed", e);
      }
    })();
  }, [API_BASE, category]);

  // Load existing record in edit mode
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/holidays/${id}`);
        const data = await res.json();
        if (!res.ok || !data?.success)
          throw new Error(data?.error || "Failed to load holiday");
        const r = data.data || {};
        setTitle(r.title || "");
        setDestination(r.destination || "");
        setDuration(r.duration || "");
        setPrice(String(r.price ?? ""));
        setCategory(r.category || "");

        let imgs = [];
        try {
          imgs =
            typeof r.images === "string"
              ? JSON.parse(r.images)
              : r.images || [];
          if (!Array.isArray(imgs)) imgs = [];
        } catch {
          imgs = [];
        }
        setExistingImages(imgs);
        setKeepImages(new Set(imgs));

        const html = r.details || "";
        if (quillRef.current) {
          quillRef.current.root.innerHTML = html;
          const text = quillRef.current.getText().trim();
          setCharCount(text.length);
        } else {
          setTimeout(() => {
            if (quillRef.current) {
              quillRef.current.root.innerHTML = html;
              const text = quillRef.current.getText().trim();
              setCharCount(text.length);
            }
          }, 50);
        }
      } catch (e) {
        console.error(e);
        setAlert({
          show: true,
          type: "error",
          message: e.message || "Failed to load holiday",
        });
      }
    })();
  }, [id, API_BASE]);

  const getDetailsHtml = () =>
    quillRef.current ? quillRef.current.root.innerHTML : "";

  const handleSave = async () => {
    setAlert({ show: false, type: "success", message: "" });

    const details = getDetailsHtml();
    if (!title.trim()) {
      setAlert({
        show: true,
        type: "error",
        message: "Please enter a package title.",
      });
      return;
    }
    if (!details || details === "<p><br></p>") {
      setAlert({
        show: true,
        type: "error",
        message: "Please add some details/overview for the package.",
      });
      return;
    }

    try {
      setSaving(true);
      const form = new FormData();
      form.append("title", title);
      form.append("destination", destination);
      form.append("duration", duration);
      form.append("price", String(Number(price || 0) || 0));
      form.append("category", category);
      form.append("details", details);

      if (id) {
        const keep = Array.from(keepImages);
        form.append("keepImages", JSON.stringify(keep));
        images.forEach((file) => form.append("newImages", file));
        const res = await fetch(`${API_BASE}/api/holidays/${id}`, {
          method: "PUT",
          body: form,
        });
        const data = await res.json();
        if (!res.ok || !data?.success)
          throw new Error(data?.error || "Failed to update holiday");

        setAlert({
          show: true,
          type: "success",
          message: "Holiday package updated successfully!",
        });
        if (typeof onSaved === "function") {
          onSaved(data.data);
        } else {
          setTimeout(
            () => navigate("/admin/holidays", { state: { updated: true } }),
            1000
          );
        }
      } else {
        images.forEach((file) => form.append("images", file));
        const res = await fetch(`${API_BASE}/api/holidays`, {
          method: "POST",
          body: form,
        });
        const data = await res.json();
        if (!res.ok || !data?.success)
          throw new Error(data?.error || "Failed to save holiday package");

        setAlert({
          show: true,
          type: "success",
          message: "Holiday package created successfully!",
        });
        if (typeof onSaved === "function") {
          onSaved(data.data);
        } else {
          setTimeout(
            () => navigate("/admin/holidays", { state: { created: true } }),
            1000
          );
        }
      }
    } catch (e) {
      setAlert({
        show: true,
        type: "error",
        message:
          e.message ||
          (id ? "Failed to update holiday" : "Failed to save holiday package"),
      });
    } finally {
      setSaving(false);
    }
  };

  // Image previews
  const previews = useMemo(() => {
    return images.map((file) => ({ file, url: URL.createObjectURL(file) }));
  }, [images]);

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const onImagesChange = (files) => {
    const arr = Array.from(files || []).filter(
      (f) => f && f.type?.startsWith("image/")
    );
    setImages((prev) => [...prev, ...arr]);
  };

  const removeImageAt = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const clearImages = () => setImages([]);

  // Categories management
  const addCategory = async () => {
    const name = newCategory.trim();
    if (!name) {
      setAlert({
        show: true,
        type: "error",
        message: "Please enter a category name.",
      });
      return;
    }
    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      setAlert({
        show: true,
        type: "error",
        message: "Category already exists.",
      });
      setNewCategory("");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/holiday-categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false)
        throw new Error(data?.error || "Failed to add category");
      setCategories((prev) => [...prev, { id: data.insertId, name }]);
      setCategory((cur) => cur || name);
      setAlert({
        show: true,
        type: "success",
        message: "Category added successfully!",
      });
    } catch (e) {
      setAlert({
        show: true,
        type: "error",
        message: e.message || "Add failed",
      });
    } finally {
      setNewCategory("");
    }
  };

  const deleteCategory = async (cat) => {
    if (!confirm(`Delete the category "${cat.name}"?`)) return;
    if (!cat.id) {
      setCategories((prev) => prev.filter((c) => c.name !== cat.name));
      setCategory((cur) => (cur === cat.name ? "" : cur));
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/holiday-categories/${cat.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || data?.success === false)
        throw new Error(data?.error || "Delete failed");
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      setCategory((cur) => (cur === cat.name ? "" : cur));
    } catch (e) {
      setAlert({
        show: true,
        type: "error",
        message: e.message || "Failed to delete",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {id ? "Edit Holiday Package" : "Create Holiday Package"}
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                {id
                  ? "Update your holiday package details"
                  : "Add a new holiday package to your offerings"}
              </p>
            </div>
            {onClose ? (
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors duration-200 shadow-sm"
              >
                {icons.close}
                Close
              </button>
            ) : (
              <button
                onClick={() => navigate("/admin/holidays")}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors duration-200 shadow-sm"
              >
                {icons.back}
                Back to Holidays
              </button>
            )}
          </div>
        </div>

        {/* Alert */}
        {alert.show && (
          <div
            className={`mb-8 p-4 rounded-xl border ${
              alert.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {alert.type === "success" ? icons.success : icons.error}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{alert.message}</p>
              </div>
              <button
                onClick={() => setAlert({ ...alert, show: false })}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-white/50 transition-colors"
              >
                {icons.close}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Basic Details Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Package Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Package Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Dubai Family Holiday"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Destination
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., Dubai, UAE"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., 5 Nights / 6 Days"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Price (Per Person)
                  </label>
                  <div className="relative">
                    {/* <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span> */}
                    <input
                      type="number"
                      placeholder="AED"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Images Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Package Images
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => onImagesChange(e.target.files)}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-orange-300"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Select multiple images to showcase your holiday package
                </p>
              </div>

              {/* New Image Previews */}
              {previews.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-700">
                      New Images ({previews.length})
                    </h3>
                    <button
                      type="button"
                      onClick={clearImages}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
                    >
                      {icons.delete}
                      Clear All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {previews.map((p, idx) => (
                      <div
                        key={idx}
                        className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
                      >
                        <img
                          src={p.url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImageAt(idx)}
                          className="absolute top-2 right-2 p-1 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                        >
                          {icons.delete}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Images */}
              {id && existingImages.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">
                    Existing Images
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {existingImages.map((name) => {
                      const kept = keepImages.has(name);
                      const url = `${API_BASE}/uploads/holidays/${name}`;
                      return (
                        <div
                          key={name}
                          className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            kept
                              ? "border-green-500"
                              : "border-gray-300 opacity-60"
                          }`}
                        >
                          <img
                            src={url}
                            alt={name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setKeepImages((prev) => {
                                const next = new Set(prev);
                                if (next.has(name)) next.delete(name);
                                else next.add(name);
                                return next;
                              });
                            }}
                            className={`absolute top-2 right-2 p-1 rounded-full text-white shadow-lg ${
                              kept
                                ? "bg-rose-500 hover:bg-rose-600"
                                : "bg-green-500 hover:bg-green-600"
                            } transition-colors duration-200`}
                          >
                            {kept ? icons.delete : icons.plus}
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2">
                            {kept ? "Keeping" : "Will remove"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Toggle images to keep or remove them when saving
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Content Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Package Content
              </h2>
            </div>
            <div className="p-6 space-y-8">
              {/* Category Selection */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Package Category
                  </label>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200"
                    onClick={() =>
                      document.getElementById("newCategoryInput")?.focus()
                    }
                  >
                    {icons.plus}
                    Add New Category
                  </button>
                </div>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id ?? c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {/* Add Category */}
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add New Category
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="newCategoryInput"
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="E.g., Luxury Escapes"
                      onKeyPress={(e) => e.key === "Enter" && addCategory()}
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium"
                      onClick={addCategory}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Categories List */}
                {categories.length > 0 && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Manage Categories
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categories.map((c) => (
                        <div
                          key={c.id ?? c.name}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <span className="text-sm font-medium text-gray-700">
                            {c.name}
                          </span>
                          <button
                            type="button"
                            className="p-1 text-rose-600 hover:bg-rose-100 rounded transition-colors duration-200"
                            onClick={() => deleteCategory(c)}
                          >
                            {icons.delete}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Rich Text Editor */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Package Details & Itinerary
                </label>
                <div className="border border-gray-300 rounded-xl overflow-hidden">
                  <div ref={editorRef} className="h-80 bg-white" />
                </div>
                <div className="text-right text-sm text-gray-500">
                  Character count:{" "}
                  <span className="font-medium">{charCount}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-center gap-4">
            {onClose ? (
              <button
                onClick={onClose}
                type="button"
                className="px-8 py-4 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-semibold shadow-sm"
              >
                Cancel
              </button>
            ) : (
              <button
                onClick={() => navigate("/admin/holidays")}
                type="button"
                className="px-8 py-4 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-semibold shadow-sm"
              >
                Back to Holidays
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {id ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {id ? "Update Package" : "Create Package"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
