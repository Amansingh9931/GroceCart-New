import React, { useContext } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import { assets } from "../../assets/frontend_assets/assets.js";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const { products, currency, addToCart } = useContext(ShopContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-6">
      <h2 className="text-xl font-semibold mb-6">All Products</h2>

      {products.length === 0 ? (
        <p className="text-gray-500">No products available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-3"
            >
              {/* IMAGE */}
              <div
                onClick={() => navigate(`/products/${p._id}`)}
                className="cursor-pointer"
              >
                <img
                  src={p.imageUrl?.[0] || assets.placeholder}
                  alt={p.name}
                  className="h-28 w-full object-contain mx-auto"
                />
              </div>

              {/* DELIVERY TAG */}
              <p className="text-[11px] text-gray-500 mt-2">
                ⏱ 9 mins
              </p>

              {/* NAME */}
              <h3 className="text-sm font-medium mt-1 line-clamp-2">
                {p.name}
              </h3>

              {/* SIZE (optional static like Blinkit) */}
              <p className="text-xs text-gray-500 mt-1">
                500 ml
              </p>

              {/* PRICE + ADD */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-semibold">
                  {currency}
                  {p.price}
                </span>

                <button
                  onClick={() => addToCart(p._id, "standard")}
                  className="border border-green-600 text-green-600 text-xs font-semibold px-4 py-1 rounded-md hover:bg-green-50 transition"
                >
                  ADD
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
