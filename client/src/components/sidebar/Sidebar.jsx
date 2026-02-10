import React, { useState } from 'react';
import { LayoutDashboard, Settings, Users, ChevronLeft, ChevronRight, Target, MoreHorizontal, FolderKanban, LogOut, Mail, Bell } from 'lucide-react';
import {
  SidebarContainer,
  SidebarHeader,
  ProjectInfo,
  LogoContainer,
  ProjectDetails,
  AppName,

  CollapseButton,
  SidebarNav,
  NavList,
  NavItem,
  NavButton,
  SidebarFooter,
  UserProfileButton,
  UserInfo,
  Username,
  UserEmail,
  UserMenuDropdown,
  UserMenuHeader,
  UserMenuLabel,
  UserMenuCurrentUser,
  UserMenuCurrentEmail,
  UserMenuList,
  UserMenuSectionTitle,
  UserMenuLogout,
  MenuBackdrop,

  // Project Navigation Styles
  ProjectSection,
  ProjectSectionHeader,
  ProjectSectionTitle,
  ProjectList,
  EmptyProjects,

  // Invitation Badge Styles
  InvitationBadge,
  InvitationNavItem,
  InvitationBadgeDot,
} from './Sidebar.styles';
import UserAvatar from '../ui/user-avatar/UserAvatar';
import { useGetMyProjectsQuery, } from '../../reducers/slices/project/project.apiSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch,  } from 'react-redux';
import ProjectItem from './ProjectItem';
import icon from "../../assets/bp_icon.webp"
import { apiSlice } from '../../reducers/apiSlice';
import { useLogoutUserMutation } from '../../reducers/slices/user/user.slice';
import { useGetMyInvitationsCountQuery } from '../../reducers/slices/invitation/invitation.apiSlice';

const Sidebar = ({ collapsed, setCollapsed, activeView, setActiveView, currentUser }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  
  const { data: projects = [], isLoading: projectsLoading } = useGetMyProjectsQuery();
  const { data: invitationsCountData } = useGetMyInvitationsCountQuery();
  const [logoutUser] = useLogoutUserMutation();
  
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const invitationsCount = invitationsCountData?.data?.count || 0;
  console.log(currentUser)
  

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(apiSlice.util.resetApiState());
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  const handleInvitationsClick = () => {
    navigate('/app/invitations');
  };
  
  const handleDashboardClick = () => {
    navigate('/app');
  };
  
  const handleProjectsClick = () => {
    navigate('/app/projects');
  };
  
  return (
    <SidebarContainer collapsed={collapsed}>
      <SidebarHeader>
        
        {!collapsed && (
           
           <LogoContainer>
             <img src={icon} height="40" weight="40"/>
             
             <ProjectInfo>
               <ProjectDetails>
                 <AppName>BoardPaps</AppName>
               </ProjectDetails>
             </ProjectInfo>
           </LogoContainer>
           
         )}
        <CollapseButton collapsed={collapsed} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </CollapseButton>
      </SidebarHeader>
      
      <SidebarNav>
        <NavList>
          <NavItem>
            <InvitationNavItem
              onClick={handleInvitationsClick}
            >
              <Bell size={20} />
              {!collapsed && <span>Invitations</span>}
              {invitationsCount > 0 && (
                <InvitationBadge>{invitationsCount}</InvitationBadge>
              )}
            </InvitationNavItem>
          </NavItem>
          
          {menuItems.map(item => (
            <NavItem key={item.id}>
              <NavButton
                active={activeView === item.id}
                onClick={item.id === 'dashboard' ? handleDashboardClick : () => setActiveView(item.id)}
              >
                <item.icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </NavButton>
            </NavItem>
          ))}

          <ProjectSection>
            <ProjectSectionHeader onClick={handleProjectsClick}>
              <FolderKanban size={20}/> 
              {!collapsed ? <ProjectSectionTitle>All Projects</ProjectSectionTitle> : undefined} 
            </ProjectSectionHeader>
            
            {projectsLoading ? (
              <EmptyProjects>Loading...</EmptyProjects>
            ) : projects.length === 0 ? (
              <EmptyProjects>No projects yet</EmptyProjects>
            ) : (
              <ProjectList>
                {projects.map((project) => {
                   
                  return (
                    <ProjectItem
                      key={project.id}
                      project={project}
                    />
                  );
                })}
              </ProjectList>
            )}
          </ProjectSection>
        </NavList>
      
      </SidebarNav>
      
      <SidebarFooter>
        {!collapsed ? (
          <div style={{ position: 'relative' }}>
            <UserProfileButton onClick={() => setShowUserMenu(!showUserMenu)}>
              <UserAvatar userId={currentUser.id} size="md" />
              <UserInfo>
                <Username>{currentUser.username}</Username>
                <UserEmail>{currentUser.email}</UserEmail>
              </UserInfo>
              <MoreHorizontal size={16} style={{ color: '#9ca3af' }} />
            </UserProfileButton>
            {showUserMenu && (
              <>
                <MenuBackdrop onClick={() => setShowUserMenu(false)} />
                <UserMenuDropdown>
                  <UserMenuHeader>
                    <UserMenuLabel>Current User</UserMenuLabel>
                    <UserMenuCurrentUser>{currentUser.fullName}</UserMenuCurrentUser>
                    <UserMenuCurrentEmail>{currentUser.email}</UserMenuCurrentEmail>
                  </UserMenuHeader>
                  <UserMenuList>
                    <UserMenuSectionTitle>Actions</UserMenuSectionTitle>
                    <UserMenuLogout onClick={handleInvitationsClick}>
                      <Bell size={16} />
                      View Invitations ({invitationsCount})
                    </UserMenuLogout>
                  </UserMenuList>
                  <UserMenuList>
                    <UserMenuLogout onClick={handleLogout}>
                      <LogOut size={16} />
                      Log out
                    </UserMenuLogout>
                  </UserMenuList>
                </UserMenuDropdown>
              </>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <UserProfileButton onClick={() => setShowUserMenu(!showUserMenu)} style={{ width: 'auto' }}>
              <UserAvatar userId={currentUser.id} size="md" />
              {invitationsCount > 0 && (
                <InvitationBadgeDot />
              )}
            </UserProfileButton>
            {showUserMenu && (
              <>
                <MenuBackdrop onClick={() => setShowUserMenu(false)} />
                <UserMenuDropdown style={{ left: 'auto', right: 0, width: '16rem' }}>
                  <UserMenuHeader>
                    <UserMenuLabel>Current User</UserMenuLabel>
                    <UserMenuCurrentUser>{currentUser.fullName}</UserMenuCurrentUser>
                    <UserMenuCurrentEmail>{currentUser.email}</UserMenuCurrentEmail>
                  </UserMenuHeader>
                  <UserMenuList>
                    <UserMenuSectionTitle>Actions</UserMenuSectionTitle>
                    <UserMenuLogout onClick={handleInvitationsClick}>
                      <Bell size={16} />
                      View Invitations ({invitationsCount})
                    </UserMenuLogout>
                  </UserMenuList>
                  <UserMenuList>
                    <UserMenuLogout onClick={handleLogout}>
                      <LogOut size={16} />
                      Log out
                    </UserMenuLogout>
                  </UserMenuList>
                </UserMenuDropdown>
              </>
            )}
          </div>
        )}
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;
