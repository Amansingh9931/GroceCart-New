import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";

const backend_URL = "http://localhost:8000"; // ✅ change if needed

const Login = () => {
  const navigate = useNavigate();

  const [currentState, setCurrentState] = useState("Login"); // Login | Sign Up
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const route =
        currentState === "Sign Up"
          ? "/api/users/register"
          : "/api/users/login";

      const payload =
        currentState === "Sign Up"
          ? { name, email, password }
          : { email, password };

      const res = await axios.post(`${backend_URL}${route}`, payload);

      if (res.data?.success) {
        const token = res.data.token;
        localStorage.setItem("token", token); // ✅ store token
        toast.success(res.data.message || "Success");
        navigate("/"); // ✅ redirect after login
      } else {
        setErrorMsg(res.data.message || "Something went wrong");
        toast.error(res.data.message);
      }
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message ||
          err.message ||
          "Server error, try again"
      );
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900 p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          {currentState === "Login" ? "Login" : "Create Account"}
        </h2>

        <form onSubmit={onSubmitHandler} className="space-y-4">
          {currentState === "Sign Up" && (
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 py-2 bg-slate-800 text-white rounded-lg outline-none"
              />
            </div>
          )}

          <div className="relative">
            <FiMail className="absolute left-3 top-3 text-slate-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 py-2 bg-slate-800 text-white rounded-lg outline-none"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 py-2 bg-slate-800 text-white rounded-lg outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-xs text-blue-400"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {errorMsg && <p className="text-red-400 text-xs">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-white font-semibold"
          >
            {loading
              ? "Please wait..."
              : currentState === "Login"
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          {currentState === "Login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            className="text-blue-400"
            onClick={() =>
              setCurrentState(
                currentState === "Login" ? "Sign Up" : "Login"
              )
            }
          >
            {currentState === "Login" ? "Sign Up" : "Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
