

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import axios from "axios";
import { useEffect, useState } from "react";
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
  video: (
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
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  ),
  link: (
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
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
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
};

export default function ActivityManageForm() {
  const API_BASE = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [locationName, setLocationName] = useState("");
  const [locationLink, setLocationLink] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    message: "",
  });
  const [cover, setCover] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [videoLinks, setVideoLinks] = useState([""]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categoryDetails, setCategoryDetails] = useState("");
  const [existingCover, setExistingCover] = useState("");
  const [activityData, setActivityData] = useState(null);
  const [editorReady, setEditorReady] = useState(false);

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
    onCreate: () => {
      setEditorReady(true);
    },
  });

  // Load categories and existing activity in edit mode
  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      try {
        // Load categories
        const categoriesResponse = await axios.get(`${API_BASE}/api/activity-categories`);
        if (mounted) {
          setCategories(categoriesResponse.data || []);
        }

        // Load activity data if in edit mode
        if (id) {
          const activityResponse = await axios.get(`${API_BASE}/api/activities/${id}`);
          if (mounted) {
            const activity = activityResponse.data || {};
            setActivityData(activity);
            setTitle(activity.title || "");
            setLocationName(activity.location_name || "");
            setLocationLink(activity.location_link || "");
            setPrice(activity.price || "");
            setSelectedCategoryId(activity.category_id || "");
            setExistingCover(activity.image || "");
            setCategoryDetails(activity.category_details || "");

            // Parse video links
            try {
              const vlinks = activity.video_links ? JSON.parse(activity.video_links) : [];
              setVideoLinks(Array.isArray(vlinks) && vlinks.length ? vlinks : [""]);
            } catch {
              setVideoLinks([""]);
            }
          }
        }
      } catch (err) {
        if (mounted) {
          const msg = err?.response?.data?.error || err?.message || "Failed to load data";
          setAlert({ show: true, type: "error", message: msg });
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [id, API_BASE]);

  // Set editor content when activity data and editor are ready
  useEffect(() => {
    if (activityData && editor && editorReady) {
      const html = activityData.details || "";
      if (html) {
        // Use setTimeout to ensure the editor is fully ready
        setTimeout(() => {
          editor.commands.setContent(html);
          
          // Calculate initial character count
          const div = document.createElement("div");
          div.innerHTML = html;
          const count = (div.textContent || div.innerText || "").trim().length;
          setCharCount(count);
        }, 100);
      }
    }
  }, [activityData, editor, editorReady]);

  // When categories arrive or selection changes, populate category details
  useEffect(() => {
    if (!selectedCategoryId) return;
    const cat = (categories || []).find(
      (c) => String(c.id) === String(selectedCategoryId)
    );
    if (cat) setCategoryDetails(cat.details || "");
  }, [categories, selectedCategoryId]);

  const handleSaveCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return alert("⚠️ Please enter a valid category name.");
    axios
      .post(`${API_BASE}/api/activity-categories`, { name: trimmed })
      .then((res) => {
        const insertId = res.data?.insertId;
        return axios
          .get(`${API_BASE}/api/activity-categories`)
          .then((r) => ({ list: r.data || [], insertId }));
      })
      .then(({ list, insertId }) => {
        setCategories(list);
        setSelectedCategoryId(insertId || "");
        setNewCategory("");
        setShowNewCategory(false);
        setAlert({
          show: true,
          type: "success",
          message: "✅ Category saved successfully.",
        });
      })
      .catch((err) => {
        setAlert({
          show: true,
          type: "error",
          message:
            err?.response?.data?.error ||
            err?.message ||
            "Failed to save category",
        });
      });
  };

  const handleDeleteCategory = (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    axios
      .delete(`${API_BASE}/api/activity-categories/${id}`)
      .then(() => axios.get(`${API_BASE}/api/activity-categories`))
      .then((res) => setCategories(res.data || []))
      .catch((err) =>
        setAlert({
          show: true,
          type: "error",
          message:
            err?.response?.data?.error ||
            err?.message ||
            "Failed to delete category",
        })
      );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      editor.chain().focus().setImage({ src: reader.result }).run();
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
    if (url)
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
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
    fd.append("categoryId", selectedCategoryId);
    fd.append("details", detailsHTML);
    fd.append("categoryDetails", categoryDetails);

    if (cover) fd.append("cover", cover);

    if (Array.isArray(gallery) && gallery.length) {
      gallery.forEach((g) => {
        if (g && g.name) fd.append("images", g);
      });
    }

    if (Array.isArray(videoFiles) && videoFiles.length) {
      videoFiles.forEach((vf) => {
        if (vf && vf.name) fd.append("videos", vf);
      });
    }

    const cleanLinks = (videoLinks || [])
      .map((l) => (l || "").trim())
      .filter(Boolean);
    fd.append("videoLinks", JSON.stringify(cleanLinks));

    setLoading(true);
    const req = id
      ? axios.put(`${API_BASE}/api/activities/${id}`, fd)
      : axios.post(`${API_BASE}/api/activities`, fd);

    req
      .then(() => {
        setAlert({
          show: true,
          type: "success",
          message: id
            ? "Activity updated successfully."
            : "Activity added successfully.",
        });
        if (!id) {
          setTitle("");
          setLocationName("");
          setLocationLink("");
          setPrice("");
          setSelectedCategoryId("");
          setCategoryDetails("");
          setCover(null);
          setGallery([]);
          setVideoFiles([]);
          setVideoLinks([""]);
          editor?.commands?.setContent("");
        } else {
          setTimeout(() => navigate("/admin/activities"), 800);
        }
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.error ||
          err?.message ||
          (id ? "Failed to update activity." : "Failed to add activity.");
        setAlert({ show: true, type: "error", message: msg });
      })
      .finally(() => setLoading(false));
  };

  const editorButtons = [
    { label: "Bold", action: () => editor.chain().focus().toggleBold().run() },
    {
      label: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "Strike",
      action: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      label: "H1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      label: "H2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Ordered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
    },
    { label: "Link", action: handleLink, icon: icons.link },
    {
      label: "Code Block",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
      label: "Clear",
      action: () => editor.chain().focus().unsetAllMarks().clearNodes().run(),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {id ? "Edit Activity" : "Create New Activity"}
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                {id
                  ? "Update your activity details"
                  : "Add a new activity to your platform"}
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/activities")}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors duration-200 shadow-sm"
            >
              {icons.back}
              Back to Activities
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Details Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Basic Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Activity Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter activity title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Location Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter location name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Location Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://maps.example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    value={locationLink}
                    onChange={(e) => setLocationLink(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="AED"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Cover Image
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <input
                      type="file"
                      accept="image/*"
                      className="flex-1 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-orange-300"
                      onChange={(e) => setCover(e.target.files?.[0] || null)}
                    />
                    {id && existingCover && !cover && (
                      <div className="flex-shrink-0">
                        <div className="text-xs text-gray-500 mb-2">
                          Current cover:
                        </div>
                        <img
                          src={`${API_BASE}/uploads/activities/${existingCover}`}
                          alt="Current cover"
                          className="h-20 w-32 object-cover rounded-lg border shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Content Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Content & Media
              </h2>
            </div>
            <div className="p-6 space-y-8">
              {/* Category Selection */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200"
                    onClick={() => setShowNewCategory((v) => !v)}
                  >
                    {icons.plus}
                    Add New Category
                  </button>
                </div>

                <select
                  value={selectedCategoryId}
                  onChange={(e) => {
                    const idVal = e.target.value;
                    setSelectedCategoryId(idVal);
                    const cat = (categories || []).find(
                      (c) => String(c.id) === String(idVal)
                    );
                    setCategoryDetails(cat?.details || "");
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white"
                >
                  <option value="">Select a category</option>
                  {(categories || []).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {showNewCategory && (
                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Category Name
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter category name"
                      />
                      <button
                        type="button"
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium"
                        onClick={handleSaveCategory}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Rich Text Editor */}
              {editor && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Activity Details
                  </label>
                  <div className="border border-gray-300 rounded-xl overflow-hidden">
                    {/* Editor Toolbar */}
                    <div className="flex flex-wrap gap-1 p-3 bg-gray-50 border-b border-gray-300">
                      {editorButtons.map((button) => (
                        <button
                          type="button"
                          key={button.label}
                          onClick={button.action}
                          className="inline-flex items-center gap-1 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                        >
                          {button.icon}
                          {button.label}
                        </button>
                      ))}
                      <label className="inline-flex items-center gap-1 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 cursor-pointer">
                        {icons.image}
                        Image
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <label className="inline-flex items-center gap-1 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 cursor-pointer">
                        {icons.video}
                        Video
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleVideoUpload}
                        />
                      </label>
                    </div>

                    {/* Editor Content */}
                    <div className="bg-white">
                      <EditorContent
                        editor={editor}
                        className="prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    Character count:{" "}
                    <span className="font-medium">{charCount}</span>
                  </div>
                </div>
              )}

              {/* Category Details */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Category Description
                </label>
                <textarea
                  value={categoryDetails}
                  onChange={(e) => setCategoryDetails(e.target.value)}
                  placeholder="Write category description or additional content..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 min-h-[120px]"
                />
              </div>

              {/* Video Links */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Video Links
                </label>
                <div className="space-y-3">
                  {videoLinks.map((link, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => {
                          const v = [...videoLinks];
                          v[idx] = e.target.value;
                          setVideoLinks(v);
                        }}
                        placeholder="https://youtube.com/..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                      />
                      <button
                        type="button"
                        className="px-4 py-3 text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors duration-200"
                        onClick={() =>
                          setVideoLinks(videoLinks.filter((_, i) => i !== idx))
                        }
                      >
                        {icons.delete}
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200 font-medium"
                  onClick={() => setVideoLinks([...videoLinks, ""])}
                >
                  {icons.plus}
                  Add Video Link
                </button>
              </div>

              {/* Category Management */}
              {categories?.length > 0 && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Manage Categories
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categories.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {c.name}
                        </span>
                        <button
                          type="button"
                          className="p-1 text-rose-600 hover:bg-rose-100 rounded transition-colors duration-200"
                          onClick={() => handleDeleteCategory(c.id)}
                        >
                          {icons.delete}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {id ? "Updating..." : "Saving..."}
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
                  {id ? "Update Activity" : "Create Activity"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}