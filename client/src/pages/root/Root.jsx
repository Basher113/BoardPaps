import { Wrapper } from "./root.styles"
import { Outlet } from "react-router-dom"

import LandingPage from "./components/LandingPage"

const Root = () => {

  const signedIn = true

  return (
    <Wrapper>
      {signedIn ? (
          <Outlet />
        ) : (
          <LandingPage />
        )
      }
    </Wrapper>
  )
}

export default Root