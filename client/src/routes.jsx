import ProjectBoard from "./pages/board/Board"
import Root from "./pages/root/Root"
import AuthLayout from "./pages/auth/AuthLayout"
import SignIn from "./pages/auth/SignIn"
import SignUp from "./pages/auth/SignUp"
import LandingPage from "./pages/landing-page/LandingPage"
import Dashboard from "./pages/dashboard/Dashboard"
import Projects from "./pages/projects/Projects"
import InvitationsPage from "./pages/invitations/Invitations"


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
        path: "invitations",
        element: <InvitationsPage />
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
