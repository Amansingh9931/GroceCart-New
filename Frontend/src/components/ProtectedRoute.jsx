import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return null; // or spinner

  const location = useLocation();

  if (!user)
    return (
      <Navigate to="/signin" replace state={{ from: location }} />
    );

  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
