import React from "react";
import { useContext } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import { assets } from "../../assets/frontend_assets/assets.js";

export default function Products() {
  const { products, currency, addToCart } = useContext(ShopContext);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-6">All Products</h2>

      {products.length === 0 ? (
        <p className="text-gray-500">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p._id} className="bg-white rounded-lg shadow p-4">
              <img
                src={p.imageUrl?.[0] || assets.placeholder}
                alt={p.name}
                className="h-40 w-full object-cover rounded-md mb-3"
              />
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <p className="text-gray-600 mt-1">{p.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-lg font-bold">
                  {currency}
                  {p.price}
                </div>
                <button
                  onClick={() => addToCart(p._id, "standard")}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
