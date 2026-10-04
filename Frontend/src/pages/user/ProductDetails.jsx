import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Minus, Plus, ShieldCheck, ShoppingCart, Star, Truck } from "lucide-react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import api from "../../Api/axios.js";

const fallbackImage = "https://placehold.co/600x600/f1f5f9/64748b?text=Product";

function RelatedCard({ product, onOpen, onAdd }) {
  const discount = product.originalPrice > product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
      <button onClick={onOpen} className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-100"><img loading="lazy" decoding="async" src={product.imageUrl?.[0] || fallbackImage} onError={(event) => { event.currentTarget.src = fallbackImage; }} alt={product.name} className="h-full w-full object-contain p-2" />{discount > 0 && <span className="absolute left-2 top-2 rounded-full bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-600">{discount}% OFF</span>}</button>
      <button onClick={onOpen} className="mt-3 w-full text-left"><h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-slate-800">{product.name}</h3></button>
      <p className="mt-1 truncate text-xs text-slate-500">{product.quantity || "1 pack"}</p>
      <div className="mt-3 flex items-center justify-between"><strong className="text-lg text-emerald-700">₹{product.price}</strong><button onClick={onAdd} className="rounded-full bg-emerald-50 p-2.5 text-emerald-700 hover:bg-emerald-600 hover:text-white" aria-label={`Add ${product.name} to cart`}><ShoppingCart size={17} /></button></div>
    </article>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, productsLoading, cartItems, addToCart, updateQuantity } = useContext(ShopContext);
  const [remoteProduct, setRemoteProduct] = useState(null);
  const [fetchError, setFetchError] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const contextProduct = products.find((item) => item._id === id);
  const product = contextProduct || remoteProduct;
  const size = "standard";
  const quantity = cartItems?.[id]?.[size] || 0;

  useEffect(() => {
    if (contextProduct) return undefined;
    let active = true;
    api.get(`/api/products/${id}`)
      .then((response) => { if (active && response.data?.success) setRemoteProduct(response.data.product); })
      .catch(() => { if (active) setFetchError("This product is unavailable right now."); });
    return () => { active = false; };
  }, [contextProduct, id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.filter((item) => item._id !== product._id && item.category === product.category).slice(0, 4);
  }, [product, products]);

  if (!product && (productsLoading || !fetchError)) return <div className="flex min-h-[60vh] items-center justify-center bg-slate-50"><div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" aria-label="Loading product" /></div>;
  if (!product) return <div className="flex min-h-[60vh] flex-col items-center justify-center bg-slate-50 text-slate-600"><p>{fetchError}</p><Link to="/shop" className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Back to shop</Link></div>;

  const discount = product.originalPrice > product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const brand = product.brand || product.name.split(" - ")[0];
  const addOne = () => {
    const quantityToAdd = quantity > 0 ? 1 : selectedQuantity;
    addToCart(product._id, size, quantityToAdd);
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <nav className="mb-8 text-sm text-slate-500"><Link to={`/shop?category=${encodeURIComponent(product.category || "")}`} className="hover:text-emerald-700">Shop</Link><span className="px-2">/</span><span className="capitalize">{product.category || "Groceries"}</span><span className="px-2">/</span><span className="font-medium text-slate-700">{product.name}</span></nav>
        <section className="grid gap-10 lg:grid-cols-[minmax(360px,0.9fr)_minmax(420px,1.1fr)] lg:items-center">
          <div className="relative flex min-h-[380px] items-center justify-center rounded-3xl bg-slate-100 p-8 sm:min-h-[470px]">
            {discount > 0 && <span className="absolute left-5 top-5 rounded-full bg-rose-500 px-3 py-1.5 text-sm font-bold text-white">{discount}% OFF</span>}
            <img src={product.imageUrl?.[0] || fallbackImage} onError={(event) => { event.currentTarget.src = fallbackImage; }} alt={product.name} className="max-h-[390px] max-w-full object-contain" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{product.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2"><div className="flex text-amber-500"><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /></div><span className="text-sm text-slate-600">(4.6)</span><span className="text-slate-300">•</span><span className="rounded-full bg-emerald-100 px-2.5 py-1 text-sm font-semibold text-emerald-700">In stock</span></div>
            <div className="mt-6 flex items-end gap-3"><strong className="text-4xl font-extrabold text-emerald-600">₹{product.price}</strong>{discount > 0 && <span className="pb-1 text-xl text-slate-400 line-through">₹{product.originalPrice}</span>}</div>
            <dl className="mt-6 space-y-2 text-slate-700"><div><dt className="inline font-semibold">Brand: </dt><dd className="inline">{brand}</dd></div><div><dt className="inline font-semibold">Unit: </dt><dd className="inline">{product.quantity || "1 pack"}</dd></div></dl>
            <div className="mt-7"><h2 className="font-bold text-slate-900">About this product</h2><p className="mt-2 leading-7 text-slate-600">{product.description || `A quality ${product.category || "grocery"} item, selected for freshness and delivered with care.`}</p></div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><div className="flex h-14 items-center overflow-hidden rounded-xl border border-slate-200 bg-white"><button onClick={() => quantity ? updateQuantity(product._id, size, Math.max(0, quantity - 1)) : setSelectedQuantity((value) => Math.max(1, value - 1))} className="grid h-full w-14 place-items-center text-emerald-700 hover:bg-emerald-50" aria-label="Decrease quantity"><Minus size={18} /></button><span className="grid h-full min-w-14 place-items-center border-x border-slate-200 font-semibold">{quantity || selectedQuantity}</span><button onClick={() => quantity ? updateQuantity(product._id, size, quantity + 1) : setSelectedQuantity((value) => value + 1)} className="grid h-full w-14 place-items-center text-emerald-700 hover:bg-emerald-50" aria-label="Increase quantity"><Plus size={18} /></button></div><button onClick={addOne} className="flex h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 font-bold text-white transition hover:bg-emerald-700"><ShoppingCart size={21} /> {quantity > 0 ? "Add one more" : "Add to cart"}</button></div>
            <div className="mt-7 grid grid-cols-2 gap-4 text-sm text-slate-600"><p className="flex items-center gap-2"><Truck size={19} className="text-emerald-600" /> 30 min delivery</p><p className="flex items-center gap-2"><ShieldCheck size={19} className="text-emerald-600" /> Quality guaranteed</p><p className="col-span-2 flex items-center gap-2"><CheckCircle2 size={19} className="text-emerald-600" /> Carefully packed for your order</p></div>
          </div>
        </section>
        {relatedProducts.length > 0 && <section className="mt-16"><div className="mb-6 flex items-center justify-between"><div><h2 className="text-2xl font-extrabold text-slate-900">Related products</h2><p className="mt-1 text-sm text-slate-500">More from {product.category}</p></div><Link to={`/shop?category=${encodeURIComponent(product.category || "")}`} className="text-sm font-semibold text-emerald-700 hover:underline">View all</Link></div><div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{relatedProducts.map((item) => <RelatedCard key={item._id} product={item} onOpen={() => navigate(`/products/${item._id}`)} onAdd={() => addToCart(item._id, size)} />)}</div></section>}
      </div>
    </main>
  );
}
