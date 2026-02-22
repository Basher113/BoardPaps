import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setActiveView } from '../../reducers/slices/navigation/navigation.slice';
import { useGetDashboardIssuesQuery } from '../../reducers/slices/dashboard/dashboard.apiSlice';
import { useGetMyProjectsQuery } from '../../reducers/slices/project/project.apiSlice';
import PriorityBadge from '../board/components/priority-badge/PriorityBadge';
import IssueTypeIcon from '../board/components/issue-type-icon/IssueTypeIcon';
import Badge from '../../components/ui/badge/Badge';
import Button from '../../components/ui/button/Button';
import {
  DashboardContainer,
  Header,
  HeaderTitle,
  Title,
  Subtitle,
  HeaderActions,
  NewTaskButton,
  MetricsGrid,
  MetricCard,
  MetricLabel,
  MetricValue,
  FocusSection,
  SectionHeader,
  SectionTitle,
  TaskList,
  TaskItem,
  TaskCheckbox,
  TaskContent,
  TaskName,
  TaskMeta,
  TaskTag,
  TagDot,
  TaskDue,
  FilterContainer,
  ProjectFilter,
  FilterInfo,
  QuickActions,
  QuickActionButton,
  EmptyStateContainer,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  LoadingContainer,
  LoadingSpinner,
  LoadingText,
  ErrorContainer,
  ErrorIcon,
  ErrorTitle,
  ErrorDescription,
  DashboardFooter,
  FooterText,
  IssueIconWrapper,
  IssueKey,
  ProjectLink,
  IssueBadges,
} from './Dashboard.styles';
import { FolderKanban, CheckCircle, ChevronRight, Plus } from 'lucide-react';

// Status colors for visual distinction
const STATUS_COLORS = {
  'To Do': '#64748b',
  'In Progress': '#3b82f6',
  'In Review': '#f59e0b',
  'Done': '#22c55e',
  'Completed': '#22c55e',
  'Backlog': '#94a3b8',
  'Testing': '#8b5cf6'
};

// Default color for unknown statuses
const getStatusColor = (statusName) => {
  if (STATUS_COLORS[statusName]) {
    return STATUS_COLORS[statusName];
  }
  const normalizedStatus = statusName?.toLowerCase();
  for (const [key, value] of Object.entries(STATUS_COLORS)) {
    if (key.toLowerCase() === normalizedStatus) {
      return value;
    }
  }
  return '#64748b';
};

