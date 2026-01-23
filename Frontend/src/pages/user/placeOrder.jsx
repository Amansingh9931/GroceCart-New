import React, { useState, useContext, useEffect } from "react";
import Title from "../common/Title.jsx";
import CartTotal from "../common/CartTotal";
import { assets } from "../../assets/frontend_assets/assets.js";
import { toast } from "react-toastify";
import { ShopContext } from "../../Context/ShopContext.jsx";
import { useAuth } from "../../Context/AuthContext.jsx";
import axios from "axios";
import { CheckCircle, Plus, Check } from "lucide-react";

const PlaceOrder = () => {
  const {
    token,
    backend_URL,
    cartItems,
    products,
    navigate,
    setCartItems,
    delivery_fee,
    getCartAmount,
  } = useContext(ShopContext);

  const { user } = useAuth();

  const [method, setMethod] = useState("cod");
  const [placing, setPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);

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
    mapDetails: {
      latitude: "",
      longitude: "",
      landmark: "",
      instructions: "",
    },
  });

  // PRE-FILL FORM WITH USER DATA ON MOUNT
  useEffect(() => {
    if (user) {
      // Split name into firstName and lastName
      const nameParts = (user.name || "").split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setFormData((prev) => ({
        ...prev,
        firstName,
        lastName,
        email: user.email || "",
        phone: user.mobile || "",
        street: user.address || "",
      }));

      // If phone or address is missing, redirect to edit profile
      if (!user.mobile || !user.address) {
        toast.info("Please complete your profile before placing an order");
        setTimeout(() => {
          navigate("/profile/edit?redirect=/place-order");
        }, 2000);
      }
    }
  }, [user, navigate]);

  // FETCH ADDRESSES FROM DATABASE
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get(`${backend_URL}/api/address/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setAddresses(res.data.addresses || []);
          // Set first address as default if available
          if (res.data.addresses.length > 0) {
            const defaultAddr = res.data.addresses.find((a) => a.isDefault) || res.data.addresses[0];
            setSelectedAddressId(defaultAddr._id);
          }
        }
      } catch (err) {
        console.error("Error fetching addresses:", err);
      } finally {
        setLoadingAddresses(false);
      }
    };

    if (token) {
      fetchAddresses();
    }
  }, [token, backend_URL]);

  const onChangeHandler = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  // HANDLE MAP DETAILS CHANGE
  const onMapDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      mapDetails: {
        ...p.mapDetails,
        [name]: value,
      },
    }));
  };

  // SAVE ADDRESS OR USE EXISTING
  const saveAndPlaceOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);

    try {
      let addressId = selectedAddressId;

      // If user created a new address, save it first
      if (showAddressForm) {
        const addressRes = await axios.post(
          `${backend_URL}/api/address/add`,
          { ...formData, isDefault: addresses.length === 0 },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!addressRes.data.success) {
          toast.error("Failed to save address");
          setPlacing(false);
          return;
        }

        addressId = addressRes.data.address._id;
      }

      if (!addressId) {
        toast.error("Please select or add an address");
        setPlacing(false);
        return;
      }

      let orderItems = [];

      for (const pid in cartItems) {
        for (const size in cartItems[pid]) {
          if (cartItems[pid][size] > 0) {
            const product = products.find((p) => p._id === pid);
            if (product) {
              orderItems.push({
                ...product,
                size,
                quantity: cartItems[pid][size],
              });
            }
          }
        }
      }

      const orderData = {
        addressId,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      const res = await axios.post(
        `${backend_URL}/api/order/place`,
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setCartItems({});
        setOrderInfo({
          orderId: res.data.orderId,
          eta: "9–15 mins",
        });
        setOrderSuccess(true);
        toast.success("Order placed successfully 🎉");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  /* ----------------------------------------
     BLINKIT-STYLE ORDER SUCCESS SCREEN
  ---------------------------------------- */
  if (orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center animate-fadeIn">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />

          <h2 className="text-2xl font-semibold mb-2">
            Order Confirmed 🎉
          </h2>

          <p className="text-gray-600 text-sm mb-6">
            Your groceries are being packed and will reach you shortly.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 text-left text-sm space-y-2">
            <p>
              <span className="text-gray-500">Order ID:</span>{" "}
              <span className="font-semibold">{orderInfo.orderId}</span>
            </p>
            <p>
              <span className="text-gray-500">Delivery ETA:</span>{" "}
              <span className="font-semibold">{orderInfo.eta}</span>
            </p>
            <p>
              <span className="text-gray-500">Payment:</span>{" "}
              <span className="font-semibold uppercase">{method}</span>
            </p>
          </div>

          <button
            onClick={() => navigate("/orders")}
            className="mt-6 w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
          >
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  /* ----------------------------------------
     PLACING ORDER LOADER
  ---------------------------------------- */
  if (placing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">
            Placing your order…
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Please don’t refresh
          </p>
        </div>
      </div>
    );
  }

  /* ----------------------------------------
     NORMAL PLACE ORDER FORM
  ---------------------------------------- */
  return (
    <form
      onSubmit={saveAndPlaceOrder}
      className="w-full min-h-screen px-6 md:px-16 py-16 grid grid-cols-1 md:grid-cols-2 gap-12"
    >
      {/* LEFT */}
      <div>
        <h2 className="text-2xl font-semibold mb-8">
          SELECT ADDRESS
        </h2>

        {loadingAddresses ? (
          <p className="text-gray-500">Loading saved addresses...</p>
        ) : addresses.length === 0 ? (
          <p className="text-gray-500 mb-4">No saved addresses. Create a new one.</p>
        ) : (
          <div className="space-y-3 mb-6">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                onClick={() => {
                  setSelectedAddressId(addr._id);
                  setShowAddressForm(false);
                }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                  selectedAddressId === addr._id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                    selectedAddressId === addr._id ? "border-green-500 bg-green-500" : "border-gray-300"
                  }`}>
                    {selectedAddressId === addr._id && <Check size={14} className="text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {addr.firstName} {addr.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {addr.street}, {addr.city}
                    </p>
                    <p className="text-sm text-gray-600">
                      {addr.state} {addr.zipcode}, {addr.country}
                    </p>
                    <p className="text-sm text-gray-600">📱 {addr.phone}</p>
                    
                    {/* MAP DETAILS IF AVAILABLE */}
                    {addr.mapDetails && (addr.mapDetails.latitude || addr.mapDetails.landmark) && (
                      <div className="text-xs text-gray-500 mt-2 space-y-1">
                        {addr.mapDetails.landmark && (
                          <p>📍 {addr.mapDetails.landmark}</p>
                        )}
                        {addr.mapDetails.latitude && addr.mapDetails.longitude && (
                          <p>🗺️ {addr.mapDetails.latitude}, {addr.mapDetails.longitude}</p>
                        )}
                        {addr.mapDetails.instructions && (
                          <p>📝 {addr.mapDetails.instructions}</p>
                        )}
                      </div>
                    )}
                    
                    {addr.isDefault && (
                      <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Default Address
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ADD NEW ADDRESS */}
        <button
          type="button"
          onClick={() => setShowAddressForm(!showAddressForm)}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-6 border-2 border-green-600 w-full py-2 rounded-lg justify-center transition hover:bg-green-50"
        >
          <Plus size={18} />
          {showAddressForm ? "Cancel" : "Add New Address"}
        </button>

        {/* ADDRESS FORM */}
        {showAddressForm && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            {/* BASIC ADDRESS */}
            <div className="grid grid-cols-2 gap-4">
              <input required name="firstName" value={formData.firstName} onChange={onChangeHandler} className="input" placeholder="First name" />
              <input required name="lastName" value={formData.lastName} onChange={onChangeHandler} className="input" placeholder="Last name" />
            </div>

            <input required name="email" value={formData.email} onChange={onChangeHandler} className="input w-full" placeholder="Email" />
            <input required name="street" value={formData.street} onChange={onChangeHandler} className="input w-full" placeholder="Street" />

            <div className="grid grid-cols-2 gap-4">
              <input required name="city" value={formData.city} onChange={onChangeHandler} className="input" placeholder="City" />
              <input required name="state" value={formData.state} onChange={onChangeHandler} className="input" placeholder="State" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input required name="zipcode" value={formData.zipcode} onChange={onChangeHandler} className="input" placeholder="Zipcode" />
              <input required name="country" value={formData.country} onChange={onChangeHandler} className="input" placeholder="Country" />
            </div>

            <input required name="phone" value={formData.phone} onChange={onChangeHandler} className="input w-full" placeholder="Phone" />

            {/* MAP DETAILS SECTION */}
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">📍 Map Details (Optional)</p>
              
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  step="0.000001"
                  name="latitude" 
                  value={formData.mapDetails.latitude} 
                  onChange={onMapDetailsChange} 
                  className="input" 
                  placeholder="Latitude" 
                />
                <input 
                  type="number" 
                  step="0.000001"
                  name="longitude" 
                  value={formData.mapDetails.longitude} 
                  onChange={onMapDetailsChange} 
                  className="input" 
                  placeholder="Longitude" 
                />
              </div>

              <input 
                name="landmark" 
                value={formData.mapDetails.landmark} 
                onChange={onMapDetailsChange} 
                className="input w-full mt-3" 
                placeholder="Nearby landmark (e.g., Near Big Tree, Blue Gate)" 
              />

              <textarea 
                name="instructions" 
                value={formData.mapDetails.instructions} 
                onChange={onMapDetailsChange} 
                className="input w-full mt-3 resize-none" 
                rows="2"
                placeholder="Special delivery instructions (e.g., Ring bell twice, Door code 1234)" 
              />
            </div>
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div>
        <CartTotal />

        <div className="mt-10">
          <Title text1="PAYMENT" text2="METHOD" />
          <div
            onClick={() => setMethod("cod")}
            className="border rounded-lg p-3 mt-4 cursor-pointer flex items-center gap-3"
          >
            <div className={`w-4 h-4 rounded-full border ${method === "cod" && "bg-green-500"}`} />
            <p className="text-sm font-medium">Cash on Delivery</p>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl mt-8 hover:bg-gray-800 transition"
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
