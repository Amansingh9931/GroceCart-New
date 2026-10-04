import { useEffect, useState } from "react";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck, ShoppingBasket, UserRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../Context/AuthContext.jsx";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

export default function Login({ initialMode = "login" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });

  useEffect(() => { setMode(initialMode); setErrorMessage(""); }, [initialMode]);
  useEffect(() => {
    if (!user) return;
    const from = location.state?.from?.pathname;
    navigate(from || (user.role === "admin" ? "/admin" : user.role === "deliveryBoy" ? "/delivery" : "/user"), { replace: true });
  }, [user, location.state, navigate]);

  const switchMode = (nextMode) => navigate(nextMode === "signup" ? "/signup" : "/signin");
  const handleChange = (event) => { setForm({ ...form, [event.target.name]: event.target.value }); setErrorMessage(""); };
  const finishLogin = (result) => {
    login(result.user, result.token);
    const from = location.state?.from?.pathname;
    navigate(from || (result.user.role === "admin" ? "/admin" : result.user.role === "deliveryBoy" ? "/delivery" : "/user"), { replace: true });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      const url = mode === "signup" ? "/api/user/signup" : "/api/user/signin";
      const payload = mode === "signup" ? form : { email: form.email, password: form.password };
      const { data } = await axios.post(`${BACKEND_URL}${url}`, payload, { headers: { "Content-Type": "application/json" } });
      if (!data.success) throw new Error(data.message || "Unable to continue");
      if (mode === "signup") { setForm((current) => ({ ...current, name: "" })); switchMode("login"); return; }
      finishLogin(data);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || "Unable to continue. Please try again.");
    } finally { setLoading(false); }
  };
  const handleGoogleLogin = async ({ credential }) => {
    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/user/google-signin`, { credential });
      if (!data.success) throw new Error(data.message || "Google sign-in failed");
      finishLogin(data);
    } catch (error) { setErrorMessage(error.response?.data?.message || "Google sign-in failed. Please try again."); }
  };

  const isSignup = mode === "signup";
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:grid lg:grid-cols-2 lg:p-0">
      <section className="mx-auto flex w-full max-w-md flex-col justify-center py-8 lg:py-14">
        <button onClick={() => navigate("/shop")} className="mb-10 inline-flex w-fit items-center gap-2 text-lg font-bold text-emerald-700"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-sm text-white">GC</span>GroceCart</button>
        <div><p className="text-sm font-semibold text-emerald-700">{isSignup ? "CREATE YOUR ACCOUNT" : "WELCOME BACK"}</p><h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{isSignup ? "Start shopping smarter." : "Sign in to GroceCart."}</h1><p className="mt-3 text-slate-500">{isSignup ? "Create an account to save your orders and checkout faster." : "Manage orders, saved addresses, and your cart in one place."}</p></div>
        {errorMessage && <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {isSignup && <label className="block text-sm font-medium text-slate-700">Full name<div className="relative mt-1.5"><UserRound size={18} className="absolute left-3 top-3 text-slate-400" /><input name="name" value={form.name} onChange={handleChange} required autoComplete="name" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50" placeholder="Your name" /></div></label>}
          <label className="block text-sm font-medium text-slate-700">Email address<div className="relative mt-1.5"><Mail size={18} className="absolute left-3 top-3 text-slate-400" /><input name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50" placeholder="you@example.com" /></div></label>
          <label className="block text-sm font-medium text-slate-700">Password<div className="relative mt-1.5"><LockKeyhole size={18} className="absolute left-3 top-3 text-slate-400" /><input name="password" type="password" value={form.password} onChange={handleChange} required minLength="6" autoComplete={isSignup ? "new-password" : "current-password"} className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50" placeholder="At least 6 characters" /></div></label>
          {isSignup && <label className="block text-sm font-medium text-slate-700">Account type<select name="role" value={form.role} onChange={handleChange} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"><option value="user">Customer</option><option value="deliveryBoy">Delivery agent</option></select></label>}
          <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">{loading ? "Please wait..." : isSignup ? "Create account" : "Sign in"}<ArrowRight size={18} /></button>
        </form>
        {!isSignup && <><div className="my-6 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" />OR<span className="h-px flex-1 bg-slate-200" /></div><div className="flex justify-center"><GoogleLogin onSuccess={handleGoogleLogin} onError={() => setErrorMessage("Google sign-in could not be started.")} /></div></>}
        <p className="mt-7 text-center text-sm text-slate-600">{isSignup ? "Already have an account?" : "New to GroceCart?"} <button onClick={() => switchMode(isSignup ? "login" : "signup")} className="font-semibold text-emerald-700 hover:text-emerald-800">{isSignup ? "Sign in" : "Create an account"}</button></p>
        <button onClick={() => navigate("/shop")} className="mt-5 text-center text-sm font-medium text-slate-500 hover:text-emerald-700">Continue browsing as guest</button>
      </section>
      <aside className="relative hidden overflow-hidden bg-emerald-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-500/40 blur-2xl" /><div className="absolute -bottom-32 left-12 h-72 w-72 rounded-full bg-lime-300/20 blur-2xl" />
        <div className="relative flex items-center gap-3 text-lg font-bold"><ShoppingBasket />GroceCart</div>
        <div className="relative max-w-md"><div className="mb-7 grid h-14 w-14 place-items-center rounded-2xl bg-white/15"><ShieldCheck size={29} /></div><h2 className="text-4xl font-bold leading-tight">Groceries, delivered with confidence.</h2><p className="mt-5 text-lg leading-8 text-emerald-50">A faster, simpler way to shop for everyday essentials.</p></div>
        <p className="relative text-sm text-emerald-100">Secure checkout. Simple order tracking.</p>
      </aside>
    </main>
  );
}
