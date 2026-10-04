import { useState } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext.jsx";
import {
  Truck,
  Package,
  Navigation,
  History,
  DollarSign,
  LogOut,
  Power,
  Store,
  LayoutDashboard,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";

export default function LayoutDelivery() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(() => {
    return localStorage.getItem("grocecart_delivery_online") !== "false";
  });

  const handleToggleOnline = () => {
    const next = !isOnline;
    setIsOnline(next);
    localStorage.setItem("grocecart_delivery_online", String(next));
    if (next) {
      toast.success("You are now ONLINE and ready to receive 10-minute orders! 🛵");
    } else {
      toast.info("You are now OFFLINE. New delivery orders will be paused.");
    }
  };

  const handleLogout = () => {
    logout();
    toast.info("Logged out from delivery partner portal");
    navigate("/signin");
  };

  const navItems = [
    { name: "Dashboard", path: "/delivery", icon: LayoutDashboard, end: true },
    { name: "Available Orders", path: "/delivery/available", icon: Package },
    { name: "Active Delivery", path: "/delivery/active-delivery", icon: Navigation },
    { name: "Delivery History", path: "/delivery/history", icon: History },
    { name: "My Earnings", path: "/delivery/earnings", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col pb-16 md:pb-0">
      {/* 1. Partner Top Navigation Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between py-3">
          {/* Brand & Partner Badge */}
          <div className="flex items-center gap-3">
            <Link to="/delivery" className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-500 text-slate-950 font-black text-lg shadow-sm shadow-emerald-500/30">
                🛵
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white">
                    Groce<span className="text-emerald-400">Cart</span>
                  </span>
                  <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    FLEET
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Delivery Partner App</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`
                  }
                >
                  <Icon size={15} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Online Toggle & Profile Actions */}
          <div className="flex items-center gap-3">
            {/* Duty Status Button */}
            <button
              type="button"
              onClick={handleToggleOnline}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-xs ${
                isOnline
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                  : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isOnline ? "bg-emerald-400 animate-ping" : "bg-slate-500"
                }`}
              />
              <span className="hidden sm:inline">
                {isOnline ? "Duty: Online" : "Duty: Offline"}
              </span>
              <Power size={13} />
            </button>

            {/* Logout button */}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition"
              title="Sign out of delivery portal"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Delivery Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 3. Mobile Sticky Bottom Navigation (Optimized for Delivery Drivers on Phone) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-slate-900 border-t border-slate-800 z-50 flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 text-[10px] font-bold py-1 px-2 rounded-lg transition ${
                  isActive ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"
                }`
              }
            >
              <Icon size={18} />
              <span>{item.name.split(" ")[0]}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}