import styled from 'styled-components';

export const SidebarContainer = styled.div`
  display: none;
  background-color: #111827;
  color: white;
  transition: all 0.3s;
  width: ${props => props.collapsed ? '5rem' : '16rem'};
  flex-direction: column;

  @media (min-width: 1024px) {
    display: flex;
  }

  height: 100vh;
`;

export const SidebarHeader = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #1f2937;
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
`;

export const AppName = styled.h2`
  font-weight: 700;
  font-size: 0.875rem;
`;



export const CollapseButton = styled.button`
  color: #9ca3af;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  transition: color 0.2s;
  margin: ${props => props.collapsed ? 'auto' : ''};
  &:hover {
    color: white;
  }
`;

export const SidebarNav = styled.nav`
  flex: 1;
  padding: 1rem;
`;

export const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
  border-radius: 0.5rem;
  transition: all 0.2s;
  background: ${props => props.active ? '#2563eb' : 'transparent'};
  color: ${props => props.active ? 'white' : '#d1d5db'};
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background-color: ${props => props.active ? '#2563eb' : '#1f2937'};
  }
`;

export const SidebarFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid #1f2937;
`;

export const UserProfileButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
  background: none;
  border: none;
  cursor: pointer;
  color: white;
  position: relative;

  &:hover {
    background-color: #1f2937;
  }
`;

export const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
  text-align: left;
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
  color: #9ca3af;
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
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  z-index: 40;
  color: #111827;
`;

export const UserMenuHeader = styled.div`
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 0.5rem;
`;

export const UserMenuLabel = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

export const UserMenuCurrentUser = styled.p`
  font-weight: 500;
  font-size: 0.875rem;
`;

export const UserMenuCurrentEmail = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
`;

export const UserMenuList = styled.div`
  padding: 0 0.5rem;
`;

export const UserMenuSectionTitle = styled.p`
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
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
  transition: background-color 0.2s;
  border-radius: 0.25rem;

  &:hover {
    background-color: #f9fafb;
  }
`;

export const UserMenuItemInfo = styled.div``;

export const UserMenuItemName = styled.p`
  font-weight: 500;
  font-size: 0.875rem;
`;

export const UserMenuItemEmail = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
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
  transition: background-color 0.2s;
  border-radius: 0.25rem;
  color: #dc2626;
  margin-top: 0.5rem;

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
  background-color: #111827;
  color: white;
  z-index: 50;
  transform: translateX(0);
  transition: transform 0.3s;

  @media (min-width: 1024px) {
    display: none;
  }
`;

// Project Navigation Styles
export const ProjectSection = styled.div`
  padding: 0 1rem;
  margin-bottom: 1rem;
`;

export const ProjectSectionHeader = styled.div`
  display: flex;
  padding: 0.5rem 0;
  margin-bottom: 0.5rem;
  gap: 1rem;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
  color: #9ca3af;

  &:hover {
    background-color: #1f2937;
    color: white;
  }
`;

export const ProjectSectionTitle = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: .5rem;
`;

export const ProjectList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const ProjectItem = styled.li``;

export const ProjectButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  background: ${props => props.active ? '#1e3a5f' : 'transparent'};
  color: ${props => props.active ? '#60a5fa' : '#d1d5db'};
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background-color: ${props => props.active ? '#1e3a5f' : '#1f2937'};
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
  color: #9ca3af;
  transition: transform 0.2s;
  transform: ${props => props.expanded ? 'rotate(90deg)' : 'rotate(0deg)'};
`;

export const BoardDropdown = styled.div`
  margin-left: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow: hidden;
  max-height: ${props => props.expanded ? '500px' : '0'};
  transition: max-height 0.3s ease;
`;

export const BoardItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  padding-left: 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  background: ${props => props.active ? '#2563eb' : 'transparent'};
  color: ${props => props.active ? 'white' : '#9ca3af'};
  border: none;
  cursor: pointer;
  font-size: 0.8125rem;
  text-align: left;

  &:hover {
    background-color: ${props => props.active ? '#2563eb' : '#1f2937'};
    color: white;
  }
`;

export const EmptyProjects = styled.div`
  padding: 1rem 0.75rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
`;

// Invitation Badge Styles
export const InvitationBadge = styled.span`
  background-color: #ef4444;
  color: white;
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
  border-radius: 0.5rem;
  transition: all 0.2s;
  background: ${props => props.active ? '#1e3a5f' : 'transparent'};
  color: ${props => props.active ? '#60a5fa' : '#d1d5db'};
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  position: relative;

  &:hover {
    background-color: ${props => props.active ? '#1e3a5f' : '#1f2937'};
  }
`;

export const InvitationBadgeDot = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  background-color: #ef4444;
  border-radius: 50%;
  border: 2px solid #111827;
`;