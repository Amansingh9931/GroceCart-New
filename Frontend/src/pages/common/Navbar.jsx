import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, UserRound } from "lucide-react";
import { useAuth } from "../../Context/AuthContext.jsx";
import { ShopContext } from "../../Context/ShopContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getCartCount, setCartDrawerOpen, search, setSearch } = useContext(ShopContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef(null);
  const isShopper = !user || user.role === "user";
  const closeMenu = () => setOpen(false);
  const startClose = () => { closeTimeout.current = setTimeout(closeMenu, 250); };
  const cancelClose = () => { if (closeTimeout.current) clearTimeout(closeTimeout.current); };
  const handleLogout = () => { logout(); closeMenu(); navigate("/shop"); };
  const handleSearch = (event) => { setSearch(event.target.value); navigate("/shop"); };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/shop" className="flex shrink-0 items-center gap-2.5 text-emerald-700" aria-label="GroceCart shop">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-sm">GC</span>
          <span className="hidden sm:block"><strong className="block text-lg leading-5 tracking-tight">GroceCart</strong><small className="text-xs text-slate-500">Daily essentials</small></span>
        </Link>
        {isShopper && <label className="hidden flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-400 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-50 md:flex"><Search size={18} /><input value={search} onChange={handleSearch} placeholder="Search groceries and essentials" className="w-full bg-transparent text-slate-800 outline-none placeholder:text-slate-400" aria-label="Search products" /></label>}
        <div className="ml-auto flex items-center gap-2">
          {isShopper && <button type="button" onClick={() => setCartDrawerOpen(true)} className="relative inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700" aria-label="Open cart"><ShoppingCart size={18} /><span className="hidden sm:inline">Cart</span><span className="rounded-full bg-white/20 px-1.5 text-xs">{getCartCount()}</span></button>}
          {user ? <div className="relative" onMouseEnter={cancelClose} onMouseLeave={startClose}><button onClick={() => setOpen((value) => !value)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"><UserRound size={18} /><span className="hidden sm:inline">{user.name?.split(" ")[0] || "Account"}</span></button>{open && <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl"><Link to="/profile" onClick={closeMenu} className="block px-4 py-2 text-sm hover:bg-slate-50">Profile</Link><Link to="/orders" onClick={closeMenu} className="block px-4 py-2 text-sm hover:bg-slate-50">My orders</Link><Link to="/profile/edit" onClick={closeMenu} className="block px-4 py-2 text-sm hover:bg-slate-50">Edit profile</Link><button onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">Logout</button></div>}</div> : <div className="flex items-center gap-2"><button onClick={() => navigate("/shop")} className="hidden rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 sm:inline">Browse shop</button><button onClick={() => navigate("/signin")} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"><UserRound size={18} /><span className="hidden sm:inline">Sign in</span></button></div>}
        </div>
      </div>
      {isShopper && <div className="mx-auto px-4 pb-3 sm:px-6 md:hidden"><label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-400 focus-within:border-emerald-500 focus-within:bg-white"><Search size={18} /><input value={search} onChange={handleSearch} placeholder="Search groceries" className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400" aria-label="Search products" /></label></div>}
    </header>
  );
}
