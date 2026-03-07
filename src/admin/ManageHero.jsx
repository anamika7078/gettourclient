import { useEffect, useMemo, useState } from "react";

const PAGES = [
  { value: "home", label: "Home (Main Hero)" },
  { value: "visas", label: "Visas Hero" },
  { value: "cruises", label: "Cruises Hero" },
  { value: "holidays", label: "Holidays Hero" },
  { value: "hotels", label: "Hotels Hero" },
];

export default function ManageHero() {
  const API_BASE = import.meta.env.VITE_API_URL;

  const [page, setPage] = useState("home");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existing, setExisting] = useState([]); // array of URLs
  const [files, setFiles] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });

  const title = useMemo(
    () => PAGES.find((p) => p.value === page)?.label || "Manage Hero",
    [page]
  );

  useEffect(() => {
    // reset selection previews
    setFiles({ image1: null, image2: null, image3: null, image4: null });
    setExisting([]);
    setLoading(true);
    fetch(`${API_BASE}/api/hero/${page}`)
      .then((r) => r.json())
      .then((res) => {
        if (res?.success) setExisting(res.data?.images || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [API_BASE, page]);

  const handleFile = (key, f) => setFiles((s) => ({ ...s, [key]: f }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(files).forEach(([k, v]) => {
        if (v) fd.append(k, v);
      });
      const res = await fetch(`${API_BASE}/api/hero/${page}`, {
        method: "PUT",
        body: fd,
      });
      const json = await res.json();
      if (json.success) {
        // refresh images
        setExisting(json.data?.images || []);
        // clear selected files
        setFiles({ image1: null, image2: null, image3: null, image4: null });
        alert("Hero images updated");
      } else {
        alert(json.message || "Failed to update");
      }
    } catch {
      alert("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold">{title}</h1>
      </div>

      <div className="rounded-xl bg-white p-4 sm:p-5 ring-1 ring-black/5">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Page
            </label>
            <select
              className="mt-1 w-full max-w-xs rounded-md border border-gray-300 p-2"
              value={page}
              onChange={(e) => setPage(e.target.value)}
            >
              {PAGES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm text-gray-600">
            Upload up to 4 images. Only the selected files will be updated.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {["image1", "image2", "image3", "image4"].map((key, idx) => (
              <div key={key} className="rounded-lg border border-gray-200 p-3">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Image {idx + 1}
                </div>
                <div className="aspect-video w-full overflow-hidden rounded-md bg-gray-50 ring-1 ring-gray-200 flex items-center justify-center">
                  {files[key] ? (
                    <img
                      src={URL.createObjectURL(files[key])}
                      alt="preview"
                      className="h-full w-full object-cover"
                    />
                  ) : existing[idx] ? (
                    <img
                      src={`${API_BASE}${existing[idx]}`}
                      alt="current"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No image</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 block w-full text-sm"
                  onChange={(e) => handleFile(key, e.target.files?.[0] || null)}
                />
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center rounded-md bg-orange-600 px-4 py-2 text-white font-medium hover:bg-orange-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Images"}
            </button>
          </div>
        </form>

        {loading && (
          <div className="mt-3 text-sm text-gray-500">
            Loading current images…
          </div>
        )}
      </div>
    </div>
  );
}
