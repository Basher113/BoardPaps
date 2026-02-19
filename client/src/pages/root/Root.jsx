import { useAuth } from "@clerk/clerk-react";
import { Outlet, useLocation, Navigate } from "react-router-dom"
import Sidebar from "../../components/sidebar/Sidebar"
import { useGetCurrentUserQuery } from "../../reducers/slices/user/user.slice"
import { useSelector } from "react-redux"
import { selectActiveView } from "../../reducers/slices/navigation/navigation.selector"
import LandingPage from "../landing-page/LandingPage"

import {Wrapper, OutletWrapper} from "./root.styles";

const Root = () => {
  const activeView = useSelector(selectActiveView);
  const { userId, isLoaded, isSignedIn } = useAuth();
  const location = useLocation();
  
  // Use Clerk's userId for quick check
  const { data: currentUser, isLoading } = useGetCurrentUserQuery(undefined, {
    skip: !userId,
  });

  // Wait for Clerk to load
  if (!isLoaded) {
    return null;
  }
  
  // If not signed in, only show landing page for the root path
  // For other paths (like /invitations), let the Outlet render so ProtectedRoute can handle redirect
  if (!isSignedIn) {
    if (location.pathname === "/") {
      return <LandingPage />;
    }
    // For protected routes, just render the Outlet (ProtectedRoute will handle redirect)
    return <Outlet />;
  }
  
  // If signed in and on root path, redirect to dashboard
  if (location.pathname === "/") {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Show loading while fetching user data (only for signed in users)
  if (isLoading && isSignedIn) {
    return null;
  }
  return (
    <Wrapper>
      <Sidebar 
        currentUser={currentUser}
        activeView={activeView}
      />
      <OutletWrapper>
        <Outlet />
      </OutletWrapper>
      
    </Wrapper>
  )
}

export default Root
