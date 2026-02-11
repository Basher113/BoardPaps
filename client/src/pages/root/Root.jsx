import { OutletWrapper, Wrapper } from "./root.styles"
import { Outlet, useNavigate } from "react-router-dom"
import Sidebar from "../../components/sidebar/Sidebar"

import { useGetCurrentUserQuery } from "../../reducers/slices/user/user.slice"
import { useSelector } from "react-redux"
import { selectActiveView } from "../../reducers/slices/navigation/navigation.selector"

const Root = () => {
  const navigate = useNavigate();
  const activeView = useSelector(selectActiveView);
  
  const {data: currentUser, isLoading: currentUserLoading} = useGetCurrentUserQuery();

  
  if (currentUserLoading) return;
  if (!currentUser) {
    navigate("/");
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
