import React, { useState } from 'react';
import { LayoutDashboard, Settings, MoreHorizontal, FolderKanban, LogOut, Bell, Menu, X } from 'lucide-react';
import {
  SidebarContainer,
  SidebarHeader,
  LogoContainer,
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
  MobileToggleButton,
  MobileOverlay,

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
import { Logo } from '../ui/logo/Logo';
import { useGetMyProjectsQuery, } from '../../reducers/slices/project/project.apiSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch,  } from 'react-redux';
import ProjectItem from './ProjectItem';
import { apiSlice } from '../../reducers/apiSlice';
import { useLogoutUserMutation } from '../../reducers/slices/user/user.slice';
import { useGetMyInvitationsCountQuery } from '../../reducers/slices/invitation/invitation.apiSlice';

const Sidebar = ({ activeView, setActiveView, currentUser }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  
  const { data: projects = [], isLoading: projectsLoading } = useGetMyProjectsQuery();
  const { data: invitationsCountData } = useGetMyInvitationsCountQuery();
  const [logoutUser] = useLogoutUserMutation();
  
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    {id: 'invitations', icon: Bell, label: "Invitations"}
  ];

  const invitationsCount = invitationsCountData?.data?.count || 0;
  
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
    setIsMobileOpen(false);
    navigate('/app/invitations');
  };
  
  const handleSettingsClick = () => {
    setIsMobileOpen(false);
    navigate('/app/settings');
  };
  
  const handleDashboardClick = () => {
    setIsMobileOpen(false);
    navigate('/app');
  };
  
  const handleProjectsClick = () => {
    setIsMobileOpen(false);
    navigate('/app/projects');
  };
  
  return (
    <>
      <MobileToggleButton onClick={() => setIsMobileOpen(!isMobileOpen)}>
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </MobileToggleButton>
      
      <MobileOverlay $isOpen={isMobileOpen} onClick={() => setIsMobileOpen(false)} />
      
      <SidebarContainer $isOpen={isMobileOpen}>
        <SidebarHeader>
          <LogoContainer>
            <Logo size="lg" to='' color="white"/>
          </LogoContainer>
        </SidebarHeader>
        
        <SidebarNav>
          <NavList>
            
            
            {menuItems.map(item => (
              <NavItem key={item.id}>
                <NavButton
                  $active={activeView === item.id}
                  onClick={item.id === 'dashboard' ? handleDashboardClick : item.id === 'settings' ? handleSettingsClick : item.id === "invitations" ? handleInvitationsClick : () => setActiveView(item.id)}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </NavButton>
              </NavItem>
            ))}

      
      
            <ProjectSection>
              <ProjectSectionHeader $active={activeView === 'projects'} onClick={handleProjectsClick}>
                <FolderKanban size={20}/> 
                <ProjectSectionTitle>All Projects</ProjectSectionTitle>
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
                    <UserMenuLogout onClick={handleSettingsClick}>
                      <Settings size={16} />
                      Settings
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
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
