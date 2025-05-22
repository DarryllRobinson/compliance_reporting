import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../../context/AuthContext";
import Fallback from "../common/Fallback";

const ProtectedRoute = ({ requiredRoles = [] }) => {
  const { isSignedIn, user } = useAuthContext();

  if (user === undefined) return <Fallback />;

  if (!isSignedIn) {
    return <Navigate to="/user/login" replace />;
  }

  if (requiredRoles.length && !requiredRoles.includes(user?.role)) {
    return <Navigate to="/unauthorised" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
