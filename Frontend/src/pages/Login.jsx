import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState("login"); // login | signup
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // user | deliveryBoy
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

      const res = await axios.post(url, payload);

      if (mode === "login" && res.data.success) {
        const { user, token } = res.data.data;

        login(user, token);

        if (user.role === "user") navigate("/");
        else if (user.role === "deliveryBoy") navigate("/delivery");
        else navigate("/admin");
      }

      if (mode === "signup" && res.data.success) {
        alert("Registration successful. Please login.");
        setMode("login");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  /* ================= GOOGLE LOGIN ================= */
 const handleGoogleLogin = async (credentialResponse) => {
  try {
    // 1️⃣ Decode Google token
    const decoded = jwtDecode(credentialResponse.credential);

    const payload = {
      email: decoded.email,
      name: decoded.name,
    };

    // 2️⃣ Send ONLY required data
    const res = await axios.post(
      "http://localhost:8000/api/user/google-signin",
      payload
    );

    // 3️⃣ Save auth
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    // 4️⃣ Redirect by role
    if (res.data.user.role === "admin") navigate("/admin");
    else if (res.data.user.role === "deliveryBoy") navigate("/delivery");
    else navigate("/");

  } catch (error) {
    console.error("Google Login Error:", error.response?.data || error);
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
          {/* NAME (SIGN UP ONLY) */}
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

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg bg-slate-800 px-4 py-2 text-white outline-none"
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg bg-slate-800 px-4 py-2 text-white outline-none"
          />

          {/* ROLE SELECT (SIGN UP ONLY) */}
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

          {/* BUTTON */}
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


        {/* ================= GOOGLE BUTTON ================= */}
        {mode === "login" && (
          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => alert("Google Sign In Failed")}
            />
          </div>
        )}

        {/* TOGGLE */}
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
