import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import Title from "../common/Title.jsx";
import { assets } from "../../assets/frontend_assets/assets.js";
import CartTotal from "../common/CartTotal";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const { products, currency, cartItems, updateQuantity } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const temp = [];

      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          const qty = cartItems[productId][size];
          if (qty > 0) {
            temp.push({ _id: productId, size, quantity: qty });
          }
        }
      }

      setCartData(temp);
    }
  }, [cartItems, products]);

  /* 🛍 EMPTY CART */
  if (cartData.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
          alt="empty cart"
          className="w-40 mb-6 opacity-80"
        />
        <h2 className="text-xl font-semibold text-gray-800">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mt-2">
          Looks like you haven’t added anything yet
        </p>
        <button
          onClick={() => navigate("/products")}
          className="mt-6 bg-black text-white px-6 py-3 rounded-lg text-sm hover:bg-gray-800 transition"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-16 px-4 sm:px-10">
      <div className="text-2xl font-semibold mb-8">
        <Title text1="YOUR" text2="CART" />
      </div>

      {/* CART ITEMS */}
      <div className="space-y-4">
        {cartData.map((item, index) => {
          const product = products.find((p) => p._id === item._id);
          if (!product) return null;

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-4 sm:p-6 flex items-center justify-between transition-all duration-300"
            >
              {/* PRODUCT */}
              <div className="flex items-center gap-4">
                <img
                  src={product.imageUrl?.[0]}
                  alt={product.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
                />

                <div>
                  <p className="font-semibold text-gray-800">
                    {product.name}
                  </p>
                  <div className="flex gap-3 text-sm text-gray-500 mt-1">
                    <span>
                      {currency}
                      {product.price}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded">
                      {item.size}
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-4">
                {/* QUANTITY BUTTONS */}
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item._id,
                        item.size,
                        Math.max(1, item.quantity - 1)
                      )
                    }
                    className="px-3 py-1 text-lg hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="px-4 text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item._id, item.size, item.quantity + 1)
                    }
                    className="px-3 py-1 text-lg hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                {/* REMOVE */}
                <img
                  onClick={() =>
                    updateQuantity(item._id, item.size, 0)
                  }
                  src={assets.bin_icon}
                  alt="remove"
                  className="w-4 cursor-pointer opacity-60 hover:opacity-100 transition"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* TOTAL */}
      <div className="flex justify-end mt-16">
        <div className="w-full sm:w-[420px] md:sticky md:top-28">
          <div className="bg-white rounded-xl shadow-md p-6">
            <CartTotal />
            <button
              onClick={() => navigate("/place-order")}
              className="w-full bg-black text-white py-3 mt-6 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
