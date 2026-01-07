import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext.jsx";
import { navbarConfig } from "../../Config/navbarConfig.js";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef(null);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const menuItems = user ? navbarConfig[user.role] || [] : [];

  const handleMouseEnter = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setOpen(false);
    }, 400); // ⏱️ delay in ms (change to 300/500 if you want)
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow relative">
      {/* LOGO */}
      <Link to="/" className="text-2xl font-bold text-green-600">
        🛒 GroceCart
      </Link>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <Link to="/" className="text-sm text-gray-600 hover:text-black">
          Home
        </Link>

        {user ? (
          <>
            {/* ROLE LINKS */}
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-sm text-gray-600 hover:text-black"
              >
                {item.label}
              </Link>
            ))}

            {/* PROFILE ICON + DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="text-gray-700 hover:text-black"
              >
                <FaUserCircle size={26} />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow z-50">
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    View Profile
                  </Link>

                  <Link
                    to="/profile/edit"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Edit Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button
            onClick={() => navigate("/signin")}
            className="rounded bg-green-600 px-3 py-1 text-white"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
