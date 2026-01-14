import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/axios.js";
import { Upload, ImagePlus } from "lucide-react";

const STORAGE_KEY = "adminProductForm";

export default function AdminProducts() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });
  const [files, setFiles] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Load form data from localStorage on mount
  useEffect(() => {
    const savedForm = localStorage.getItem(STORAGE_KEY);
    if (savedForm) {
      try {
        setForm(JSON.parse(savedForm));
      } catch (err) {
        console.error("Error loading saved form:", err);
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = ""; // Reset input to allow selecting the same file again
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!form.name || !form.price) {
      setMsg("Please fill all required fields");
      return;
    }

    if (files.length === 0) {
      setMsg("Please select at least one image");
      return;
    }

    if (files.length > 4) {
      setMsg("Maximum 4 images allowed");
      return;
    }

    setLoading(true);
    setMsg("Uploading...");

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("price", form.price);
      fd.append("description", form.description);
      fd.append("category", form.category);
      
      // Append images with correct field names (image1, image2, image3, image4)
      files.forEach((file, index) => {
        const fieldName = `image${index + 1}`;
        fd.append(fieldName, file);
      });

      const res = await api.post("/api/admin/products/add", fd);

      if (res.data && res.data.success) {
        setMsg("Product added successfully!");
        setForm({ name: "", price: "", description: "", category: "" });
        setFiles([]);
        localStorage.removeItem(STORAGE_KEY); // Clear saved form on success
        setTimeout(() => navigate("/admin"), 1000);
      } else {
        setMsg(res.data?.message || "Failed to add product");
      }
    } catch (err) {
      console.error("Upload error details:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Upload failed. Please check the console for details.";
      setMsg(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <ImagePlus className="text-green-600" />
          Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border rounded-lg"
          />

          {/* Image Upload */}
          <label className="flex items-center justify-center gap-2 cursor-pointer border-2 border-dashed rounded-lg p-4 hover:bg-gray-50">
            <Upload />
            <span>Select Images</span>
            <input type="file" onChange={handleFiles} className="hidden" accept="image/*" />
          </label>

          {files.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Selected Images ({files.length})
              </p>
              <div className="grid grid-cols-3 gap-3">
                {files.map((file, i) => (
                  <div key={i} className="relative h-24 rounded-md overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      className="h-24 w-full object-cover rounded-md"
                      alt={`preview-${i}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white ${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Uploading..." : "Add Product"}
          </button>
        </form>

        {msg && <p className="mt-4 text-center">{msg}</p>}
      </div>
    </div>
  );
}
