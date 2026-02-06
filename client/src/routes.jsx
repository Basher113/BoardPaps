import ProjectBoard from "./pages/board/Board"
import Root from "./pages/root/Root"
import AuthLayout from "./pages/auth/AuthLayout"
import SignIn from "./pages/auth/SignIn"
import SignUp from "./pages/auth/SignUp"
import LandingPage from "./pages/landing-page/LandingPage"
import Projects from "./pages/projects/Projects"


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
        element: <Projects />
      },
      {
        path: "project/:projectId",
        element: <ProjectBoard />
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
