import React, { useState } from 'react';
import { X, Target, LayoutDashboard, Users, Settings, MoreHorizontal } from 'lucide-react';
import {
  SidebarHeader,
  ProjectInfo,
  LogoContainer,
  ProjectDetails,
  ProjectName,
  ProjectKey,
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
  UserMenuItem,
  UserMenuItemInfo,
  UserMenuItemName,
  UserMenuItemEmail,
  MenuBackdrop,

  MobileOverlay,
  MobileSidebarContainer
} from './Sidebar.styles';
import UserAvatar, { USERSDATA } from '../../../../components/ui/user-avatar/UserAvatar';

const MobileSidebar = ({ isOpen, setIsOpen, activeView, setActiveView, currentUser, onSwitchUser }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const menuItems = [
    { id: 'board', icon: LayoutDashboard, label: 'Board' },
    { id: 'team', icon: Users, label: 'Team' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];
  
  if (!isOpen) return null;
  
  return (
    <>
      <MobileOverlay onClick={() => setIsOpen(false)} />
      <MobileSidebarContainer>
        <SidebarHeader>
          <ProjectInfo>
            <LogoContainer>
              <Target size={20} />
            </LogoContainer>
            <ProjectDetails>
              <ProjectName>TeamFlow Development</ProjectName>
              <ProjectKey>TFD</ProjectKey>
            </ProjectDetails>
          </ProjectInfo>
          <button 
            onClick={() => setIsOpen(false)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              cursor: 'pointer',
              padding: 0
            }}
          >
            <X size={20} />
          </button>
        </SidebarHeader>
        
        <SidebarNav>
          <NavList>
            {menuItems.map(item => (
              <NavItem key={item.id}>
                <NavButton
                  active={activeView === item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setIsOpen(false);
                  }}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </NavButton>
              </NavItem>
            ))}
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
                    <UserMenuSectionTitle>Switch User</UserMenuSectionTitle>
                    {USERSDATA.filter(u => u.id !== currentUser.id).map(user => (
                      <UserMenuItem
                        key={user.id}
                        onClick={() => {
                          onSwitchUser(user.id);
                          setShowUserMenu(false);
                        }}
                      >
                        <UserAvatar userId={user.id} size="sm" />
                        <UserMenuItemInfo>
                          <UserMenuItemName>{user.fullName}</UserMenuItemName>
                          <UserMenuItemEmail>{user.email}</UserMenuItemEmail>
                        </UserMenuItemInfo>
                      </UserMenuItem>
                    ))}
                  </UserMenuList>
                </UserMenuDropdown>
              </>
            )}
          </div>
        </SidebarFooter>
      </MobileSidebarContainer>
    </>
  );
};

export default MobileSidebar;