import { useContext, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Filter, Search, ShoppingCart, SlidersHorizontal, Star } from "lucide-react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import { SHOP_CATEGORIES } from "../../Config/shopCategories.js";

const PAGE_SIZE = 24;
const fallbackImage = "https://placehold.co/420x320/f1f5f9/64748b?text=Product";
const titleCase = (value) => value.replace(/\b\w/g, (letter) => letter.toUpperCase());

const withinOneEdit = (first, second) => {
  if (Math.abs(first.length - second.length) > 1) return false;
  let firstIndex = 0;
  let secondIndex = 0;
  let edits = 0;
  while (firstIndex < first.length && secondIndex < second.length) {
    if (first[firstIndex] === second[secondIndex]) {
      firstIndex += 1;
      secondIndex += 1;
    } else if (edits === 1) {
      return false;
    } else {
      edits += 1;
      if (first.length > second.length) firstIndex += 1;
      else if (second.length > first.length) secondIndex += 1;
      else { firstIndex += 1; secondIndex += 1; }
    }
  }
  return true;
};

const matchesSearch = (product, query) => {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const words = `${product.name} ${product.category || ""} ${product.subCategory || ""}`.toLowerCase().match(/[a-z0-9]+/g) || [];
  return terms.every((term) => words.some((word) => word.includes(term) || (term.length >= 4 && withinOneEdit(word, term))));
};

function ProductCard({ product, quantity, onAdd, onUpdate, onOpen }) {
  const discount = product.originalPrice > product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  return (
    <article className="group flex min-h-[390px] flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg">
      <button onClick={onOpen} className="relative flex h-44 items-center justify-center overflow-hidden rounded-[18px] bg-slate-100" aria-label={`View ${product.name}`}>
        {discount > 0 && <span className="absolute left-2 top-2 z-10 rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600">{discount}% OFF</span>}
        <img loading="lazy" decoding="async" src={product.imageUrl?.[0] || fallbackImage} alt={product.name} onError={(event) => { event.currentTarget.src = fallbackImage; }} className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105" />
      </button>
      <button onClick={onOpen} className="mt-4 text-left"><h2 className="line-clamp-2 min-h-11 text-[15px] font-bold leading-5 text-slate-800 group-hover:text-emerald-700">{product.name}</h2></button>
      <div className="mt-3 flex items-center gap-1 text-xs text-amber-500"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} className="text-slate-300" /><span className="ml-1 text-slate-400">(4.2)</span></div>
      <p className="mt-2 truncate text-sm text-slate-500">{product.name.split(" - ")[0]} · {product.quantity || "1 pack"}</p>
      <div className="mt-auto flex items-end justify-between gap-2 pt-4"><div><p className="text-xl font-bold text-emerald-700">₹{product.price}</p>{discount > 0 && <p className="text-xs text-slate-400 line-through">₹{product.originalPrice}</p>}</div>{quantity > 0 ? <div className="flex items-center overflow-hidden rounded-full bg-emerald-600 text-white shadow-sm"><button onClick={() => onUpdate(quantity - 1)} className="px-3 py-2 text-lg leading-none hover:bg-emerald-700" aria-label="Decrease quantity">−</button><span className="min-w-5 text-center text-sm font-semibold">{quantity}</span><button onClick={() => onUpdate(quantity + 1)} className="px-3 py-2 text-lg leading-none hover:bg-emerald-700" aria-label="Increase quantity">+</button></div> : <button onClick={onAdd} className="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-700 transition hover:bg-emerald-600 hover:text-white" aria-label={`Add ${product.name} to cart`}><ShoppingCart size={20} /></button>}</div>
    </article>
  );
}

export default function Products() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, productsLoading, productsError, getProductData, cartItems, addToCart, updateQuantity, setCartDrawerOpen, search, setSearch } = useContext(ShopContext);
  const [page, setPage] = useState(1);
  const selectedCategory = searchParams.get("category") || "";
  const categoryName = SHOP_CATEGORIES.find((category) => category.value === selectedCategory)?.label || titleCase(selectedCategory || "All Products");
  // Keep every category visible even while the catalogue is loading or a
  // category currently has no matching products.
  const categories = SHOP_CATEGORIES;
  const filteredProducts = useMemo(() => products.filter((product) => {
    const inCategory = !selectedCategory || product.category?.toLowerCase() === selectedCategory;
    return inCategory && matchesSearch(product, search);
  }), [products, selectedCategory, search]);
  const pages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const visibleProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectCategory = (category) => {
    setPage(1);
    setSearchParams(category.value ? { category: category.value } : {});
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-12 text-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-sm text-slate-500">Home / Shop / <span className="text-emerald-600">{categoryName}</span></p><h1 className="mt-2 text-2xl font-bold">{categoryName}</h1></div><button onClick={() => setCartDrawerOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white md:hidden"><ShoppingCart size={17} /> Open cart</button></div>
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-5"><h2 className="flex items-center gap-2 text-lg font-bold"><Filter size={20} /> Category</h2><div className="mt-4 space-y-1">{categories.map((category) => <button key={category.label} onClick={() => selectCategory(category)} className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${selectedCategory === category.value ? "bg-emerald-100 font-medium text-emerald-700" : "text-slate-600 hover:bg-slate-50"}`}>{category.label}</button>)}</div><label className="mt-6 block text-sm font-bold" htmlFor="catalog-search">Search</label><div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-emerald-500"><Search size={17} className="text-slate-400" /><input id="catalog-search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Filter products..." className="w-full py-2.5 text-sm outline-none" /></div></aside>
          <section><div className="mb-5 flex items-center justify-between"><p className="text-sm text-slate-600">Showing <strong>{filteredProducts.length ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, filteredProducts.length)}</strong> of <strong>{filteredProducts.length}</strong> products</p><SlidersHorizontal size={19} className="text-slate-400" /></div>
            {productsLoading ? <div className="flex justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" /></div> : productsError ? <div className="rounded-2xl bg-red-50 p-5 text-red-700"><p>{productsError}</p><button onClick={getProductData} className="mt-3 rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold">Try again</button></div> : visibleProducts.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">No products found. Try a different category or search.</div> : <><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">{visibleProducts.map((product) => { const size = "standard"; const quantity = cartItems?.[product._id]?.[size] || 0; return <ProductCard key={product._id} product={product} quantity={quantity} onAdd={() => addToCart(product._id, size)} onUpdate={(nextQuantity) => updateQuantity(product._id, size, nextQuantity)} onOpen={() => navigate(`/products/${product._id}`)} />; })}</div>{pages > 1 && <div className="mt-8 flex items-center justify-center gap-3"><button disabled={page === 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40">Previous</button><span className="text-sm text-slate-600">Page {page} of {pages}</span><button disabled={page === pages} onClick={() => setPage((value) => value + 1)} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white disabled:opacity-40">Next</button></div>}</>}
          </section>
        </div>
      </div>
    </main>
  );
}
