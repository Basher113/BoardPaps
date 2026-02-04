import React, { useState } from 'react';
import { LayoutDashboard, Settings, Users, ChevronLeft, ChevronRight, Target, MoreHorizontal } from 'lucide-react';
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
  MenuBackdrop,

  // Project Navigation Styles
  ProjectSection,
  ProjectSectionHeader,
  ProjectSectionTitle,
  ProjectList,
  EmptyProjects,
} from './Sidebar.styles';
import UserAvatar from '../ui/user-avatar/UserAvatar';
import { useGetMyProjectsQuery, useVisitProjectMutation } from '../../reducers/slices/project/project.apiSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveProjectId } from '../../reducers/slices/navigation/navigation.selector';
import { setActiveProject } from '../../reducers/slices/navigation/navigation.slice';
import ProjectItem from './ProjectItem';
import icon from "../../assets/bp_icon.webp"

const Sidebar = ({ collapsed, setCollapsed, activeView, setActiveView, currentUser }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState({});
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const activeProjectId = useSelector(selectActiveProjectId);
  
  const { data: projects = [], isLoading: projectsLoading } = useGetMyProjectsQuery();
  const [visitProject] = useVisitProjectMutation();
  
  const menuItems = [
    { id: 'board', icon: LayoutDashboard, label: 'Board' },
    { id: 'team', icon: Users, label: 'Team' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];
  console.log(currentUser)
  
  const toggleProject = async (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
    
    if (!expandedProjects[projectId]) {
      await visitProject(projectId).unwrap();
    }
  };
  
  const handleBoardClick = (projectId, boardId) => {
    dispatch(setActiveProject({ projectId, boardId }));
    navigate(`/board/${boardId}`);
  };
  
  const handleProjectClick = (projectId) => {
    dispatch(setActiveProject({ projectId }));
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
          {menuItems.map(item => (
            <NavItem key={item.id}>
              <NavButton
                active={activeView === item.id}
                onClick={() => setActiveView(item.id)}
              >
                <item.icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </NavButton>
            </NavItem>
          ))}
        </NavList>
        
        {/* Project Navigation Section */}
        {!collapsed && (
          <ProjectSection>
            <ProjectSectionHeader>
              <ProjectSectionTitle>Projects</ProjectSectionTitle>
            </ProjectSectionHeader>
            
            {projectsLoading ? (
              <EmptyProjects>Loading...</EmptyProjects>
            ) : projects.length === 0 ? (
              <EmptyProjects>No projects yet</EmptyProjects>
            ) : (
              <ProjectList>
                {projects.map((project) => {
                  const isExpanded = expandedProjects[project.id] || false;
                  const isActive = activeProjectId === project.id;
                  
                  return (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      isActive={isActive}
                      isExpanded={isExpanded}
                      onToggle={() => toggleProject(project.id)}
                      onProjectClick={handleProjectClick}
                      onBoardClick={handleBoardClick}
                    />
                  );
                })}
              </ProjectList>
            )}
          </ProjectSection>
        )}
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
                    <UserMenuSectionTitle>Switch User</UserMenuSectionTitle>
                  </UserMenuList>
                </UserMenuDropdown>
              </>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <UserProfileButton onClick={() => setShowUserMenu(!showUserMenu)} style={{ width: 'auto' }}>
              <UserAvatar userId={currentUser.id} size="md" />
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
                    <UserMenuSectionTitle>Switch User</UserMenuSectionTitle>
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
