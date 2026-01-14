import { useAuth } from "../../Context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../Api/axios.js";
import { Package, Users, Truck, BarChart3 } from "lucide-react";

export default function AdminDash() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeliveryBoys: 0,
    totalAdmins: 0,
    totalAccounts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/api/admin/stats");
      if (res.data && res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">👑 Admin Dashboard</h1>
              <p className="text-slate-400 mt-2">Welcome, {user?.name}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-sm uppercase tracking-wide">Total Customers</p>
                <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
              </div>
              <Users size={32} className="text-blue-200" />
            </div>
          </div>

          <div className="bg-orange-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-orange-100 text-sm uppercase tracking-wide">Delivery Agents</p>
                <p className="text-3xl font-bold mt-2">{stats.totalDeliveryBoys}</p>
              </div>
              <Truck size={32} className="text-orange-200" />
            </div>
          </div>

          <div className="bg-green-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100 text-sm uppercase tracking-wide">Total Accounts</p>
                <p className="text-3xl font-bold mt-2">{stats.totalAccounts}</p>
              </div>
              <BarChart3 size={32} className="text-green-200" />
            </div>
          </div>

          <div className="bg-purple-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-100 text-sm uppercase tracking-wide">Admin Count</p>
                <p className="text-3xl font-bold mt-2">{stats.totalAdmins}</p>
              </div>
              <Users size={32} className="text-purple-200" />
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Products Card */}
          <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition overflow-hidden">
            <div className="h-2 bg-green-600"></div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="text-green-600" size={32} />
                <h3 className="text-xl font-bold">Manage Products</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Add, edit, and delete products from your inventory
              </p>
              <Link
                to="/admin/products"
                className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Go to Products
              </Link>
            </div>
          </div>

          {/* Users Card */}
          <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition overflow-hidden">
            <div className="h-2 bg-blue-600"></div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="text-blue-600" size={32} />
                <h3 className="text-xl font-bold">Manage Customers</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                View customer details, contact info, and order history
              </p>
              <Link
                to="/admin/users"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                View Customers
              </Link>
            </div>
          </div>

          {/* Delivery Agents Card */}
          <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition overflow-hidden">
            <div className="h-2 bg-orange-600"></div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Truck className="text-orange-600" size={32} />
                <h3 className="text-xl font-bold">Delivery Agents</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Manage delivery agents, assignments, and performance
              </p>
              <Link
                to="/admin/delivery-agents"
                className="inline-block bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition font-semibold"
              >
                View Agents
              </Link>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-yellow-900 mb-2">Coming Soon</h3>
          <ul className="text-yellow-800 text-sm space-y-1">
            <li>• Orders & Analytics</li>
            <li>• Delivery assignments</li>
            <li>• Revenue reports</li>
            <li>• Customer feedback & ratings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
