import { useContext, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MapPin, Search, ShoppingCart, UserRound } from "lucide-react";
import { useAuth } from "../../Context/AuthContext.jsx";
import { ShopContext } from "../../Context/ShopContext.jsx";
import { SHOP_CATEGORIES } from "../../Config/shopCategories.js";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getCartCount, setCartDrawerOpen, search, setSearch } = useContext(ShopContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef(null);
  const isShopper = !user || user.role === "user";
  const category = new URLSearchParams(location.search).get("category") || "";
  const onShopPage = location.pathname === "/shop" || location.pathname === "/products";
  const closeMenu = () => setOpen(false);
  const startClose = () => { closeTimeout.current = setTimeout(closeMenu, 250); };
  const cancelClose = () => { if (closeTimeout.current) clearTimeout(closeTimeout.current); };
  const handleLogout = () => { logout(); closeMenu(); navigate("/"); };
  const handleSearch = (event) => {
    setSearch(event.target.value);
    if (!onShopPage) navigate("/shop");
  };

  return (
    <header className="relative z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2 text-emerald-700"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 text-2xl">🛒</span><span className="hidden sm:block"><strong className="block text-xl leading-5">GroceCart</strong><small className="text-xs text-slate-500">Fresh groceries, fast</small></span></Link>
        {isShopper && <label className="hidden flex-1 items-center gap-3 rounded-full border-2 border-emerald-500 px-4 py-3 text-sm text-slate-400 transition focus-within:bg-emerald-50 md:flex"><Search size={19} /><input value={search} onChange={handleSearch} placeholder="Search for groceries and essentials" className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400" aria-label="Search products" /></label>}
        <div className="ml-auto flex items-center gap-3">
          {isShopper && <button type="button" onClick={() => setCartDrawerOpen(true)} className="relative inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700" aria-label="Open cart"><ShoppingCart size={18} /><span className="hidden sm:inline">Cart</span><span className="rounded-full bg-white/20 px-1.5 text-xs">{getCartCount()}</span></button>}
          {user ? <div className="relative" onMouseEnter={cancelClose} onMouseLeave={startClose}><button onClick={() => setOpen((value) => !value)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"><UserRound size={18} /><span className="hidden sm:inline">{user.name?.split(" ")[0] || "Account"}</span></button>{open && <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl"><Link to="/profile" onClick={closeMenu} className="block px-4 py-2 text-sm hover:bg-slate-50">Profile</Link><Link to="/orders" onClick={closeMenu} className="block px-4 py-2 text-sm hover:bg-slate-50">My orders</Link><Link to="/profile/edit" onClick={closeMenu} className="block px-4 py-2 text-sm hover:bg-slate-50">Edit profile</Link><button onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">Logout</button></div>}</div> : <div className="flex items-center gap-2"><button onClick={() => navigate("/shop")} className="hidden rounded-xl border border-emerald-200 px-3 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 sm:inline">Continue as guest</button><button onClick={() => navigate("/signin")} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"><UserRound size={18} /><span className="hidden sm:inline">Login</span></button></div>}
        </div>
      </div>
      {isShopper && <div className="mx-auto px-4 pb-3 sm:px-6 md:hidden"><label className="flex items-center gap-3 rounded-full border-2 border-emerald-500 px-4 py-3 text-sm text-slate-400 focus-within:bg-emerald-50"><Search size={19} /><input value={search} onChange={handleSearch} placeholder="Search groceries" className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400" aria-label="Search products" /></label></div>}
      {isShopper && <><div className="border-t border-slate-100"><div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 text-sm text-slate-600 sm:px-6"><MapPin size={16} className="text-emerald-600" /><span>Set delivery location</span></div></div><nav className="border-t border-slate-100"><div className="mx-auto flex max-w-7xl items-stretch gap-1 overflow-x-auto px-4 sm:px-6"><Link to="/" className={`flex min-w-16 flex-col items-center px-3 py-3 text-xs font-medium ${location.pathname === "/" ? "text-emerald-700" : "text-slate-600 hover:text-emerald-700"}`}><span className="text-xl">🏠</span><span className="mt-1">Home</span></Link>{SHOP_CATEGORIES.slice(0, 8).map((item) => { const active = onShopPage && category === item.value; const path = item.value ? `/shop?category=${encodeURIComponent(item.value)}` : "/shop"; return <Link key={item.value || "shop"} to={path} className={`flex min-w-19 flex-col items-center px-3 py-3 text-xs font-medium ${active ? "border-b-2 border-emerald-600 text-emerald-700" : "text-slate-600 hover:text-emerald-700"}`}><span className="text-xl">{item.icon}</span><span className="mt-1 whitespace-nowrap">{item.navLabel}</span></Link>; })}</div></nav></>}
    </header>
  );
}
