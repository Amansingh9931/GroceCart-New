import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaRupeeSign,
} from "react-icons/fa";

export default function ActiveDelivery() {
  const { backend_URL, token } = useContext(ShopContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deliveryStep, setDeliveryStep] = useState("accepted"); // accepted, out-for-delivery, delivered

  useEffect(() => {
    fetchActiveDelivery();
    const interval = setInterval(fetchActiveDelivery, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchActiveDelivery = async () => {
    try {
      const response = await axios.get(`${backend_URL}/api/delivery/active-delivery`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success && response.data.order) {
        setOrder(response.data.order);
        setDeliveryStep(
          response.data.order.status === "Out for Delivery"
            ? "out-for-delivery"
            : "accepted"
        );
      }
    } catch (err) {
      console.error("Error fetching active delivery:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkOutForDelivery = async () => {
    try {
      setActionLoading(true);
      const response = await axios.post(
        `${backend_URL}/api/delivery/mark-out-for-delivery`,
        { orderId: order._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setDeliveryStep("out-for-delivery");
        setOrder({ ...order, status: "Out for Delivery" });
        toast.success("Order marked as out for delivery!", {
          autoClose: 2000,
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkDelivered = async () => {
    try {
      setActionLoading(true);
      const response = await axios.post(
        `${backend_URL}/api/delivery/mark-delivered`,
        { orderId: order._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setDeliveryStep("delivered");
        toast.success(
          `Order delivered! Earned ₹${response.data.commission.toFixed(2)}`,
          {
            autoClose: 3000,
          }
        );
        setTimeout(() => {
          setOrder(null);
          fetchActiveDelivery();
        }, 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error marking delivered");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading delivery info...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Active Delivery
            </h2>
            <p className="text-gray-600 mb-6">
              You have completed all your deliveries. Great job!
            </p>
            <a
              href="/delivery/available"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105"
            >
              Check Available Orders
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div
              className={`flex flex-col items-center ${
                deliveryStep !== "accepted"
                  ? "text-green-600"
                  : "text-indigo-600"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white mb-2 ${
                  deliveryStep !== "accepted"
                    ? "bg-green-600"
                    : "bg-indigo-600"
                }`}
              >
                1
              </div>
              <p className="text-sm font-semibold">Accepted</p>
            </div>

            <div
              className={`flex-1 h-1 mx-2 ${
                deliveryStep === "out-for-delivery" || deliveryStep === "delivered"
                  ? "bg-green-600"
                  : "bg-gray-300"
              }`}
            ></div>

            <div
              className={`flex flex-col items-center ${
                deliveryStep === "out-for-delivery" || deliveryStep === "delivered"
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white mb-2 ${
                  deliveryStep === "out-for-delivery" || deliveryStep === "delivered"
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
              >
                2
              </div>
              <p className="text-sm font-semibold">Out for Delivery</p>
            </div>

            <div
              className={`flex-1 h-1 mx-2 ${
                deliveryStep === "delivered" ? "bg-green-600" : "bg-gray-300"
              }`}
            ></div>

            <div
              className={`flex flex-col items-center ${
                deliveryStep === "delivered" ? "text-green-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white mb-2 ${
                  deliveryStep === "delivered"
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
              >
                3
              </div>
              <p className="text-sm font-semibold">Delivered</p>
            </div>
          </div>
        </div>

        {/* Order Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideInUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FaTruck className="text-3xl" />
                <div>
                  <p className="text-sm opacity-90">Order ID</p>
                  <p className="font-mono font-bold text-lg">{order._id}</p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    deliveryStep === "delivered"
                      ? "bg-green-500 text-white"
                      : deliveryStep === "out-for-delivery"
                      ? "bg-blue-500 text-white"
                      : "bg-yellow-500 text-white"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
            <p className="text-sm opacity-90">
              ⏱ Accepted at {new Date(order.acceptedAt).toLocaleTimeString()}
            </p>
          </div>

          {/* Customer & Location Section */}
          <div className="px-6 py-8">
            {/* Customer Info */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase">
                📱 Customer Details
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-lg font-bold text-gray-800 mb-2">
                  {order.user?.name}
                </p>
                <a
                  href={`tel:${order.address?.phone}`}
                  className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition"
                >
                  <FaPhoneAlt />
                  {order.address?.phone}
                </a>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase">
                📍 Delivery Address
              </h3>
              <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                <p className="text-lg font-bold text-gray-800 mb-3">
                  {order.address?.firstName} {order.address?.lastName}
                </p>
                <div className="space-y-2 text-gray-700">
                  <p className="flex items-start gap-2">
                    <FaMapMarkerAlt className="text-red-600 mt-1 flex-shrink-0" />
                    <span className="font-semibold">{order.address?.street}</span>
                  </p>
                  <p className="ml-6">
                    {order.address?.city}, {order.address?.state}{" "}
                    {order.address?.zipcode}
                  </p>
                  <p className="ml-6">{order.address?.country}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase">
                📦 Items to Deliver ({order.items.length})
              </h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="h-16 w-16 object-contain flex-shrink-0 bg-white rounded p-2"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">
                        {item.productName || item.name}
                      </p>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">₹{item.price}</p>
                      <p className="text-sm text-gray-600">per unit</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
              <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase">
                💰 Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-semibold text-gray-800">
                    ₹{(order.amount - 10).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Delivery Fee:</span>
                  <span className="font-semibold text-gray-800">₹10.00</span>
                </div>
                <div className="border-t-2 border-gray-300 pt-3 flex justify-between">
                  <span className="font-bold text-gray-800">Total Amount:</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    ₹{order.amount.toFixed(2)}
                  </span>
                </div>
                <div className="bg-green-100 border-l-4 border-green-600 p-3 rounded">
                  <p className="text-sm text-green-700">
                    <span className="font-bold">Your Commission (5%):</span>
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    ₹{(order.amount * 0.05).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-600 mb-2">Payment Method</p>
              <p className="font-bold text-lg text-gray-800 flex items-center gap-2">
                {order.paymentMethod === "COD" ? "💵 Cash on Delivery" : "💳 Online"}
              </p>
              {order.paymentMethod === "COD" && (
                <p className="text-sm text-orange-600 mt-2">
                  Collect ₹{order.amount} from customer
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 px-6 py-6 flex gap-4">
            {deliveryStep === "accepted" && (
              <button
                onClick={handleMarkOutForDelivery}
                disabled={actionLoading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-lg transition transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <span className="animate-spin">⚙️</span> Updating...
                  </>
                ) : (
                  <>
                    <FaTruck /> Out for Delivery
                  </>
                )}
              </button>
            )}

            {deliveryStep === "out-for-delivery" && (
              <>
                <div className="flex-1 bg-blue-100 border-2 border-blue-600 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-700">You are on the way to</p>
                  <p className="font-bold text-blue-900">
                    {order.address?.city}
                  </p>
                </div>
                <button
                  onClick={handleMarkDelivered}
                  disabled={actionLoading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-lg transition transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading ? (
                    <>
                      <span className="animate-spin">⚙️</span> Processing...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle /> Mark as Delivered
                    </>
                  )}
                </button>
              </>
            )}

            {deliveryStep === "delivered" && (
              <div className="w-full bg-green-100 border-2 border-green-600 rounded-lg p-6 text-center">
                <FaCheckCircle className="text-4xl text-green-600 mx-auto mb-3" />
                <p className="font-bold text-lg text-green-700">Order Delivered!</p>
                <p className="text-green-600 text-sm mt-1">
                  Earned ₹{(order.amount * 0.05).toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
