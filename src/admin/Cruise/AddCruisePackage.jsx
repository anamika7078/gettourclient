import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useRef, useState } from "react";
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
  calendar: (
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
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
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

export default function AddCruisePackage() {
  const [title, setTitle] = useState("");
  const [departurePort, setDeparturePort] = useState("");
  const [departureDates, setDepartureDates] = useState([]);
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [bannerVideoUrl, setBannerVideoUrl] = useState("");
  const [category, setCategory] = useState("");
  // categories now dynamic from backend: [{id,name,slug}]
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    message: "",
  });
  const [showModal, setShowModal] = useState(false);

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
          "Write overview, itinerary, inclusions, exclusions, important info, etc...",
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

  // Load categories list from backend
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cruise-categories`);
        const data = await res.json();
        if (!res.ok)
          throw new Error(data?.error || "Failed to load cruise categories");
        const rows = Array.isArray(data) ? data : [];
        setCategories(rows);
        // ensure selected category present when editing
        if (category && !rows.some((r) => r.name === category)) {
          setCategories((prev) => [...prev, { id: null, name: category }]);
        }
      } catch (e) {
        console.warn("Cruise categories load failed", e);
      }
    })();
  }, [API_BASE, category]);

  // load for edit
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cruises/${id}`);
        const data = await res.json();
        if (!res.ok || !data?.success)
          throw new Error(data?.message || "Failed to load");
        const r = data.data || {};
        setTitle(r.title || "");
        setDeparturePort(r.departure_port || "");
        try {
          const dd =
            typeof r.departure_dates === "string"
              ? JSON.parse(r.departure_dates)
              : r.departure_dates;
          setDepartureDates(Array.isArray(dd) ? dd : []);
        } catch {
          setDepartureDates([]);
        }
        setPrice(String(r.price ?? ""));
        setBannerVideoUrl(r.banner_video_url || "");
        setCategory(r.category || "");
        if (quillRef.current) {
          quillRef.current.root.innerHTML = r.details || "";
          const text = quillRef.current.getText().trim();
          setCharCount(text.length);
        }
      } catch (e) {
        setAlert({
          show: true,
          type: "error",
          message: e.message || "Failed to load cruise",
        });
      }
    })();
  }, [id, API_BASE]);

  const getDetailsHtml = () =>
    quillRef.current ? quillRef.current.root.innerHTML : "";

  const onSubmit = async () => {
    setAlert({ show: false, type: "success", message: "" });
    if (!title.trim()) {
      setAlert({
        show: true,
        type: "error",
        message: "Please enter Cruise Title",
      });
      return;
    }

    try {
      setSaving(true);
      const form = new FormData();
      form.append("title", title);
      form.append("departure_port", departurePort);
      form.append("departure_dates", JSON.stringify(departureDates));
      form.append("price", String(Number(price || 0) || 0));
      form.append("banner_video_url", bannerVideoUrl);
      form.append("category", category);
      form.append("details", getDetailsHtml());
      if (image) form.append("image", image);

      let res, data;
      if (id) {
        res = await fetch(`${API_BASE}/api/cruises/${id}`, {
          method: "PUT",
          body: form,
        });
        data = await res.json();
        if (!res.ok || !data?.success)
          throw new Error(data?.message || "Failed to update");
      } else {
        res = await fetch(`${API_BASE}/api/cruises`, {
          method: "POST",
          body: form,
        });
        data = await res.json();
        if (!res.ok || !data?.success)
          throw new Error(data?.message || "Failed to save");
      }
      setAlert({
        show: true,
        type: "success",
        message: "Cruise package saved successfully!",
      });
      setShowModal(true);
    } catch (e) {
      setAlert({
        show: true,
        type: "error",
        message: e.message || "Save failed",
      });
    } finally {
      setSaving(false);
    }
  };

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
      const res = await fetch(`${API_BASE}/api/cruise-categories`, {
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
      // local only
      setCategories((prev) => prev.filter((c) => c.name !== cat.name));
      setCategory((cur) => (cur === cat.name ? "" : cur));
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/cruise-categories/${cat.id}`, {
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

  const removeDateAt = (idx) => {
    setDepartureDates((prev) => prev.filter((_, i) => i !== idx));
  };

  const addDepartureDate = (dateString) => {
    if (!dateString) return;
    if (departureDates.includes(dateString)) {
      setAlert({
        show: true,
        type: "error",
        message: "This date is already added.",
      });
      return;
    }
    setDepartureDates((prev) => [...prev, dateString]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {id ? "Edit Cruise Package" : "Create Cruise Package"}
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                {id
                  ? "Update your cruise package details"
                  : "Add a new cruise package to your offerings"}
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/cruises")}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors duration-200 shadow-sm"
            >
              {icons.back}
              Back to Cruises
            </button>
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
                Cruise Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Cruise Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mediterranean Explorer Cruise"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Departure Port
                  </label>
                  <input
                    type="text"
                    placeholder="Dubai, UAE"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    value={departurePort}
                    onChange={(e) => setDeparturePort(e.target.value)}
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

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Banner Video Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=XXXXX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    value={bannerVideoUrl}
                    onChange={(e) => setBannerVideoUrl(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Cruise Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-orange-300"
                  />
                </div>

                {/* Departure Dates */}
                <div className="md:col-span-2 space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Departure Dates
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <input
                        type="date"
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v) addDepartureDate(v);
                          e.target.value = "";
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2">
                        {departureDates.map((d, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 border border-orange-200 rounded-full px-3 py-2 text-sm font-medium"
                          >
                            {icons.calendar}
                            {new Date(d).toLocaleDateString()}
                            <button
                              type="button"
                              className="text-orange-700 hover:text-orange-800 transition-colors"
                              onClick={() => removeDateAt(idx)}
                            >
                              {icons.delete}
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {departureDates.length > 0 && (
                    <p className="text-xs text-gray-500">
                      {departureDates.length} departure date(s) added
                    </p>
                  )}
                </div>
              </div>
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
                    Cruise Category
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
                      placeholder="e.g., Family Cruises"
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
                  Cruise Details & Itinerary
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
          <div className="flex justify-center">
            <button
              onClick={onSubmit}
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
                  {id ? "Update Cruise Package" : "Create Cruise Package"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                {icons.success}
              </div>
              <h3 className="text-lg font-bold text-gray-900">Success!</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Your cruise package has been {id ? "updated" : "created"}{" "}
              successfully.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                onClick={() => setShowModal(false)}
              >
                Add Another
              </button>
              <button
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium"
                onClick={() => navigate("/admin/cruises")}
              >
                Go to Manage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
