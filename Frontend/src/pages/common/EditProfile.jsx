import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";

export default function EditProfile() {
  const { user, token, login } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.put(
        "http://localhost:8000/api/user/profile",
        { name, mobile },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔥 Update AuthContext with new user data
      login(res.data.user, token);
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded shadow p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>

          {/* MOBILE */}
          <div>
            <label className="block text-sm font-medium">Mobile</label>
            <input
              type="number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>

          {/* EMAIL (READ ONLY) */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full border px-3 py-2 rounded mt-1 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* ROLE (READ ONLY) */}
          <div>
            <label className="block text-sm font-medium">Role</label>
            <input
              type="text"
              value={user.role}
              disabled
              className="w-full border px-3 py-2 rounded mt-1 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
