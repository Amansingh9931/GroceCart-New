import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import Title from "../common/Title.jsx";
import {
  Package,
  MapPin,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  Truck,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Orders() {
  const { backend_URL, token, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${backend_URL}/api/order/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setOrders(res.data.orders);
      else toast.error("Failed to load orders");
    } catch (err) {
      toast.error("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  const statusMap = {
    Pending: { color: "yellow", icon: Clock },
    "Order Placed": { color: "blue", icon: Package },
    Confirmed: { color: "green", icon: CheckCircle },
    Delivered: { color: "emerald", icon: Truck },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="w-14 h-14 border-4 border-green-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-10 py-12"
    >
      <div className="max-w-6xl mx-auto">
        <Title text1="MY" text2="ORDERS" />

        {orders.length === 0 ? (
          <div className="mt-12 bg-white rounded-3xl shadow-xl p-16 text-center">
            <Package className="w-20 h-20 mx-auto text-gray-300 mb-6" />
            <p className="text-xl text-gray-600 mb-6">
              You haven’t placed any orders yet
            </p>
            <a
              href="/products"
              className="inline-block bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-8 mt-10">
            {orders.map((order, idx) => {
              const StatusIcon =
                statusMap[order.status]?.icon || Package;

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200 overflow-hidden"
                >
                  {/* HEADER */}
                  <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-500">ORDER ID</p>
                      <p className="font-mono text-sm font-semibold">
                        {order._id}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.date).toDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold">
                        {currency}
                        {order.amount.toFixed(2)}
                      </span>
                      <span
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-${statusMap[order.status]?.color}-100 text-${statusMap[order.status]?.color}-700`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* ITEMS PREVIEW */}
<div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {(expanded === order._id
    ? order.items
    : order.items.slice(0, 3)
  ).map((item, i) => (
    <div
      key={i}
      className="flex gap-4 bg-gray-50 rounded-xl p-4"
    >
      <img
        src={item.image || "/placeholder.png"}
        className="w-20 h-20 object-cover rounded-lg"
        alt={item.name}
      />
      <div className="flex-1">
        <p className="font-semibold text-sm line-clamp-2">
          {item.name}
        </p>
        <p className="text-xs text-gray-500">
          Qty: {item.quantity}
        </p>
        <p className="mt-2 font-semibold text-green-600">
          {currency}
          {(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  ))}

  {expanded !== order._id && order.items.length > 3 && (
    <p className="col-span-full text-sm text-gray-500 mt-1 ml-1">
      +{order.items.length - 3} more items
    </p>
  )}
</div>


                  {/* TOGGLE */}
                  <button
                    onClick={() =>
                      setExpanded(
                        expanded === order._id ? null : order._id
                      )
                    }
                    className="w-full px-6 py-4 flex items-center justify-between text-green-600 font-semibold hover:bg-gray-50 transition"
                  >
                    {expanded === order._id
                      ? "Hide Details"
                      : "View Details"}
                    <ChevronDown
                      className={`transition-transform ${
                        expanded === order._id ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* EXPANDED */}
                  <AnimatePresence>
                    {expanded === order._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-gray-50"
                      >
                        <div className="p-6 grid md:grid-cols-2 gap-8">
                          {/* PAYMENT */}
                          <div>
                            <h4 className="font-semibold mb-3">
                              Payment Details
                            </h4>
                            <p className="text-sm text-gray-600">
                              Method: {order.paymentMethod}
                            </p>
                            <p className="mt-2">
                              Status:{" "}
                              <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-semibold">
                                {order.payment ? "Paid" : "Pending"}
                              </span>
                            </p>
                          </div>

                          {/* ADDRESS */}
                          <div>
                            <h4 className="font-semibold mb-3">
                              Delivery Address
                            </h4>
                            <p className="text-sm text-gray-600">
                              {order.address?.firstName}{" "}
                              {order.address?.lastName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.address?.street},{" "}
                              {order.address?.city}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.address?.state}{" "}
                              {order.address?.zipcode}
                            </p>
                            <p className="flex items-center gap-2 mt-2 text-sm font-semibold">
                              <Phone className="w-4 h-4" />
                              {order.address?.phone}
                            </p>
                          </div>
                        </div>

                        {/* SUMMARY */}
                        <div className="p-6 border-t bg-white">
                          <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>
                              {currency}
                              {(order.amount - 10).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm mt-2">
                            <span>Shipping</span>
                            <span>{currency}10.00</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg mt-3">
                            <span>Total</span>
                            <span>
                              {currency}
                              {order.amount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