// Get due date text
const getDueText = (dueDate) => {
  if (!dueDate) return null;
  
  const now = new Date();
  const due = new Date(dueDate);
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Due Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays <= 7) return `In ${diffDays} days`;
  
  return due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Set active view on mount
  useEffect(() => {
    dispatch(setActiveView('dashboard'));
  }, [dispatch]);
  
  const { data, isLoading, error } = useGetDashboardIssuesQuery();
  const { data: projectsData } = useGetMyProjectsQuery();

  const issues = data?.issues || [];
  const statusCounts = data?.statusCounts || [];
  const projects = projectsData || [];

  // Filter by both status (column name) and project
  const filteredIssues = issues.filter(issue => {
    const matchesStatus = !selectedStatus || issue.column?.name === selectedStatus;
    const matchesProject = !selectedProject || issue.project?.id === selectedProject;
    return matchesStatus && matchesProject;
  });

  const totalCount = statusCounts.reduce((sum, item) => sum + item.count, 0);

  const handleStatusClick = (columnName) => {
    if (selectedStatus === columnName) {
      setSelectedStatus(null);
    } else {
      setSelectedStatus(columnName);
    }
  };

  const handleIssueClick = (issue) => {
    navigate(`/project/${issue.projectId}`, {
      state: { highlightIssueId: issue.id }
    });
  };

  const handleClearFilter = () => {
    setSelectedStatus(null);
    setSelectedProject(null);
  };

  const handleProjectChange = (e) => {
    const value = e.target.value;
    setSelectedProject(value || null);
  };

  if (isLoading) {
    return (
      <DashboardContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading your dashboard...</LoadingText>
        </LoadingContainer>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>Unable to load dashboard</ErrorTitle>
          <ErrorDescription>
            We're having trouble loading your issues. Please try refreshing the page.
          </ErrorDescription>
          <Button
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </ErrorContainer>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      {/* Header */}
      <Header>
        <HeaderTitle>
          <h1>Welcome back</h1>
          <p>Your personal dashboard is updated with today's priorities.</p>
        </HeaderTitle>
        <HeaderActions>
          <NewTaskButton onClick={() => navigate('/projects')}>
            <Plus size={16} />
            New Task
          </NewTaskButton>
        </HeaderActions>
      </Header>

      {/* Metrics Grid */}
      {statusCounts.length > 0 && (
        <MetricsGrid>
          <MetricCard>
            <MetricLabel>Total Issues</MetricLabel>
            <MetricValue>{totalCount}</MetricValue>
          </MetricCard>
          {statusCounts.slice(0, 3).map((status) => (
            <MetricCard
              key={status.columnName}
              $clickable
              $isActive={selectedStatus === status.columnName}
              onClick={() => handleStatusClick(status.columnName)}
            >
              <MetricLabel>{status.columnName}</MetricLabel>
              <MetricValue>{status.count}</MetricValue>
            </MetricCard>
          ))}
        </MetricsGrid>
      )}

      {/* Project Filter */}
      {projects.length > 0 && (
        <FilterContainer>
          <ProjectFilter value={selectedProject || ''} onChange={handleProjectChange}>
            <option value="">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </ProjectFilter>
          {(selectedStatus || selectedProject) && (
            <FilterInfo>
              Showing {filteredIssues.length} of {issues.length} issues
            </FilterInfo>
          )}
        </FilterContainer>
      )}

      {/* Focus Section */}
      {issues.length === 0 ? (
        <EmptyState />
      ) : (
        <FocusSection>
          <SectionHeader>
            <SectionTitle>
              {selectedStatus ? `${selectedStatus} Issues` : 'Current Focus'}
            </SectionTitle>
            {(selectedStatus || selectedProject) && (
              <QuickActions>
                <QuickActionButton onClick={handleClearFilter}>
                  Clear Filter
                  <ChevronRight size={14} />
                </QuickActionButton>
              </QuickActions>
            )}
          </SectionHeader>
          
          <TaskList>
            {filteredIssues.slice(0, 10).map((issue) => (
              <TaskItem key={issue.id} onClick={() => handleIssueClick(issue)}>
                <TaskCheckbox />
                <IssueIconWrapper>
                  <IssueTypeIcon type={issue.type} size={16} />
                </IssueIconWrapper>
                <TaskContent>
                  <TaskName>{issue.title}</TaskName>
                  <TaskMeta>
                    <TaskTag>
                      <TagDot $color={getStatusColor(issue.column?.name)} />
                      {issue.project?.name || 'Unknown'}
                    </TaskTag>
                    {issue.priority === 'HIGH' || issue.priority === 'URGENT' ? (
                      <TaskTag style={{ color: '#ff4444', fontWeight: 700 }}>
                        {issue.priority}
                      </TaskTag>
                    ) : (
                      <TaskTag>{issue.column?.name || 'Unknown'}</TaskTag>
                    )}
                  </TaskMeta>
                </TaskContent>
                <TaskDue>{getDueText(issue.dueDate)}</TaskDue>
              </TaskItem>
            ))}
            {filteredIssues.length === 0 && selectedStatus && (
              <EmptyStateContainer style={{ padding: '3rem 2rem' }}>
                <EmptyStateIcon>📭</EmptyStateIcon>
                <EmptyStateTitle style={{ fontSize: '1.125rem' }}>
                  No issues in "{selectedStatus}"
                </EmptyStateTitle>
                <EmptyStateDescription style={{ marginBottom: '1.5rem' }}>
                  Try selecting a different status filter to view your assigned issues.
                </EmptyStateDescription>
                <Button variant="outline" onClick={handleClearFilter}>
                  View All Issues
                </Button>
              </EmptyStateContainer>
            )}
          </TaskList>
        </FocusSection>
      )}

      {/* Footer */}
      <DashboardFooter>
        <FooterText>Minimal Personal Dashboard © 2026. Keep moving forward.</FooterText>
      </DashboardFooter>
    </DashboardContainer>
  );
};

const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <FocusSection>
      
      <EmptyStateContainer>
        <EmptyStateIcon>
          <CheckCircle size={64} style={{ color: '#22c55e', opacity: 0.3 }} />
        </EmptyStateIcon>
        <EmptyStateTitle>All caught up! 🎉</EmptyStateTitle>
        <EmptyStateDescription>
          You don't have any issues assigned to you across your projects.
          Looks like you've completed everything on your plate!
        </EmptyStateDescription>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button onClick={() => navigate('/projects')}>
            <FolderKanban size={16} />
            Browse Projects
          </Button>
          <Button variant="outline" onClick={() => navigate('/invitations')}>
            View Invitations
          </Button>
        </div>
      </EmptyStateContainer>
    </FocusSection>
  );
};

export default Dashboard;
