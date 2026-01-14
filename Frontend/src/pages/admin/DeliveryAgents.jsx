import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/axios.js";
import { Truck, Mail, Phone, Calendar } from "lucide-react";

export default function AdminDeliveryAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeliveryAgents();
  }, []);

  const fetchDeliveryAgents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/users/deliveryBoy");
      if (res.data && res.data.success) {
        setAgents(res.data.users || []);
      } else {
        setError("Failed to load delivery agents");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch delivery agents");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading delivery agents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
          </div>
          <button
            onClick={fetchDeliveryAgents}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Truck className="text-orange-600" size={32} />
            Delivery Agents ({agents.length})
          </h1>
          <button
            onClick={() => navigate("/admin")}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back
          </button>
        </div>

        {agents.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500">No delivery agents found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200 border-b">
                    <th className="px-6 py-3 text-left font-semibold">Name</th>
                    <th className="px-6 py-3 text-left font-semibold">Email</th>
                    <th className="px-6 py-3 text-left font-semibold">Mobile</th>
                    <th className="px-6 py-3 text-left font-semibold">Joined</th>
                    <th className="px-6 py-3 text-left font-semibold">Status</th>
                    <th className="px-6 py-3 text-left font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent) => (
                    <tr key={agent._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{agent.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                        <Mail size={16} className="text-blue-500" />
                        {agent.email}
                      </td>
                      <td className="px-6 py-4 text-sm flex items-center gap-2">
                        {agent.mobile ? (
                          <>
                            <Phone size={16} className="text-green-500" />
                            {agent.mobile}
                          </>
                        ) : (
                          <span className="text-gray-400">Not provided</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                        <Calendar size={16} className="text-purple-500" />
                        {new Date(agent.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/admin/agent/${agent._id}`)}
                          className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
