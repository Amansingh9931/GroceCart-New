import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/AuthContext.jsx";
import { GoogleLogin } from "@react-oauth/google";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  // If already logged in and no return location, redirect to appropriate dashboard
  React.useEffect(() => {
    if (!user) return;
    const from = location.state?.from?.pathname;
    if (from) return; // leave navigation to original redirect logic after login

    if (user.role === "admin") navigate("/admin", { replace: true });
    else if (user.role === "deliveryBoy") navigate("/delivery", { replace: true });
    else navigate("/user", { replace: true });
  }, [user, location]);

  const [mode, setMode] = useState("login"); // login | signup
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SIMPLE LOGIN / SIGNUP ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let url = "";
      let payload = {};

      if (mode === "signup") {
        url = `${BACKEND_URL}/api/user/signup`;
        payload = {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        };
      } else {
        url = `${BACKEND_URL}/api/user/signin`;
        payload = {
          email: form.email,
          password: form.password,
        };
      }

      const res = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (mode === "login" && res.data.success) {
        const { user, token } = res.data;

        login(user, token);

        const from = location.state?.from?.pathname;
        if (from) navigate(from, { replace: true });
        else if (user.role === "admin") navigate("/admin");
        else if (user.role === "deliveryBoy") navigate("/delivery");
        else navigate("/user");
      }

      if (mode === "signup" && res.data.success) {
        alert("Registration successful. Please login.");
        setMode("login");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= GOOGLE LOGIN ================= */
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/user/google-signin`,
        { credential: credentialResponse.credential },
        { headers: { "Content-Type": "application/json" } }
      );

      const { user, token } = res.data;

      login(user, token);

      const from = location.state?.from?.pathname;
      if (from) navigate(from, { replace: true });
      else if (user.role === "admin") navigate("/admin");
      else if (user.role === "deliveryBoy") navigate("/delivery");
      else navigate("/user");
    } catch (error) {
      console.error("Google Login Error:", error.response?.data || error);
      alert(error.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-xl"
      >
        <h2 className="text-2xl font-bold text-white mb-1">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h2>
        <p className="text-slate-400 mb-6">
          {mode === "login"
            ? "Login to continue"
            : "Sign up to start shopping"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-slate-800 px-4 py-2 text-white outline-none"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg bg-slate-800 px-4 py-2 text-white outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg bg-slate-800 px-4 py-2 text-white outline-none"
          />

          {mode === "signup" && (
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-800 px-4 py-2 text-white"
            >
              <option value="user">Customer</option>
              <option value="deliveryBoy">Delivery Agent</option>
            </select>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 py-2 text-white font-semibold hover:opacity-90"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        {mode === "login" && (
          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => alert("Google Sign In Failed")}
            />
          </div>
        )}

        <p className="mt-4 text-center text-slate-400 text-sm">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-indigo-400 hover:underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-indigo-400 hover:underline"
              >
                Sign In
              </button>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
