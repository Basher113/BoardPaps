

import ProjectBoard from "./pages/board/Board"
import ProjectSettings from "./pages/project-settings/ProjectSettings"
import Root from "./pages/root/Root"
import SignInPage from "./pages/auth/SignIn"
import SignUpPage from "./pages/auth/SignUp"
import Dashboard from "./pages/dashboard/Dashboard"
import Projects from "./pages/projects/Projects"
import InvitationsPage from "./pages/invitations/Invitations"
import Settings from "./pages/settings/Settings"
import ProtectedRoute from "./ProtectedRoutes";
import AuthLayout from "./pages/auth/AuthLayout"

// Email verification page handled by Clerk

export const routes = [
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "sign-in/*",
        element: <SignInPage />,
      },
      {
        path: "sign-up/*",
        element: <SignUpPage />,
      },
    ],
  },
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "dashboard",
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: "projects",
        element: <ProtectedRoute><Projects /></ProtectedRoute>,
      },
      {
        path: "project/:projectId",
        element: <ProtectedRoute><ProjectBoard /></ProtectedRoute>,
      },
      {
        path: "project/:projectId/settings",
        element: <ProtectedRoute><ProjectSettings /></ProtectedRoute>,
      },
      {
        path: "invitations",
        element: <ProtectedRoute><InvitationsPage /></ProtectedRoute>,
      },
      {
        path: "settings",
        element: <ProtectedRoute><Settings /></ProtectedRoute>,
      },
    ]
  },
  
]
