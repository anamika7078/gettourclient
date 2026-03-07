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

export default function AddCityPackage({ onClose, onSaved }) {
  const [title, setTitle] = useState("");
  const [cityName, setCityName] = useState("");
  const [locationUrl, setLocationUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [keepImages, setKeepImages] = useState(new Set());
  const [charCount, setCharCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    message: "",
  });

  // Category states
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  // City states
  const [cities, setCities] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState("");

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

  // Fetch categories for selected city only
  useEffect(() => {
    (async () => {
      try {
        const city = cities.find(
          (c) => String(c.id) === String(selectedCityId)
        );
        if (!city?.name) {
          setCategories([]);
          return;
        }
        const res = await fetch(
          `${API_BASE}/api/city-tour-categories/by-city/${encodeURIComponent(
            city.name
          )}`
        );
        if (res.ok) {
          const data = await res.json();
          setCategories(data.data || data || []);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error("Error fetching categories by city:", err);
        setCategories([]);
      }
    })();
  }, [API_BASE, selectedCityId, cities]);

  // Fetch cities from cities table
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cities`);
        if (res.ok) {
          const data = await res.json();
          setCities(data.data || data || []);
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    })();
  }, [API_BASE]);

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/api/city-tour-categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        const newCat = { id: data.id, name: data.name };
        setCategories([...categories, newCat]);
        setCategory(String(data.id));
        setNewCategory("");
      }
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  // Update category
  const handleUpdateCategory = async (cat) => {
    if (!editCategoryName.trim()) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/city-tour-categories/${cat.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: editCategoryName.trim() }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        setCategories(
          categories.map((c) =>
            c.id === cat.id ? { id: data.id, name: data.name } : c
          )
        );
        setEditingCategory(null);
        setEditCategoryName("");
      }
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  // Delete category
  const handleDeleteCategory = async (cat) => {
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    try {
      const resp = await fetch(
        `${API_BASE}/api/city-tour-categories/${cat.id}`,
        {
          method: "DELETE",
        }
      );
      if (resp.ok) {
        setCategories(categories.filter((c) => c.id !== cat.id));
        if (category === String(cat.id)) setCategory("");
      }
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  // Load existing record in edit mode
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/city-packages/${id}`);
        const data = await res.json();
        if (!res.ok || !data?.success)
          throw new Error(data?.error || "Failed to load city tour");
        const r = data.data || {};
        setTitle(r.title || "");
        const loadedCityName = r.cityName || "";
        setCityName(loadedCityName);

        // Find the city by name and set the ID
        setTimeout(() => {
          const foundCity = cities.find((c) => c.name === loadedCityName);
          if (foundCity) {
            setSelectedCityId(String(foundCity.id));
          }
        }, 500);

        setCategory(r.categoryId ? String(r.categoryId) : "");
        setLocationUrl(r.locationUrl || "");
        setDuration(r.duration || "");
        setPrice(String(r.price ?? ""));

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
          message: e.message || "Failed to load city tour",
        });
      }
    })();
  }, [id, API_BASE, cities]);

  const getDetailsHtml = () =>
    quillRef.current ? quillRef.current.root.innerHTML : "";

  const handleSave = async () => {
    setAlert({ show: false, type: "success", message: "" });

    const details = getDetailsHtml();
    if (!title.trim()) {
      setAlert({
        show: true,
        type: "error",
        message: "Please enter a city tour.",
      });
      return;
    }
    if (!cityName.trim()) {
      setAlert({
        show: true,
        type: "error",
        message: "Please enter a city name.",
      });
      return;
    }
    if (!details || details === "<p><br></p>") {
      setAlert({
        show: true,
        type: "error",
        message: "Please add some details/overview for the city tour.",
      });
      return;
    }

    try {
      setSaving(true);
      const form = new FormData();
      form.append("title", title);
      form.append("cityName", cityName);
      if (category && category !== "") {
        form.append("categoryId", category);
      }
      form.append("locationUrl", locationUrl);
      form.append("duration", duration);
      form.append("price", price || "0");
      form.append("details", details);

      if (id) {
        const keep = Array.from(keepImages);
        form.append("keepImages", JSON.stringify(keep));
        images.forEach((file) => form.append("newImages", file));
        const res = await fetch(`${API_BASE}/api/city-packages/${id}`, {
          method: "PUT",
          body: form,
        });
        const data = await res.json();
        if (!res.ok || !data?.success)
          throw new Error(data?.error || "Failed to update city tour");

        setAlert({
          show: true,
          type: "success",
          message: "City tour updated successfully!",
        });
        if (typeof onSaved === "function") {
          onSaved(data.data);
        } else {
          setTimeout(
            () =>
              navigate("/admin/city-packages", { state: { updated: true } }),
            1000
          );
        }
      } else {
        images.forEach((file) => form.append("images", file));
        const res = await fetch(`${API_BASE}/api/city-packages`, {
          method: "POST",
          body: form,
        });
        const data = await res.json();
        if (!res.ok || !data?.success)
          throw new Error(data?.error || "Failed to save city tour");

        setAlert({
          show: true,
          type: "success",
          message: "City tour created successfully!",
        });
        if (typeof onSaved === "function") {
          onSaved(data.data);
        } else {
          setTimeout(
            () =>
              navigate("/admin/city-packages", { state: { created: true } }),
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
          (id ? "Failed to update city tour" : "Failed to save city tour"),
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {id ? "Edit City Tour" : "Create City Tour"}
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                {id
                  ? "Update your city tour details"
                  : "Add a new city tour to your offerings"}
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
                onClick={() => navigate("/admin/city-packages")}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors duration-200 shadow-sm"
              >
                {icons.back}
                Back to City Tours
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
                City Tour Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    City Name *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    value={selectedCityId}
                    onChange={(e) => {
                      const cityId = e.target.value;
                      setSelectedCityId(cityId);
                      const selectedCity = cities.find(
                        (c) => String(c.id) === cityId
                      );
                      if (selectedCity) {
                        setCityName(selectedCity.name);
                      }
                    }}
                  >
                    <option value="">Select a city *</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Can't find your city? Go to{" "}
                    <span className="font-semibold">Manage City Packages</span>{" "}
                    and click{" "}
                    <span className="text-blue-600 font-semibold">
                      "Manage Cities"
                    </span>
                  </p>
                </div>

                {/* City Tour Category */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    City Tour Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  >
                    <option value="">Select a category (optional)</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Categories are city-wise. Add them under{" "}
                    <span className="font-semibold">Manage Cities</span>.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    City Tour *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Dubai City Explorer"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Location URL
                  </label>
                  <input
                    type="url"
                    placeholder="E.g., https://maps.google.com/..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    value={locationUrl}
                    onChange={(e) => setLocationUrl(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Dates
                  </label>
                  <input
                    type="date"
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
                    <input
                      type="text"
                      placeholder="AED"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                      value={price}
                      onChange={(e) => {
                        const val = e.target.value;
                        // Allow only numbers and decimal point
                        if (val === "" || /^\d*\.?\d*$/.test(val)) {
                          setPrice(val);
                        }
                      }}
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
                City Tour Images
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
                  Select multiple images to showcase your city tour
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
                      const url = `${API_BASE}/uploads/city-packages/${name}`;
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
                City Tour Content
              </h2>
            </div>
            <div className="p-6 space-y-8">
              {/* Rich Text Editor */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  City Tour Details & Itinerary
                </label>
                <div className="border border-gray-300 rounded-xl overflow-hidden">
                  <div ref={editorRef} className="h-80 bg-white" />
                </div>
                <div className="flex justify-end text-sm">
                  <p className="text-gray-500">
                    Character count:{" "}
                    <span className="font-medium">{charCount}</span>
                  </p>
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
                onClick={() => navigate("/admin/city-packages")}
                type="button"
                className="px-8 py-4 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-semibold shadow-sm"
              >
                Back to City Tours
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
