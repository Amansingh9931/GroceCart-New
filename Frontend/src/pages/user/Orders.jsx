import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import Title from "../common/Title.jsx";

export default function Orders() {
  const { backend_URL, token, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-6">
      <Title text1={"MY"} text2={"ORDERS"} />

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No orders placed yet</p>
          <a
            href="/products"
            className="text-green-600 hover:underline font-medium"
          >
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-800">{order._id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Order Status */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Status</p>
                <span
                  className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
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
              </div>

              {/* Items */}
              <div className="mb-4 border-t pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Items
                </p>
                <div className="space-y-2">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-sm text-gray-600"
                      >
                        <p>
                          {item.name} × {item.quantity}
                        </p>
                        <p>
                          {currency}
                          {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No items in order</p>
                  )}
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-gray-800">
                  <p>Total Amount:</p>
                  <p>
                    {currency}
                    {order.amount.toFixed(2)}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Payment Method: {order.paymentMethod}
                  {order.payment ? " (Paid)" : " (Pending)"}
                </p>
              </div>

              {/* Delivery Address */}
              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Delivery Address
                </p>
                <p className="text-sm text-gray-600">
                  {order.address?.firstName} {order.address?.lastName}
                  <br />
                  {order.address?.street}, {order.address?.city}
                  <br />
                  {order.address?.state} {order.address?.zipcode}
                  <br />
                  {order.address?.country}
                  <br />
                  Phone: {order.address?.phone}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
