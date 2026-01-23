import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import Title from "../common/Title.jsx";
import { Package, MapPin, Phone, Calendar, Clock, CheckCircle, Truck } from "lucide-react";

export default function Orders() {
  const { backend_URL, token, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      const response = await axios.get(
        `${backend_URL}/api/order/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "Order Placed":
        return <Package className="w-5 h-5 text-blue-500" />;
      case "Confirmed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "Delivered":
        return <Truck className="w-5 h-5 text-emerald-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Order Placed":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "Confirmed":
        return "bg-green-50 border-green-200 text-green-700";
      case "Pending":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "Delivered":
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <Title text1={"MY"} text2={"ORDERS"} />

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center mt-8">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-4">No orders placed yet</p>
            <a
              href="/products"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6 mt-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition border-l-4 overflow-hidden ${
                  getStatusColor(order.status).split(" ")[0]
                }`}
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(order.status)}
                        <p className="text-xs text-gray-500 font-medium">ORDER ID</p>
                      </div>
                      <p className="font-mono text-gray-900 text-sm md:text-base font-semibold break-all">
                        {order._id}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Info */}
                <div className="px-6 py-4 bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(order.date).toLocaleDateString("en-US", { 
                      year: "numeric", 
                      month: "long", 
                      day: "numeric" 
                    })}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">Total Amount</p>
                    <p className="text-xl font-bold text-gray-900">
                      {currency}{order.amount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Expandable Content */}
                <div>
                  {/* Items Preview */}
                  <div className="px-6 py-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                          >
                            {/* Product Image */}
                            <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              ) : (
                                <Package className="w-8 h-8 text-white" />
                              )}
                              {item.image && (
                                <div className="hidden w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                                  <Package className="w-8 h-8 text-white" />
                                </div>
                              )}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <p className="font-semibold text-gray-900 text-sm truncate">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="font-semibold text-green-600">
                                {currency}{(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No items in order</p>
                      )}
                    </div>
                  </div>

                  {/* Expandable Details */}
                  <button
                    onClick={() => toggleExpandOrder(order._id)}
                    className="w-full px-6 py-4 text-left text-green-600 font-semibold hover:bg-gray-50 transition flex items-center justify-between"
                  >
                    <span>
                      {expandedOrders[order._id] ? "Hide Details" : "View Details"}
                    </span>
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        expandedOrders[order._id] ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </button>

                  {expandedOrders[order._id] && (
                    <div className="px-6 py-6 border-t border-gray-200 space-y-6 bg-gray-50">
                      {/* Payment & Shipping Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-orange-500" />
                            Payment Details
                          </h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p>
                              <span className="font-semibold text-gray-900">Method:</span>{" "}
                              {order.paymentMethod}
                            </p>
                            <p>
                              <span className="font-semibold text-gray-900">Status:</span>{" "}
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  order.payment
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {order.payment ? "✓ Paid" : "⏳ Pending"}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Delivery Address */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-red-500" />
                            Delivery Address
                          </h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-semibold text-gray-900">
                              {order.address?.firstName} {order.address?.lastName}
                            </p>
                            <p>{order.address?.street}</p>
                            <p>
                              {order.address?.city}, {order.address?.state}{" "}
                              {order.address?.zipcode}
                            </p>
                            <p>{order.address?.country}</p>
                            <p className="flex items-center gap-2 mt-2">
                              <Phone className="w-4 h-4" />
                              {order.address?.phone}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-gray-600">
                            <span>Subtotal:</span>
                            <span>{currency}{(order.amount - 10).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Shipping Fee:</span>
                            <span>{currency}10.00</span>
                          </div>
                          <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-900">
                            <span>Total:</span>
                            <span>{currency}{order.amount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
