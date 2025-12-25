import { useAuth } from "../../context/AuthContext";

export default function DeliveryDash() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "20px" }}>
      <h1>🚚 Delivery Dashboard</h1>
      <p>Hello, {user.name}</p>

      <hr />

      <ul>
        <li>📍 View Assigned Orders</li>
        <li>✅ Update Delivery Status</li>
        <li>🕒 Delivery History</li>
      </ul>

      <button onClick={logout}>Logout</button>
    </div>
  );
}
