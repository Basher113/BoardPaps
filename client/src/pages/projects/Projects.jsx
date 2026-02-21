import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  PageContainer,
  Header,
  HeaderLeft,
  Title,
  Subtitle,
  HeaderActions,
  SearchInput,
  SearchWrapper,
  SearchIcon,
  NewButton,
  ProjectsTable,
  TableHeader,
  TableHeaderCell,
  ProjectRow,
  ProjectInfo,
  ProjectName,
  ProjectDescription,
  ProjectKey,
  MemberAvatars,
  AvatarOverflow,
  LastUpdated,
  LastUpdatedTime,
  LastUpdatedBy,
  QuickActionsButton,
  QuickActionsMenu,
  MenuItem,
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
  Footer,
  StatusIndicator,
  StatusDot,
  StatItem,
  StatValue,
  StatLabel,
  SkeletonRow,
  SkeletonText,
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

  const { data: projectsData, isLoading } = useGetMyProjectsQuery();
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();

  // Filter projects by search
  const projects = projectsData?.data || [];
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const totalIssues = projects.reduce((sum, p) => sum + (p._count?.issues || 0), 0);
  const totalMembers = new Set(projects.flatMap(p => p.members?.map(m => m.user?.id) || [])).size;

  const openProject = (project) => {
    navigate(`/project/${project.id}`);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
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
      navigate(`/project/${result.data.id}`);
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
        navigate(`/project/${project.id}/settings`);
        break;
      case 'leave':
        // TODO: Implement leave project
        toast.info("Leave project feature coming soon");
        break;
      default:
        break;
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <PageContainer>
        <Header>
          <HeaderLeft>
            <Title>All Projects</Title>
            <Subtitle>Loading your projects...</Subtitle>
          </HeaderLeft>
        </Header>
        <ProjectsTable>
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonRow key={i}>
              <div>
                <SkeletonText height="18px" width="60%" />
                <SkeletonText height="12px" width="40%" style={{ marginTop: '4px' }} />
              </div>
              <SkeletonText height="24px" width="80px" />
              <div style={{ display: 'flex', gap: '4px' }}>
                <SkeletonText height="32px" width="32px" style={{ borderRadius: '50%' }} />
                <SkeletonText height="32px" width="32px" style={{ borderRadius: '50%' }} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <SkeletonText height="16px" width="60px" style={{ marginLeft: 'auto' }} />
                <SkeletonText height="12px" width="80px" style={{ marginLeft: 'auto', marginTop: '4px' }} />
              </div>
            </SkeletonRow>
          ))}
        </ProjectsTable>
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer>
        <Header>
          <HeaderLeft>
            <Title>All Projects</Title>
            <Subtitle>
              You have <strong>{projects.length} active project{projects.length !== 1 ? 's' : ''}</strong> in your workspace.
            </Subtitle>
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
              <Plus size={14} />
              Create New
            </NewButton>
          </HeaderActions>
        </Header>

        {filteredProjects.length === 0 ? (
          <ProjectsTable>
            <EmptyState>
              <EmptyIcon>
                <FolderKanban size={32} />
              </EmptyIcon>
              <EmptyTitle>No projects yet</EmptyTitle>
              <EmptyDescription>
                Create your first project to get started managing your tasks
              </EmptyDescription>
              <EmptyButton onClick={() => setShowNewProject(true)}>
                <Plus size={14} />
                Create Project
              </EmptyButton>
            </EmptyState>
          </ProjectsTable>
        ) : (
          <ProjectsTable>
            <TableHeader>
              <TableHeaderCell>Project Name</TableHeaderCell>
              <TableHeaderCell>Key Identifier</TableHeaderCell>
              <TableHeaderCell>Assigned Team</TableHeaderCell>
              <TableHeaderCell>Last Updated</TableHeaderCell>
            </TableHeader>
            
            {filteredProjects.map((project) => {
              const members = project.members || [];
              const displayMembers = members.slice(0, 4);
              const remainingCount = members.length > 4 ? members.length - 4 : 0;
              
              return (
                <ProjectRow
                  key={project.id}
                  onClick={() => openProject(project)}
                >
                  <ProjectInfo>
                    <ProjectName>{project.name}</ProjectName>
                    <ProjectDescription>
                      {project.description || 'Software Project'}
                    </ProjectDescription>
                  </ProjectInfo>

                  <ProjectKey>{project.key}</ProjectKey>

                  <MemberAvatars>
                    {displayMembers.length > 0 ? (
                      <>
                        {displayMembers.map((member, idx) => (
                          <UserAvatar 
                            key={member.user?.id || idx} 
                            user={member.user} 
                            size="sm"
                          />
                        ))}
                        {remainingCount > 0 && (
                          <AvatarOverflow>+{remainingCount}</AvatarOverflow>
                        )}
                      </>
                    ) : (
                      <UserAvatar user={project.owner} size="sm" />
                    )}
                  </MemberAvatars>

                  <LastUpdated>
                    <LastUpdatedTime>
                      {project.lastVisitedAt
                        ? formatDate(project.lastVisitedAt)
                        : 'Never visited'}
                    </LastUpdatedTime>
                    <LastUpdatedBy>
                      By {project.owner?.username || 'Unknown'}
                    </LastUpdatedBy>
                  </LastUpdated>

                  <div ref={(el) => (menuRefs.current[project.id] = el)} style={{ position: 'relative' }}>
                    <QuickActionsButton onClick={(e) => toggleMenu(project.id, e)}>
                      <MoreVertical size={16} />
                    </QuickActionsButton>
                    {activeMenu === project.id && (
                      <QuickActionsMenu onClick={(e) => e.stopPropagation()}>
                        <MenuItem onClick={(e) => { e.stopPropagation(); handleMenuAction('view', project); }}>
                          <FileText size={14} />
                          View
                        </MenuItem>
                        <MenuItem onClick={(e) => { e.stopPropagation(); handleMenuAction('settings', project); }}>
                          <Settings size={14} />
                          Settings
                        </MenuItem>
                        {project.userRole !== 'OWNER' && (
                          <MenuItem onClick={(e) => { e.stopPropagation(); handleMenuAction('leave', project); }}>
                            <LogOut size={14} />
                            Leave
                          </MenuItem>
                        )}
                      </QuickActionsMenu>
                    )}
                  </div>
                </ProjectRow>
              );
            })}
          </ProjectsTable>
        )}

        <Footer>
          <StatusIndicator>
            <StatusDot />
            <StatLabel>System Active</StatLabel>
          </StatusIndicator>
          <StatItem>
            <StatValue>{totalIssues}</StatValue>
            <StatLabel>Total Tasks</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{totalMembers}</StatValue>
            <StatLabel>Team Members</StatLabel>
          </StatItem>
        </Footer>
      </PageContainer>

      {showNewProject && (
        <ModalOverlay onClick={() => setShowNewProject(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Create New Project</ModalTitle>
            <form method="post" onSubmit={handleCreateProject}>
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
                <Button primary disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Project'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowNewProject(false);
                    setNewProject({ name: "", key: "", description: "" });
                  }}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
              </ButtonGroup>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default Projects;
