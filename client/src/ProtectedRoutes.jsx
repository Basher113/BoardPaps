import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isLoaded, userId } = useAuth();
  
  if (!isLoaded) {
    return null; // or loading spinner
  }
  
  if (!userId) {
    return <Navigate to="/auth/sign-in" replace />;
  }
  
  return children;
};

export default ProtectedRoute;