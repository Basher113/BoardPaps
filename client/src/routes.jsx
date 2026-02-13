import ProjectBoard from "./pages/board/Board"
import ProjectSettings from "./pages/project-settings/ProjectSettings"
import Root from "./pages/root/Root"
import AuthLayout from "./pages/auth/AuthLayout"
import SignIn from "./pages/auth/SignIn"
import SignUp from "./pages/auth/SignUp"
import LandingPage from "./pages/landing-page/LandingPage"
import Dashboard from "./pages/dashboard/Dashboard"
import Projects from "./pages/projects/Projects"
import InvitationsPage from "./pages/invitations/Invitations"
import Settings from "./pages/settings/Settings"


export const routes = [
   {
    path: "/",
    element: <LandingPage />,
    
   },
   {
    path: "app",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: "projects",
        element: <Projects />
      },
      {
        path: "project/:projectId",
        element: <ProjectBoard />
      },
      {
        path: "project/:projectId/settings",
        element: <ProjectSettings />
      },
      {
        path: "invitations",
        element: <InvitationsPage />
      },
      {
        path: "settings",
        element: <Settings />
      }
    ]
   },
  
   {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "sign-in",
        element: <SignIn />
      },
      {
        path: "sign-up",
        element: <SignUp />
      }
    ]
   },
]
