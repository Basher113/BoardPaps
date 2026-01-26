import { Wrapper } from "./root.styles"
import { Outlet } from "react-router-dom"

import LandingPage from "./components/LandingPage"

const Root = () => {
  return (
    <Wrapper>
      <LandingPage />
    </Wrapper>
  )
}

export default Root