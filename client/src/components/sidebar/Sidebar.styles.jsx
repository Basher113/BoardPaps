import styled from 'styled-components';

export const SidebarContainer = styled.div`
  display: none;
  background-color: #09090b;
  color: #fafafa;
  transition: all 0.2s ease;
  width: ${props => props.$collapsed ? '4rem' : '16rem'};
  flex-direction: column;

  @media (min-width: 1024px) {
    display: flex;
  }

  min-height: 100vh;
  position: relative;
  top: 0;
  left: 0;

`;

export const SidebarHeader = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: ${props => props.$collapsed ? 'center' : 'space-between'};
  border-bottom: 1px solid #27272a;
`;

export const ProjectInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const LogoContainer = styled.div`
  display: flex;
  gap: 1rem;
  height: 100%;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProjectDetails = styled.div`
  display: flex;
  flex-direction: column;
  ${props => props.$collapsed && 'display: none;'}
`;

export const AppName = styled.h2`
  font-weight: 600;
  font-size: 0.875rem;
`;

export const CollapseButton = styled.button`
  color: #71717a;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.15s ease;
  margin: ${props => props.$collapsed ? 'auto' : ''};

  &:hover {
    color: #fafafa;
    background-color: #27272a;
  }
`;

export const SidebarNav = styled.nav`
  flex: 1;
  padding: 0.75rem;
  overflow-y: auto;
`;

export const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const NavItem = styled.li``;

export const NavButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  transition: all 0.15s ease;
  background: ${props => props.$active ? '#fafafa' : 'transparent'};
  color: ${props => props.$active ? '#09090b' : '#a1a1aa'};
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;

  &:hover {
    background-color: ${props => props.$active ? '#f4f4f5' : '#27272a'};
    color: ${props => props.$active ? '#09090b' : '#fafafa'};
  }
`;

export const SidebarFooter = styled.div`
  padding: 0.75rem;
  border-top: 1px solid #27272a;
`;

export const UserProfileButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.15s ease;
  background: none;
  border: none;
  cursor: pointer;
  color: #fafafa;
  position: relative;

  &:hover {
    background-color: #27272a;
  }
`;

export const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
  text-align: left;
  ${props => props.$collapsed && 'display: none;'}
`;

export const Username = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const UserEmail = styled.p`
  font-size: 0.75rem;
  color: #71717a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const UserMenuDropdown = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  margin-bottom: 0.5rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e4e7;
  z-index: 40;
  color: #18181b;
`;

export const UserMenuHeader = styled.div`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e4e4e7;
`;

export const UserMenuLabel = styled.p`
  font-size: 0.75rem;
  color: #71717a;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

export const UserMenuCurrentUser = styled.p`
  font-weight: 600;
  font-size: 0.875rem;
`;

export const UserMenuCurrentEmail = styled.p`
  font-size: 0.75rem;
  color: #71717a;
`;

export const UserMenuList = styled.div`
  padding: 0.5rem;
`;

export const UserMenuSectionTitle = styled.p`
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  color: #71717a;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

export const UserMenuItem = styled.button`
  width: 100%;
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  border-radius: 0.25rem;
  color: #18181b;

  &:hover {
    background-color: #f4f4f5;
  }
`;

export const UserMenuItemInfo = styled.div``;

export const UserMenuItemName = styled.p`
  font-weight: 500;
  font-size: 0.875rem;
`;

export const UserMenuItemEmail = styled.p`
  font-size: 0.75rem;
  color: #71717a;
`;

export const UserMenuLogout = styled.button`
  width: 100%;
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  border-radius: 0.25rem;
  color: #ef4444;
  margin-top: 0.25rem;

  &:hover {
    background-color: #fef2f2;
  }
`;

export const MenuBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 30;
`;

export const MobileOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;

  @media (min-width: 1024px) {
    display: none;
  }
`;

export const MobileSidebarContainer = styled.div`
  position: fixed;
  inset-y: 0;
  left: 0;
  width: 16rem;
  background-color: #09090b;
  color: #fafafa;
  z-index: 50;
  transform: translateX(0);
  transition: transform 0.3s ease;

  @media (min-width: 1024px) {
    display: none;
  }
`;

// Project Navigation Styles
export const ProjectSection = styled.div`
  padding: 0 0.75rem;
  margin-bottom: 0.75rem;
`;

export const ProjectSectionHeader = styled.div`
  display: flex;
  padding: 0.375rem 0;
  margin-bottom: 0.25rem;
  gap: 1rem;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.15s ease;
  background: ${props => props.$active ? '#fafafa' : 'transparent'};
  color: ${props => props.$active ? '#09090b' : '#71717a'};

  &:hover {
    background-color: ${props => props.$active ? '#f4f4f5' : '#27272a'};
    color: ${props => props.$active ? '#09090b' : '#fafafa'};
  }
`;

export const ProjectSectionTitle = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ProjectList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

export const ProjectItem = styled.li``;

export const ProjectButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  transition: all 0.15s ease;
  background: ${props => props.$active ? '#fafafa' : 'transparent'};
  color: ${props => props.$active ? '#09090b' : '#a1a1aa'};
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;

  &:hover {
    background-color: ${props => props.$active ? '#f4f4f5' : '#27272a'};
    color: ${props => props.$active ? '#09090b' : '#fafafa'};
  }
`;

export const ProjectName = styled.span`
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ExpandIcon = styled.span`
  color: #71717a;
  transition: transform 0.2s ease;
  transform: ${props => props.$expanded ? 'rotate(90deg)' : 'rotate(0deg)'};
`;

export const BoardDropdown = styled.div`
  margin-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  overflow: hidden;
  max-height: ${props => props.$expanded ? '500px' : '0'};
  transition: max-height 0.2s ease;
`;

export const BoardItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  padding-left: 1rem;
  border-radius: 0.375rem;
  transition: all 0.15s ease;
  background: ${props => props.$active ? '#fafafa' : 'transparent'};
  color: ${props => props.$active ? '#09090b' : '#71717a'};
  border: none;
  cursor: pointer;
  font-size: 0.8125rem;
  text-align: left;

  &:hover {
    background-color: ${props => props.$active ? '#f4f4f5' : '#27272a'};
    color: ${props => props.$active ? '#09090b' : '#fafafa'};
  }
`;

export const EmptyProjects = styled.div`
  padding: 0.75rem 0.5rem;
  text-align: center;
  color: #71717a;
  font-size: 0.875rem;
`;

// Invitation Badge Styles
export const InvitationBadge = styled.span`
  background-color: #18181b;
  color: #fafafa;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  margin-left: auto;
`;

export const InvitationNavItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  transition: all 0.15s ease;
  background: ${props => props.$active ? '#fafafa' : 'transparent'};
  color: ${props => props.$active ? '#09090b' : '#a1a1aa'};
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  position: relative;
  text-align: left;

  &:hover {
    background-color: ${props => props.$active ? '#f4f4f5' : '#27272a'};
    color: ${props => props.$active ? '#09090b' : '#fafafa'};
  }
`;

export const InvitationBadgeDot = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  background-color: #18181b;
  border-radius: 50%;
  border: 2px solid #09090b;
`;
