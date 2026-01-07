import React from "react";
import {
  FaBox,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaMoneyBillWave,
  FaCheckCircle,
} from "react-icons/fa";

const DeliveryDashboard = () => {
  // Dummy data (replace with API later)
  const orders = [
    {
      id: "ORD123",
      customer: "Rahul Sharma",
      address: "Sector 21, Noida",
      phone: "9876543210",
      payment: "COD",
      status: "Pending",
    },
    {
      id: "ORD124",
      customer: "Neha Singh",
      address: "Indirapuram, Ghaziabad",
      phone: "9123456780",
      payment: "Online",
      status: "Out for Delivery",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">🚚 Delivery Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Orders" value={orders.length} />
        <StatCard title="Pending" value={1} />
        <StatCard title="Delivered Today" value={3} />
      </div>

      {/* ORDERS LIST */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-semibold mb-4">Assigned Orders</h2>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 flex flex-col md:flex-row justify-between gap-4"
            >
              {/* LEFT */}
              <div className="space-y-1">
                <p className="font-semibold">
                  <FaBox className="inline mr-2 text-indigo-600" />
                  Order ID: {order.id}
                </p>
                <p>👤 {order.customer}</p>
                <p>
                  <FaMapMarkerAlt className="inline mr-2 text-red-500" />
                  {order.address}
                </p>
                <p>
                  <FaPhoneAlt className="inline mr-2 text-green-600" />
                  {order.phone}
                </p>
                <p>
                  <FaMoneyBillWave className="inline mr-2 text-yellow-600" />
                  {order.payment}
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col justify-between gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm w-fit ${
                    order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {order.status}
                </span>

                <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                  <FaCheckCircle />
                  Mark as Delivered
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <p className="text-gray-500 text-sm">{title}</p>
    <h3 className="text-2xl font-bold">{value}</h3>
  </div>
);

export default DeliveryDashboard;
