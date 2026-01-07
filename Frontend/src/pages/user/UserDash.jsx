import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext.jsx";
import {
  FaShoppingCart,
  FaBoxOpen,
  FaHeart,
  FaUserCircle,
  FaListAlt,
} from "react-icons/fa";

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = {
    orders: 5,
    cart: 3,
    wishlist: 2,
  };

  const recentOrders = [
    { id: "ORD123", status: "Delivered", amount: 560 },
    { id: "ORD124", status: "Out for delivery", amount: 320 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* WELCOME */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Welcome back, {user.name} 👋
        </h1>
        <p className="text-gray-500">
          Here’s what’s happening with your account
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Orders"
          value={stats.orders}
          icon={<FaListAlt />}
          color="bg-indigo-600"
        />
        <StatCard
          title="Cart Items"
          value={stats.cart}
          icon={<FaShoppingCart />}
          color="bg-green-600"
        />
        <StatCard
          title="Wishlist"
          value={stats.wishlist}
          icon={<FaHeart />}
          color="bg-pink-600"
        />
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <ActionCard
          title="Browse Products"
          icon={<FaBoxOpen />}
          onClick={() => navigate("/products")}
        />
        <ActionCard
          title="My Orders"
          icon={<FaListAlt />}
          onClick={() => navigate("/orders")}
        />
        <ActionCard
          title="Cart"
          icon={<FaShoppingCart />}
          onClick={() => navigate("/cart")}
        />
        <ActionCard
          title="Profile"
          icon={<FaUserCircle />}
          onClick={() => navigate("/profile")}
        />
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

        {recentOrders.length === 0 ? (
          <p className="text-gray-500">No recent orders</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center border p-3 rounded-lg"
              >
                <div>
                  <p className="font-semibold">Order ID: {order.id}</p>
                  <p className="text-sm text-gray-500">
                    Status: {order.status}
                  </p>
                </div>
                <p className="font-semibold">₹{order.amount}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ✅ DEFINE COMPONENTS BELOW */

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
    <div className={`text-white p-3 rounded-lg ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-xl font-bold">{value}</h3>
    </div>
  </div>
);

const ActionCard = ({ title, icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-lg transition"
  >
    <div className="text-indigo-600 text-2xl">{icon}</div>
    <p className="font-medium">{title}</p>
  </div>
);

export default UserDashboard;
