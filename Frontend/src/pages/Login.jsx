import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/AuthContext.jsx";
import { GoogleLogin } from "@react-oauth/google";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Login = ({ initialMode = "login" }) => {
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

  const [mode, setMode] = useState(initialMode); // login | signup
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showBannedAlert, setShowBannedAlert] = useState(false);

  // Update URL when mode changes
  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === "signup") {
      navigate("/signup");
    } else {
      navigate("/signin");
    }
  };

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMessage(""); // Clear error when user types
  };

  /* ================= SIMPLE LOGIN / SIGNUP ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

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
        setErrorMessage("✓ Registration successful. Please login.");
        // Store email, password, and role for pre-filling
        const signupEmail = form.email;
        const signupPassword = form.password;
        const signupRole = form.role;
        setForm({ name: "", email: signupEmail, password: signupPassword, role: signupRole });
        // Navigate to signin and update mode
        handleModeChange("login");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || "Something went wrong";
      const status = err.response?.data?.status;

      if (status === "banned") {
        setShowBannedAlert(true);
        setErrorMessage("🚫 Your account has been banned. You cannot login.");
      } else if (status === "inactive") {
        setErrorMessage("⚠️ Your account is inactive. Please contact support.");
      } else {
        setErrorMessage(errMsg);
      }

      console.error("LOGIN ERROR:", err.response?.data || err);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black p-4">
      {/* Banned Alert Modal */}
      {showBannedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl"
          >
            <div className="mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl">🚫</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Account Banned</h2>
            <p className="text-gray-600 mb-6">
              Your account has been banned due to policy violations. You cannot login at this time.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              If you believe this is a mistake, please contact our support team.
            </p>
            <button
              onClick={() => setShowBannedAlert(false)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}

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

        {/* Error Message Display */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`mb-4 p-4 rounded-lg text-sm font-medium ${
              errorMessage.includes("✓") 
                ? "bg-green-500 bg-opacity-20 border border-green-500 text-green-300"
                : errorMessage.includes("🚫")
                ? "bg-red-500 bg-opacity-20 border border-red-500 text-red-300"
                : errorMessage.includes("⚠️")
                ? "bg-yellow-500 bg-opacity-20 border border-yellow-500 text-yellow-300"
                : "bg-red-500 bg-opacity-20 border border-red-500 text-red-300"
            }`}
          >
            {errorMessage}
          </motion.div>
        )}

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
                onClick={() => handleModeChange("signup")}
                className="text-indigo-400 hover:underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => handleModeChange("login")}
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
