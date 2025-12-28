import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { googleLogout } from "@react-oauth/google";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    googleLogout();   // 🔥 clears Google session
    logout();         // 🔥 clears app auth
    navigate("/signin");
  };

  return (
    <div className="flex justify-between p-4">
      <h2>GroceCart</h2>

      {user && (
        <div className="flex gap-3 items-center">
          <span>Hi, {user.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
