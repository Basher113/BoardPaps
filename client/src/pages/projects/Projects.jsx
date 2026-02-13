import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  Content,
  Header,
  HeaderTop,
  HeaderLeft,
  Title,
  Subtitle,
  HeaderActions,
  SearchInput,
  SearchWrapper,
  SearchIcon,
  NewButton,
  ProjectsGrid,
  ProjectCard,
  CardHeader,
  ProjectName,
  ProjectKey,
  QuickActionsButton,
  QuickActionsMenu,
  MenuItem,
  ProjectDescription,
  ProjectMeta,
  OwnerBadge,
  MemberAvatars,
  IssueCount,
  LastUpdated,
  RoleIndicator,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  EmptyButton,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  Input,
  Textarea,
  ButtonGroup,
  Button,
  LoadingContainer,
  MetaValue
} from "./Projects.styles";
import { formatDate } from "../../utils/date";
import {
  useGetMyProjectsQuery,
  useCreateProjectMutation,
} from "../../reducers/slices/project/project.apiSlice";
import { setActiveView } from "../../reducers/slices/navigation/navigation.slice";
import UserAvatar from "../../components/ui/user-avatar/UserAvatar";
import { FolderKanban, Search, MoreVertical, Plus, FileText, Settings, LogOut } from "lucide-react";

