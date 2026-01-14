import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const computeCount = () => {
      try {
        const stored =
          localStorage.getItem("cartItems") || localStorage.getItem("cart") || "{}";
        const parsed = JSON.parse(stored);

        let count = 0;

        if (Array.isArray(parsed)) {
          // array of items
          count = parsed.reduce((s, it) => s + (it.quantity || 1), 0);
        } else if (parsed && typeof parsed === "object") {
          // object mapping productId -> size -> qty (shape used in Cart.jsx)
          for (const pid in parsed) {
            const sizes = parsed[pid];
            if (!sizes) continue;
            for (const sz in sizes) {
              count += Number(sizes[sz] || 0);
            }
          }
        }

        setCartCount(count);
      } catch (e) {
        setCartCount(0);
      }
    };

    computeCount();
    window.addEventListener("storage", computeCount);
    return () => window.removeEventListener("storage", computeCount);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Redirect logged-in users to their dashboard
  if (user) {
    if (user.role === "admin") {
      navigate("/admin", { replace: true });
      return null;
    }
    if (user.role === "deliveryBoy") {
      navigate("/delivery", { replace: true });
      return null;
    }
    if (user.role === "user") {
      navigate("/user", { replace: true });
      return null;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">

      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mx-auto mt-16 max-w-4xl text-center"
      >
        <h2 className="text-4xl font-extrabold text-gray-800 md:text-5xl">
          Fresh Groceries,{" "}
          <span className="text-green-600">Delivered Fast</span>
        </h2>

        <p className="mt-6 text-lg text-gray-600">
          Order fresh vegetables, fruits, and daily essentials at the best
          prices with lightning-fast delivery.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="rounded-xl bg-green-600 px-8 py-3 text-white shadow-lg hover:bg-green-700">
            Shop Now
          </button>

          {!user && (
            <button
              onClick={() => navigate("/signin")}
              className="rounded-xl border-2 border-green-600 px-8 py-3 text-green-600 hover:bg-green-50"
            >
              Get Started
            </button>
          )}
        </div>
      </motion.div>

      {/* FEATURES */}
      <div className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-4">
        {[
          { icon: "🥦", title: "Fresh Products" },
          { icon: "🚚", title: "Fast Delivery" },
          { icon: "💳", title: "Secure Payments" },
          { icon: "📍", title: "Live Tracking" },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="rounded-2xl bg-white p-6 text-center shadow-lg hover:shadow-xl"
          >
            <div className="text-4xl">{item.icon}</div>
            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              {item.title}
            </h3>
          </motion.div>
        ))}
      </div>

      {/* FOOTER */}
      <footer className="mt-24 bg-green-600 py-6 text-center text-white">
        © {new Date().getFullYear()} GroceCart. All rights reserved.
      </footer>
    </div>
  );
}
