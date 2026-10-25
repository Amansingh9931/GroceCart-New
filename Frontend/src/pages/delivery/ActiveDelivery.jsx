import React, { useCallback, useContext, useEffect, useState } from "react";
import { ShopContext } from "../../Context/ShopContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPhoneAlt, FaTruck, FaCheckCircle } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { socket } from "../../utils/socket.js";
import { useNavigate } from "react-router-dom";

const GEO_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapViewport({ deliveryPos, destination }) {
  const map = useMap();

  useEffect(() => {
    if (deliveryPos && destination) {
      map.fitBounds([deliveryPos, destination], {
        padding: [40, 40],
        maxZoom: 15,
      });
    }
  }, [deliveryPos, destination, map]);

  return null;
}

export default function ActiveDelivery() {
  const { backend_URL, token } = useContext(ShopContext);
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryStep, setDeliveryStep] = useState("accepted");

  const [deliveryPos, setDeliveryPos] = useState(null);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState("");
  const [eta, setEta] = useState("");
  const [locationError, setLocationError] = useState("");
  const [routeError, setRouteError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchActiveDelivery = useCallback(async () => {
    try {
      const res = await axios.get(
        `${backend_URL}/api/delivery/active-delivery`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success && res.data.order) {
        setOrder(res.data.order);

        const status = res.data.order.status;
        if (status === "Out for Delivery") setDeliveryStep("out-for-delivery");
        else if (status === "Delivered") setDeliveryStep("delivered");
        else setDeliveryStep("accepted");
      }
    } catch {
      toast.error("Failed to load delivery");
    } finally {
      setLoading(false);
    }
  }, [backend_URL, token]);

  // ================= FETCH ORDER =================
  useEffect(() => {
    fetchActiveDelivery();
  }, [fetchActiveDelivery]);

  const fetchRoute = useCallback(async (lat, lng) => {
    const userLat = order?.addressId?.mapDetails?.latitude;
    const userLng = order?.addressId?.mapDetails?.longitude;
    if (!Number.isFinite(Number(userLat)) || !Number.isFinite(Number(userLng))) return;
    if (!GEO_KEY) {
      setRoute([]);
      setDistance("");
      setEta("");
      setRouteError("Routing is not configured. Set VITE_GEOAPIFY_KEY in Frontend/.env and restart the frontend.");
      return;
    }

    try {
      const res = await fetch(
        `https://api.geoapify.com/v1/routing?waypoints=${lat},${lng}|${Number(userLat)},${Number(userLng)}&mode=drive&apiKey=${GEO_KEY}`
      );
      if (res.status === 401 || res.status === 403) {
        throw new Error(`Geoapify rejected the API key (${res.status})`);
      }
      if (!res.ok) throw new Error(`Route request failed (${res.status})`);

      const data = await res.json();
      const feature = data.features?.[0];
      const coordinates = feature?.geometry?.coordinates;
      if (!Array.isArray(coordinates) || coordinates.length === 0) {
        throw new Error("The routing service returned no route");
      }

      const lineCoordinates = Array.isArray(coordinates[0]?.[0])
        ? coordinates[0]
        : coordinates;
      const coords = lineCoordinates
        .filter((coordinate) =>
          Array.isArray(coordinate) &&
          Number.isFinite(coordinate[0]) &&
          Number.isFinite(coordinate[1])
        )
        .map(([longitude, latitude]) => [latitude, longitude]);

      if (coords.length === 0) throw new Error("The route contains no valid coordinates");
      if (!Number.isFinite(feature.properties?.distance) || !Number.isFinite(feature.properties?.time)) {
        throw new Error("The routing service returned incomplete route details");
      }

      setRoute(coords);
      setDistance((feature.properties.distance / 1000).toFixed(2));
      setEta(Math.round(feature.properties.time / 60) + " mins");
      setRouteError("");
    } catch (err) {
      setRoute([]);
      setDistance("");
      setEta("");
      if (err.message.includes("rejected the API key")) {
        setRouteError("Geoapify rejected the API key. Check that the key is active, has Routing API access, and allows this site's domain.");
      } else {
        console.error("Route error", err);
        setRouteError("Unable to load the route. Check your network connection and Geoapify configuration, then try again.");
      }
    }
  }, [order]);

  // ================= SOCKET TRACKING =================
  useEffect(() => {
    if (!order?._id || deliveryStep !== "out-for-delivery") return;
    if (!navigator.geolocation) {
      const message = "Location is not supported by this browser.";
      setLocationError(message);
      toast.error(message);
      return;
    }

    socket.emit("joinOrderRoom", order._id);

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const currentPos = [pos.coords.latitude, pos.coords.longitude];
        setDeliveryPos(currentPos);
        setLocationError("");
        fetchRoute(currentPos[0], currentPos[1]);
        socket.emit("deliveryLocation", {
          orderId: order._id,
          lat: currentPos[0],
          lng: currentPos[1],
        });
      },
      (error) => {
        const message = error.code === error.PERMISSION_DENIED
          ? "Location permission is blocked. Allow location access in your browser settings."
          : error.code === error.POSITION_UNAVAILABLE
            ? "Your current location is unavailable. Check your device's location settings."
            : "Unable to get your location. Please try again.";
        setLocationError(message);
        toast.error(message);
      },
      { enableHighAccuracy: true }
    );

    socket.on("trackingStopped", () => {
      navigator.geolocation.clearWatch(watchId);
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
      socket.emit("stopTracking", order._id);
      socket.off("trackingStopped");
    };
  }, [order, deliveryStep, fetchRoute]);

  // ================= ACTIONS =================
  const handleMarkOutForDelivery = async () => {
    try {
      setActionLoading(true);
      const res = await axios.post(
        `${backend_URL}/api/delivery/mark-out-for-delivery`,
        { orderId: order._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setDeliveryStep("out-for-delivery");
        setOrder({ ...order, status: "Out for Delivery" });
        toast.success("Out for delivery 🚚");
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkDelivered = async () => {
    try {
      setActionLoading(true);
      const res = await axios.post(
        `${backend_URL}/api/delivery/mark-delivered`,
        { orderId: order._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        socket.emit("stopTracking", order._id);
        setDeliveryStep("delivered");
        toast.success("Order Delivered 🎉");

        // ✅ Redirect to Available Orders
        setTimeout(() => {
          navigate("/delivery/available");
        }, 1500);
      }
    } catch {
      toast.error("Failed to mark delivered");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );

  if (!order)
    return (
      <div className="min-h-screen flex justify-center items-center">
        No Active Delivery
      </div>
    );

  const userLat = order.addressId?.mapDetails?.latitude;
  const userLng = order.addressId?.mapDetails?.longitude;
  const destination = Number.isFinite(Number(userLat)) && Number.isFinite(Number(userLng))
    ? [Number(userLat), Number(userLng)]
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow p-6 flex justify-between">
          <div>
            <h2 className="text-2xl font-bold">🚚 Active Delivery</h2>
            <p className="text-gray-500">Order ID: {order._id}</p>
          </div>
          <span className="px-4 py-2 rounded-full bg-indigo-600 text-white">
            {order.status}
          </span>
        </div>

        {/* MAP */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-2">📍 Live Route</h3>

          {destination ? (
            <MapContainer
              center={deliveryPos || destination}
              zoom={14}
              style={{ height: "350px", borderRadius: "12px" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapViewport deliveryPos={deliveryPos} destination={destination} />
              {deliveryPos && <Marker position={deliveryPos} icon={markerIcon} />}
              <Marker position={destination} icon={markerIcon} />
              {route.length > 0 && <Polyline positions={route} />}
            </MapContainer>
          ) : (
            <p className="text-center text-gray-500">Location not available</p>
          )}

          {distance && eta && (
            <div className="flex justify-between mt-3 font-semibold">
              <p>📏 Distance: {distance} km</p>
              <p>⏱ ETA: {eta}</p>
            </div>
          )}
          {deliveryStep === "out-for-delivery" && !deliveryPos && !locationError && (
            <p className="mt-3 text-center text-sm text-gray-500">
              Waiting for GPS location. Allow location access when prompted.
            </p>
          )}
          {locationError && (
            <p className="mt-3 text-center text-sm text-red-600">{locationError}</p>
          )}
          {routeError && (
            <p className="mt-3 text-center text-sm text-red-600">{routeError}</p>
          )}
        </div>

        {/* INFO */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-3">👤 Customer</h3>
            <p className="font-bold">{order.user?.name}</p>
            <p>{order.addressId?.street}</p>
            <p>{order.addressId?.city}, {order.addressId?.state}</p>
            <a href={`tel:${order.addressId?.phone}`} className="text-green-600 flex gap-2 mt-2">
              <FaPhoneAlt /> {order.addressId?.phone}
            </a>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-3">🛒 Items</h3>
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 border-b py-2">
                <img
                  src={item.image || item.images?.[0]}
                  className="w-14 h-14 object-contain rounded"
                />
                <div className="flex-1">
                  <p className="font-semibold">{item.productName || item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold">₹{item.price}</p>
              </div>
            ))}

            <div className="flex justify-between font-bold mt-3">
              <span>Total:</span>
              <span>₹{order.amount}</span>
            </div>
          </div>
        </div>

        {/* ACTION */}
        <div className="bg-white rounded-xl shadow p-6 flex gap-4">
          {deliveryStep === "accepted" && (
            <button
              onClick={handleMarkOutForDelivery}
              disabled={actionLoading}
              className="flex-1 bg-orange-500 text-white py-3 rounded-lg"
            >
              <FaTruck className="inline mr-2" /> Out for Delivery
            </button>
          )}

          {deliveryStep === "out-for-delivery" && (
            <button
              onClick={handleMarkDelivered}
              disabled={actionLoading}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg"
            >
              <FaCheckCircle className="inline mr-2" /> Mark Delivered
            </button>
          )}

          {deliveryStep === "delivered" && (
            <div className="flex-1 bg-green-100 text-green-700 py-3 rounded-lg text-center font-bold">
              ✅ Delivered Successfully
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
