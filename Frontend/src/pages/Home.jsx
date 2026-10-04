import { useContext, useMemo } from "react";
import { ArrowRight, Clock3, MapPin, ShoppingBasket, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext.jsx";
import { SHOP_CATEGORIES } from "../Config/shopCategories.js";

const fallbackImage = "https://placehold.co/360x280/f1f5f9/64748b?text=GroceCart";

export default function Home() {
  const navigate = useNavigate();
  const { products, productsLoading, addToCart } = useContext(ShopContext);
  const popularProducts = useMemo(() => products.slice(0, 8), [products]);

  return (
    <main className="min-h-screen bg-slate-50 pb-14 text-slate-900">
      <section className="border-b border-emerald-100 bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:py-20">
          <div><p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium"><Clock3 size={16} /> Everyday delivery, made simple</p><h1 className="mt-5 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">Fresh groceries for every day.</h1><p className="mt-5 max-w-xl text-lg leading-8 text-emerald-50">Shop fresh produce, pantry staples, and home essentials from one reliable place.</p><div className="mt-8 flex flex-wrap gap-3"><button onClick={() => navigate("/shop")} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50">Shop groceries <ArrowRight size={18} /></button><button onClick={() => navigate("/signup")} className="rounded-xl border border-white/35 px-5 py-3 font-semibold transition hover:bg-white/10">Create an account</button></div></div>
          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur"><div className="grid grid-cols-2 gap-4"><div className="rounded-2xl bg-white p-5 text-slate-800"><ShoppingBasket className="text-emerald-600" /><p className="mt-6 text-2xl font-bold">9,500+</p><p className="mt-1 text-sm text-slate-500">Everyday products</p></div><div className="rounded-2xl bg-emerald-950/25 p-5"><MapPin className="text-lime-200" /><p className="mt-6 text-2xl font-bold">Easy</p><p className="mt-1 text-sm text-emerald-100">Browse by category</p></div></div><p className="mt-5 text-sm text-emerald-50">Everything you need, from your weekly shop to last-minute essentials.</p></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6"><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-semibold text-emerald-700">SHOP BY CATEGORY</p><h2 className="mt-1 text-2xl font-bold tracking-tight">Find what you need</h2></div><button onClick={() => navigate("/shop")} className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">View all</button></div><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{SHOP_CATEGORIES.slice(1).map((category) => <button key={category.value} onClick={() => navigate(`/shop?category=${encodeURIComponent(category.value)}`)} className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"><span className="text-2xl">{category.icon}</span><span className="mt-5 block text-sm font-semibold text-slate-700 group-hover:text-emerald-700">{category.label}</span></button>)}</div></section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6"><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-semibold text-emerald-700">POPULAR NOW</p><h2 className="mt-1 text-2xl font-bold tracking-tight">Stock up on essentials</h2></div><button onClick={() => navigate("/shop")} className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">Browse shop</button></div>{productsLoading ? <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4"><div className="h-64 animate-pulse rounded-2xl bg-slate-200" /><div className="h-64 animate-pulse rounded-2xl bg-slate-200" /><div className="h-64 animate-pulse rounded-2xl bg-slate-200" /><div className="h-64 animate-pulse rounded-2xl bg-slate-200" /></div> : <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{popularProducts.map((product) => <article key={product._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><button onClick={() => navigate(`/products/${product._id}`)} className="flex h-36 w-full items-center justify-center rounded-xl bg-slate-50"><img loading="lazy" src={product.imageUrl?.[0] || fallbackImage} alt={product.name} onError={(event) => { event.currentTarget.src = fallbackImage; }} className="h-full w-full object-contain p-3" /></button><h3 className="mt-3 line-clamp-2 min-h-10 text-sm font-bold text-slate-800">{product.name}</h3><div className="mt-2 flex items-center gap-1 text-xs text-amber-500"><Star size={14} fill="currentColor" /><span className="text-slate-400">4.2</span></div><div className="mt-4 flex items-center justify-between"><strong className="text-lg text-emerald-700">Rs. {product.price}</strong><button onClick={() => addToCart(product._id, "standard")} className="rounded-lg border border-emerald-200 px-3 py-1.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50">Add</button></div></article>)}</div>}</section>
    </main>
  );
}
