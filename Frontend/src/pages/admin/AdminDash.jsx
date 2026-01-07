import { useAuth } from "../../Context/AuthContext.jsx";

export default function AdminDash() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "20px" }}>
      <h1>👑 Admin Dashboard</h1>
      <p>Welcome, {user.name}</p>

      <hr />

      <ul>
        <li>📦 Manage Products</li>
        <li>👥 Manage Users</li>
        <li>🚚 Assign Delivery Agents</li>
        <li>📊 View Orders & Analytics</li>
      </ul>

      <button onClick={logout}>Logout</button>
    </div>
  );
}