const Projects = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showNewProject, setShowNewProject] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRefs = useRef({});
  
  useEffect(() => {
    dispatch(setActiveView('projects'));
  }, [dispatch]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenu && menuRefs.current[activeMenu] && !menuRefs.current[activeMenu].contains(event.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenu]);
  
  const [newProject, setNewProject] = useState({ name: "", key: "", description: "" });

  const { data: projects = [], isLoading } = useGetMyProjectsQuery();
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();

  // Filter projects by search
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openProject = (project) => {
    navigate(`/app/project/${project.id}`);
  };

  const handleCreateProject = async () => {
    if (!newProject.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    if (!newProject.key.trim()) {
      toast.error("Project key is required");
      return;
    }

    try {
      const result = await createProject({
        name: newProject.name,
        key: newProject.key.toUpperCase(),
        description: newProject.description,
      }).unwrap();

      toast.success("Project created successfully");
      setShowNewProject(false);
      setNewProject({ name: "", key: "", description: "" });
      navigate(`/app/project/${result.id}`);
    } catch (error) {
      console.error("Failed to create project:", error);
      toast.error(error.data?.message || "Failed to create project");
    }
  };

  const toggleMenu = (projectId, e) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === projectId ? null : projectId);
  };

  const handleMenuAction = (action, project) => {
    setActiveMenu(null);
    switch (action) {
      case 'view':
        openProject(project);
        break;
      case 'settings':
        navigate(`/app/project/${project.id}/settings`);
        break;
      case 'leave':
        // TODO: Implement leave project
        toast.info("Leave project feature coming soon");
        break;
      default:
        break;
    }
  };



  if (isLoading) {
    return (
      <Content>
        <LoadingContainer>Loading projects...</LoadingContainer>
      </Content>
    );
  }

  return (
    <>
      <Content>
        <Header>
          <HeaderTop>
            <HeaderLeft>
              <Title>Projects</Title>
              <Subtitle>Manage and access your projects</Subtitle>
            </HeaderLeft>
            <HeaderActions>
              <SearchWrapper>
                <SearchIcon>
                  <Search size={16} />
                </SearchIcon>
                <SearchInput
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </SearchWrapper>
              <NewButton onClick={() => setShowNewProject(true)}>
                <Plus size={16} />
                Create Project
              </NewButton>
            </HeaderActions>
          </HeaderTop>
        </Header>

        {filteredProjects.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <FolderKanban size={32} />
            </EmptyIcon>
            <EmptyTitle>No projects yet</EmptyTitle>
            <EmptyDescription>
              Create your first project to get started managing your tasks
            </EmptyDescription>
            <EmptyButton onClick={() => setShowNewProject(true)}>
              <Plus size={16} />
              Create Project
            </EmptyButton>
          </EmptyState>
        ) : (
          <ProjectsGrid>
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                onClick={() => openProject(project)}
              >
                <CardHeader>
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <ProjectName>{project.name}</ProjectName>
                    <ProjectKey>{project.key}</ProjectKey>
                    <RoleIndicator $role={project.userRole}>{project.userRole}</RoleIndicator>
                  </div>
                  <div ref={(el) => (menuRefs.current[project.id] = el)} style={{ position: 'relative' }}>
                    <QuickActionsButton onClick={(e) => toggleMenu(project.id, e)}>
                      <MoreVertical size={16} />
                    </QuickActionsButton>
                    {activeMenu === project.id && (
                      <QuickActionsMenu onClick={(e) => e.stopPropagation()}>
                        <MenuItem onClick={(e) => { e.stopPropagation(); handleMenuAction('view', project); }}>
                          <FileText size={14} style={{ marginRight: '8px' }} />
                          View
                        </MenuItem>
                        <MenuItem onClick={(e) => { e.stopPropagation(); handleMenuAction('settings', project); }}>
                          <Settings size={14} style={{ marginRight: '8px' }} />
                          Settings
                        </MenuItem>
                        {project.userRole !== 'OWNER' && (
                          <MenuItem onClick={(e) => { e.stopPropagation(); handleMenuAction('leave', project); }}>
                            <LogOut size={14} style={{ marginRight: '8px' }} />
                            Leave
                          </MenuItem>
                        )}
                      </QuickActionsMenu>
                    )}
                  </div>
                </CardHeader>

                <ProjectDescription>
                  {project.description || "No description"}
                </ProjectDescription>

                <ProjectMeta>
                  <OwnerBadge>
                    <UserAvatar user={project.owner} size="sm" />
                    <span>{project.owner?.username || 'Unknown'}</span>
                  </OwnerBadge>

                  {project.members && project.members.length > 0 && (
                    <MemberAvatars>
                      {project.members.slice(0, 3).map((member, index) => (
                        <UserAvatar 
                          key={member.user?.id || index} 
                          user={member.user} 
                          size="sm" 
                          style={{ marginLeft: index > 0 ? -8 : 0 }}
                        />
                      ))}
                      {project.members.length > 3 && (
                        <AvatarOverflow>+{project.members.length - 3}</AvatarOverflow>
                      )}
                    </MemberAvatars>
                  )}

                  <IssueCount>
                    <FileText size={12} />
                    <MetaValue>{project._count?.issues || 0}</MetaValue>
                  </IssueCount>

                  <LastUpdated>
                    {project.lastVisitedAt
                      ? formatDate(project.lastVisitedAt)
                      : 'Never visited'}
                  </LastUpdated>
                </ProjectMeta>
              </ProjectCard>
            ))}
          </ProjectsGrid>
        )}
      </Content>

      {showNewProject && (
        <ModalOverlay onClick={() => setShowNewProject(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Create New Project</ModalTitle>

            <Input
              placeholder="Project key (e.g. PROJ)"
              value={newProject.key}
              onChange={(e) =>
                setNewProject({ ...newProject, key: e.target.value.toUpperCase() })
              }
              maxLength={10}
              style={{ textTransform: 'uppercase', fontWeight: 600 }}
              disabled={isCreating}
              required
            />

            <Input
              placeholder="Project name"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
              autoFocus
              disabled={isCreating}
            />

            <Textarea
              placeholder="Project description"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  description: e.target.value,
                })
              }
              disabled={isCreating}
            />

            <ButtonGroup>
              <Button primary onClick={handleCreateProject} disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Project"}
              </Button>
              <Button
                onClick={() => {
                  setShowNewProject(false);
                  setNewProject({ name: "", key: "", description: "" });
                }}
                disabled={isCreating}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default Projects;
