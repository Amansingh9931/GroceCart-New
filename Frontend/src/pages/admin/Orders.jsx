import React, { useEffect, useState } from "react";
import api from "../../Api/axios.js";
import { toast } from "react-toastify";
import { ChevronDown } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const response = await api.get("/api/admin/orders");
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message || "Failed to load orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error(err.response?.data?.message || "Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpandOrder = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await api.post("/api/admin/orders/update-status", {
        orderId,
        status: newStatus,
      });

      if (response.data.success) {
        toast.success("Order status updated");
        fetchAllOrders();
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating order:", err);
      toast.error(err.response?.data?.message || "Error updating order");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  const statuses = ["Order Placed", "Confirmed", "Pending", "Delivered"];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">📦 All Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {/* Order Summary Header */}
                <div
                  onClick={() => toggleExpandOrder(order._id)}
                  className="p-6 cursor-pointer hover:bg-gray-50 transition flex justify-between items-center border-b"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-semibold text-gray-800">
                          {order._id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="font-semibold text-gray-800">
                          {order.address?.firstName} {order.address?.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-semibold text-gray-800">
                          ₹{order.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        order.status === "Order Placed"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-gray-500 transition transform ${
                        expandedOrders[order._id] ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Order Details */}
                {expandedOrders[order._id] && (
                  <div className="p-6 bg-gray-50 space-y-6 border-t">
                    {/* Items */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">
                        Order Items
                      </h3>
                      <div className="space-y-2">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between text-sm text-gray-600 bg-white p-3 rounded"
                            >
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-gray-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="font-medium">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No items in order</p>
                        )}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">
                        Delivery Address
                      </h3>
                      <div className="bg-white p-3 rounded text-sm text-gray-600">
                        <p className="font-medium">
                          {order.address?.firstName} {order.address?.lastName}
                        </p>
                        <p>{order.address?.street}</p>
                        <p>
                          {order.address?.city}, {order.address?.state}{" "}
                          {order.address?.zipcode}
                        </p>
                        <p>{order.address?.country}</p>
                        <p className="mt-2">
                          <strong>Phone:</strong> {order.address?.phone}
                        </p>
                        <p>
                          <strong>Email:</strong> {order.address?.email}
                        </p>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">
                        Update Status
                      </h3>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white p-3 rounded">
                      <p className="text-sm text-gray-600">
                        <strong>Payment Method:</strong> {order.paymentMethod}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Payment Status:</strong>{" "}
                        {order.payment ? "Paid" : "Pending"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
