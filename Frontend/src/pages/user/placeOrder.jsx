import React, { useState } from "react";
import Title from "../common/Title.jsx";
import CartTotal from "../common/CartTotal";
import { assets } from "../../assets/frontend_assets/assets.js";
import { toast } from "react-toastify";
import { useContext } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import axios from "axios";

const PlaceOrder = () => {
  const {
    token,
    backend_URL,
    cartItems,
    products,
    navigate,
    setCartItems,
    getCartItems,
    delivery_fee,
    getCartAmount,
  } = useContext(ShopContext);
  const [method, setMethod] = useState("cod");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        // API calls for cod
        case "cod":
          const response = await axios.post(
            backend_URL + "/api/order/place",
            orderData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log(response.data);
          if (response.data.success) {
            setCartItems({});
            navigate("/orders");
          } else toast.error(response.data.message);
          break;
        default:
          break;
      }
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="w-full min-h-screen px-6 md:px-16 py-16 grid grid-cols-1 md:grid-cols-2 gap-12"
    >
      {/* LEFT - Delivery Info */}
      <div>
        <h2 className="text-2xl font-semibold tracking-wide mb-8">
          DELIVERY <span className="text-gray-700">INFORMATION</span>
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            required
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            className="border rounded-lg p-3"
            placeholder="First name"
          />
          <input
            required
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            className="border rounded-lg p-3"
            placeholder="Last name"
          />
        </div>

        <input
          required
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          className="border rounded-lg p-3 w-full mt-4"
          type="email"
          placeholder="Email address"
        />
        <input
          required
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          className="border rounded-lg p-3 w-full mt-4"
          placeholder="Street"
        />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <input
            required
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            className="border rounded-lg p-3"
            placeholder="City"
          />
          <input
            required
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            className="border rounded-lg p-3"
            placeholder="State"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <input
            required
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            className="border rounded-lg p-3"
            placeholder="Zipcode"
          />
          <input
            required
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            className="border rounded-lg p-3"
            placeholder="Country"
          />
        </div>

        <input
          required
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          className="border rounded-lg p-3 w-full mt-4"
          placeholder="Phone"
        />
      </div>

      {/* RIGHT - Cart Total + Payment */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          {/* PAYMENT METHODS SELECTION */}
          <div className="flex gap-3 flex-col lg:flex-row">
            {/* STRIPE */}
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-500" : ""
                }`}
              ></p>
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="Stripe" />
            </div>

            {/* RAZORPAY */}
            <div
              onClick={() => setMethod("razorpay")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "razorpay" ? "bg-green-500" : ""
                }`}
              ></p>
              <img
                className="h-5 mx-4"
                src={assets.razorpay_logo}
                alt="Razorpay"
              />
            </div>

            {/* COD */}
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-500" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          {/* <div className="w-full text-end mt-8">
            
            <button
              type="submit"
              onClick={() => navigate("/orders")}
              className=" bg-black text-white text-sm py-3 rounded-lg mt-10 hover:bg-gray-800 transition"
            >
              PLACE ORDER
            </button>
          </div> */}
          <button
            type="submit"
            onClick={() => navigate("/orders")}
            className="w-full bg-black text-white text-sm py-3 rounded-lg mt-10 hover:bg-gray-800 transition"
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
