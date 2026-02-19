import { useAuth } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isLoaded, userId } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return null; // or loading spinner
  }

  if (!userId) {
    // Redirect to sign-in while preserving the current location
    // This allows Clerk to redirect back after authentication
    const returnUrl = location.pathname + location.search;
    return <Navigate to={`/auth/sign-in?redirect_url=${encodeURIComponent(returnUrl)}`} replace />;
  }

  return children;
};

export default ProtectedRoute;