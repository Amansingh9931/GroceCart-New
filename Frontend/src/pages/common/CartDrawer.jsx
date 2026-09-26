import { useContext, useMemo } from "react";
import { X, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext.jsx";

const fallbackImage = "https://placehold.co/160x160/f1f5f9/64748b?text=Product";

export default function CartDrawer() {
  const navigate = useNavigate();
  const { cartDrawerOpen, setCartDrawerOpen, cartItems, products, currency, getCartCount, getCartAmount, updateQuantity } = useContext(ShopContext);
  const items = useMemo(() => Object.entries(cartItems).flatMap(([productId, sizes]) => Object.entries(sizes).filter(([, quantity]) => quantity > 0).map(([size, quantity]) => ({ product: products.find((item) => item._id === productId), productId, size, quantity }))).filter((item) => item.product), [cartItems, products]);

  if (!cartDrawerOpen) return null;
  const total = getCartAmount();
  const continueToCheckout = () => { setCartDrawerOpen(false); navigate("/place-order"); };

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button className="absolute inset-0 bg-slate-950/45" aria-label="Close cart" onClick={() => setCartDrawerOpen(false)} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-6 py-5"><div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-bold text-slate-800">Your cart ({getCartCount()})</h2><p className="mt-1 text-sm text-slate-500">Fresh picks, delivered quickly.</p></div><button onClick={() => setCartDrawerOpen(false)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Close cart"><X size={21} /></button></div></div>
        <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
          {items.length === 0 ? <div className="flex h-full flex-col items-center justify-center text-center"><ShoppingCart className="mb-4 text-slate-300" size={48} /><h3 className="font-semibold text-slate-800">Your cart is empty</h3><p className="mt-1 max-w-xs text-sm text-slate-500">Add essentials from the catalogue to see them here.</p></div> : <div className="space-y-3">{items.map(({ product, productId, size, quantity }) => <article key={`${productId}-${size}`} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><div className="flex gap-3"><img src={product.imageUrl?.[0] || fallbackImage} alt={product.name} onError={(event) => { event.currentTarget.src = fallbackImage; }} className="h-16 w-16 rounded-xl bg-slate-100 object-contain" /><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><div><h3 className="line-clamp-2 text-sm font-semibold text-slate-800">{product.name}</h3><p className="mt-1 text-xs text-slate-500">{product.quantity || size}</p></div><button onClick={() => updateQuantity(productId, size, 0)} className="h-fit rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label={`Remove ${product.name}`}><Trash2 size={16} /></button></div><div className="mt-3 flex items-center justify-between"><span className="font-bold text-emerald-700">{currency}{product.price}</span><div className="flex items-center rounded-full border border-emerald-200 bg-emerald-50"><button onClick={() => updateQuantity(productId, size, Math.max(0, quantity - 1))} className="p-1.5 text-emerald-700" aria-label="Decrease quantity"><Minus size={15} /></button><span className="min-w-7 text-center text-sm font-semibold text-emerald-800">{quantity}</span><button onClick={() => updateQuantity(productId, size, quantity + 1)} className="p-1.5 text-emerald-700" aria-label="Increase quantity"><Plus size={15} /></button></div></div></div></div></article>)}</div>}
        </div>
        <div className="border-t border-slate-200 bg-white p-5"><div className="mb-4 flex items-end justify-between"><span className="text-slate-600">Total</span><strong className="text-2xl text-slate-900">{currency}{total}</strong></div><button disabled={!items.length} onClick={continueToCheckout} className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300">Proceed to checkout →</button></div>
      </aside>
    </div>
  );
}
