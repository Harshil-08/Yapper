import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const ProtectedRoute = () => {
  const { user, loading } = useUser();
  if (loading) return null; 
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
