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

export default function CountryVisaAdd({ onSaved }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const API_BASE = import.meta.env.VITE_API_URL;

  // Form state
  const [country, setCountry] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [overview, setOverview] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [existingImage, setExistingImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    message: "",
  });
  const isEdit = Boolean(id);

  // Visa Subjects dynamic from backend /api/visa-subjects
  const [subjects, setSubjects] = useState([]); // [{id,subject,slug}]
  const [selectedSubject, setSelectedSubject] = useState("");
  const [newSubject, setNewSubject] = useState("");

  // Quill editor
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder:
          "Write all details about the visa process, requirements, fees, and terms...",
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

      if (overview) {
        quillRef.current.root.innerHTML = overview;
        setCharCount(quillRef.current.getText().trim().length);
      }

      quillRef.current.on("text-change", () => {
        const text = quillRef.current.getText().trim();
        setCharCount(text.length);
        setOverview(quillRef.current.root.innerHTML);
      });
    }
  }, [overview]);

  // Load visa subjects from backend
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/visa-subjects`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load subjects");
        const rows = Array.isArray(data) ? data : [];
        setSubjects(rows);
        if (
          selectedSubject &&
          !rows.some((r) => r.subject === selectedSubject)
        ) {
          setSubjects((prev) => [
            ...prev,
            { id: null, subject: selectedSubject },
          ]);
        }
      } catch (e) {
        console.warn("Visa subjects load failed", e);
      }
    })();
  }, [API_BASE, selectedSubject]);

  // Load existing visa for edit
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/visas/${id}`);
        const data = await res.json();
        if (!res.ok || data?.success === false)
          throw new Error(data?.message || "Failed to load visa");
        const r = data?.data || data;
        setCountry(r.country || "");
        setPrice(String(r.price ?? ""));
        setSelectedSubject(r.subject || "");
        setExistingImage(r.image || "");
        const html = r.overview || "";
        setOverview(html);
        if (quillRef.current) {
          quillRef.current.root.innerHTML = html;
          const text = quillRef.current.getText().trim();
          setCharCount(text.length);
        }
        // ensure subject present (object form)
        setSubjects((prev) => {
          const s = r.subject || "";
          return s && !prev.some((p) => p.subject === s)
            ? [...prev, { id: null, subject: s }]
            : prev;
        });
      } catch (e) {
        setAlert({
          show: true,
          type: "error",
          message: e.message || "Failed to load visa",
        });
      }
    })();
  }, [isEdit, id, API_BASE]);

  const getOverviewHtml = () =>
    quillRef.current ? quillRef.current.root.innerHTML : overview || "";

  // Add/Remove subject (local UI management)
  const onAddSubject = async () => {
    const v = (newSubject || "").trim();
    if (!v) {
      setAlert({
        show: true,
        type: "error",
        message: "Please enter a subject name.",
      });
      return;
    }
    if (subjects.some((s) => s.subject.toLowerCase() === v.toLowerCase())) {
      setAlert({
        show: true,
        type: "error",
        message: "Subject already exists.",
      });
      setNewSubject("");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/visa-subjects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: v }),
      });
      const data = await res.json();
      if (!res.ok || data?.success === false)
        throw new Error(data?.error || "Failed to add subject");
      setSubjects((prev) => [...prev, { id: data.insertId, subject: v }]);
      setAlert({
        show: true,
        type: "success",
        message: "Subject added successfully!",
      });
      setSelectedSubject((cur) => cur || v);
    } catch (e) {
      setAlert({
        show: true,
        type: "error",
        message: e.message || "Add failed",
      });
    } finally {
      setNewSubject("");
    }
  };

  const onRemoveSubject = async (subjectObj) => {
    if (!confirm(`Remove visa subject "${subjectObj.subject}"?`)) return;
    if (!subjectObj.id) {
      setSubjects((prev) =>
        prev.filter((s) => s.subject !== subjectObj.subject)
      );
      if (subjectObj.subject === selectedSubject) setSelectedSubject("");
      return;
    }
    try {
      const res = await fetch(
        `${API_BASE}/api/visa-subjects/${subjectObj.id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok || data?.success === false)
        throw new Error(data?.error || "Delete failed");
      setSubjects((prev) => prev.filter((s) => s.id !== subjectObj.id));
      if (subjectObj.subject === selectedSubject) setSelectedSubject("");
    } catch (e) {
      setAlert({
        show: true,
        type: "error",
        message: e.message || "Failed to delete",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ show: false, type: "success", message: "" });

    if (!country.trim()) {
      setAlert({
        show: true,
        type: "error",
        message: "Please enter a country name.",
      });
      return;
    }

    try {
      setSaving(true);
      const form = new FormData();
      form.append("country", country);
      form.append("price", String(Number(price || 0) || 0));
      form.append("subject", selectedSubject);
      form.append("overview", getOverviewHtml());
      if (imageFile) form.append("image", imageFile);

      const url = isEdit
        ? `${API_BASE}/api/visas/${id}`
        : `${API_BASE}/api/visas`;
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, { method, body: form });
      const data = await res.json();
      if (!res.ok || data?.success === false) {
        throw new Error(
          data?.message ||
            (isEdit ? "Failed to update visa" : "Failed to save visa")
        );
      }

      setAlert({
        show: true,
        type: "success",
        message: `Visa ${isEdit ? "updated" : "created"} successfully!`,
      });
      setTimeout(() => {
        onSaved?.();
        navigate("/admin/visas");
      }, 1000);
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        message: err.message || "Save failed",
      });
    } finally {
      setSaving(false);
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
                {isEdit ? "Edit Country Visa" : "Add Country Visa"}
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                {isEdit
                  ? "Update visa details and information"
                  : "Add a new country visa to your offerings"}
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/visas")}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 bg-white border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors duration-200 shadow-sm"
            >
              {icons.back}
              Back to Visas
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Details Section */}
          <section className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Visa Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Country Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="E.g., Dubai, UAE"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Visa Price (Per Person)
                  </label>
                  <div className="relative">
                    {/* <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span> */}
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="AED"
                      min={0}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Visa Card Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setImageFile(e.target.files?.[0] || null)
                      }
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 hover:border-orange-300"
                    />
                  </div>

                  {/* Existing Image Preview */}
                  {isEdit && existingImage && (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex-shrink-0">
                        <span className="text-sm font-medium text-gray-700">
                          Current Image:
                        </span>
                      </div>
                      <img
                        src={`${API_BASE}/uploads/visas/${existingImage}`}
                        alt="Current visa"
                        className="h-16 w-16 object-cover rounded-lg border shadow-sm"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <span className="text-sm text-gray-600 italic flex-1">
                        {existingImage}
                      </span>
                    </div>
                  )}

                  {/* New File Preview */}
                  {imageFile && (
                    <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                      <div className="flex-shrink-0">
                        <span className="text-sm font-medium text-orange-700">
                          New Image:
                        </span>
                      </div>
                      <div className="h-16 w-16 bg-orange-100 rounded-lg border border-orange-200 flex items-center justify-center">
                        <span className="text-xs text-orange-600 text-center px-1">
                          New Upload
                        </span>
                      </div>
                      <span className="text-sm text-orange-600 flex-1">
                        {imageFile.name}
                      </span>
                    </div>
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
                Visa Content
              </h2>
            </div>
            <div className="p-6 space-y-8">
              {/* Subject Management */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Visa Subject
                  </label>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200"
                    onClick={() =>
                      document.getElementById("newSubjectInput")?.focus()
                    }
                  >
                    {icons.plus}
                    Add New Subject
                  </button>
                </div>

                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white"
                >
                  <option value="">Select a subject</option>
                  {subjects.map((s) => (
                    <option key={s.id ?? s.subject} value={s.subject}>
                      {s.subject}
                    </option>
                  ))}
                </select>

                {/* Add Subject */}
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add New Subject
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="newSubjectInput"
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter new subject"
                      onKeyPress={(e) => e.key === "Enter" && onAddSubject()}
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium"
                      onClick={onAddSubject}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Subjects List */}
                {subjects.length > 0 && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Manage Subjects
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {subjects.map((subject) => (
                        <div
                          key={subject.id ?? subject.subject}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <span className="text-sm font-medium text-gray-700">
                            {subject.subject}
                          </span>
                          <button
                            type="button"
                            className="p-1 text-rose-600 hover:bg-rose-100 rounded transition-colors duration-200"
                            onClick={() => onRemoveSubject(subject)}
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
                  Visa Overview & Details
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
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isEdit ? "Updating..." : "Creating..."}
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
                  {isEdit ? "Update Visa" : "Create Visa"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
