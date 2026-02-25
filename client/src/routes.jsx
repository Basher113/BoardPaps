import ProjectBoard from "./pages/board/Board"
import ProjectSettings from "./pages/project-settings/ProjectSettings"
import Root from "./pages/root/Root"
import SignInPage from "./pages/auth/SignIn"
import SignUpPage from "./pages/auth/SignUp"
import Dashboard from "./pages/dashboard/Dashboard"
import Projects from "./pages/projects/Projects"
import InvitationsPage from "./pages/invitations/Invitations"
import Settings from "./pages/settings/Settings"
import Calendar from "./pages/calendar/Calendar"
import ProtectedRoute from "./ProtectedRoutes";
import AuthLayout from "./pages/auth/AuthLayout"
import RouteErrorBoundary from "./components/error-boundary/RouteErrorBoundary"
import ErrorPage from "./components/error-boundary/ErrorPage"

// Email verification page handled by Clerk

export const routes = [
  {
    path: "auth",
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
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
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <RouteErrorBoundary routeType="dashboard">
              <Dashboard />
            </RouteErrorBoundary>
          </ProtectedRoute>
        ),
      },
      {
        path: "projects",
        element: (
          <ProtectedRoute>
            <RouteErrorBoundary routeType="projects">
              <Projects />
            </RouteErrorBoundary>
          </ProtectedRoute>
        ),
      },
      {
        path: "project/:projectId",
        element: (
          <ProtectedRoute>
            <RouteErrorBoundary routeType="board">
              <ProjectBoard />
            </RouteErrorBoundary>
          </ProtectedRoute>
        ),
      },
      {
        path: "project/:projectId/settings",
        element: (
          <ProtectedRoute>
            <RouteErrorBoundary routeType="projectSettings">
              <ProjectSettings />
            </RouteErrorBoundary>
          </ProtectedRoute>
        ),
      },
      {
        path: "invitations",
        element: (
          <ProtectedRoute>
            <RouteErrorBoundary routeType="invitations">
              <InvitationsPage />
            </RouteErrorBoundary>
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <RouteErrorBoundary routeType="settings">
              <Settings />
            </RouteErrorBoundary>
          </ProtectedRoute>
        ),
      },
      {
        path: "calendar",
        element: (
          <ProtectedRoute>
            <RouteErrorBoundary routeType="calendar">
              <Calendar />
            </RouteErrorBoundary>
          </ProtectedRoute>
        ),
      },
    ]
  },
  
]

