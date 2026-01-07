import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import LayoutAdmin from "./pages/admin/LayoutAdmin.jsx";
import LayoutDelivery from "./pages/delivery/LayoutDelivery.jsx";
import LayoutUser from "./pages/user/LayoutUser.jsx";
import AdminDash from "./pages/admin/AdminDash.jsx";
import DeliveryDash from "./pages/delivery/DeliveryDash.jsx";
import UserDash from "./pages/user/UserDash.jsx";
import Profile from "./pages/common/Profile.jsx";
import EditProfile from "./pages/common/EditProfile.jsx";
import Navbar from "./pages/common/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Login />} />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <LayoutAdmin />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDash />} />
        </Route>

        {/* USER */}
        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <LayoutUser />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDash />} />
        </Route>

        {/* DELIVERY */}
        <Route
          path="/delivery"
          element={
            <ProtectedRoute role="deliveryBoy">
              <LayoutDelivery />
            </ProtectedRoute>
          }
        >
          <Route index element={<DeliveryDash />} />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </>
  );
}

export default App;
