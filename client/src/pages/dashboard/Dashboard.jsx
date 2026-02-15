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
  Title,
  Subtitle,
  StatusCardsContainer,
  StatusCard,
  StatusCount,
  StatusCountLabel,
  StatLabel,
  StatNumber,
  StatSublabel,
  IssuesSection,
  IssuesHeader,
  IssuesTitle,
  FilterBadge,
  IssuesList,
  IssueItem,
  IssueIconWrapper,
  IssueContent,
  IssueTitle,
  IssueMeta,
  IssueKey,
  ProjectLink,
  IssueBadges,
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
  QuickActions,
  QuickActionButton,
  FilterContainer,
  ProjectFilter,
  FilterInfo
} from './Dashboard.styles';
import { FolderKanban, CheckCircle, Clock, AlertCircle, List, ChevronRight } from 'lucide-react';

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

// Get icon for status
const getStatusIcon = (statusName) => {
  const normalized = statusName?.toLowerCase();
  if (normalized?.includes('progress') || normalized?.includes('doing')) {
    return <Clock size={18} />;
  }
  if (normalized?.includes('review') || normalized?.includes('testing')) {
    return <AlertCircle size={18} />;
  }
  if (normalized?.includes('done') || normalized?.includes('complete')) {
    return <CheckCircle size={18} />;
  }
  return <List size={18} />;
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

  const handleProjectClick = (e, projectId) => {
    e.stopPropagation();
    navigate(`/project/${projectId}`);
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

  const selectedStatusData = statusCounts.find(s => s.columnName === selectedStatus);
  const activeColor = getStatusColor(selectedStatusData?.columnName);

  return (
    <DashboardContainer>
      <Header>
        <Title>My Dashboard</Title>
        <Subtitle>
          {totalCount > 0
            ? `You have ${totalCount} issue${totalCount !== 1 ? 's' : ''} assigned`
            : 'No issues assigned to you'}
        </Subtitle>
      </Header>

      {/* Status Summary Cards */}
      {statusCounts.length > 0 && (
        <StatusCardsContainer>
          {statusCounts.map((status) => {
            const getSublabel = (columnName) => {
              const normalized = columnName?.toLowerCase();
              if (normalized?.includes('to do') || normalized?.includes('backlog')) {
                return 'tasks pending';
              }
              if (normalized?.includes('progress')) {
                return 'actively working';
              }
              if (normalized?.includes('review') || normalized?.includes('testing')) {
                return 'in review';
              }
              if (normalized?.includes('done') || normalized?.includes('complete')) {
                return 'tasks completed';
              }
              return 'issues';
            };
            return (
              <StatusCard
                key={status.columnName}
                $isActive={selectedStatus === status.columnName}
                onClick={() => handleStatusClick(status.columnName)}
              >
                <StatLabel>{status.columnName}</StatLabel>
                <StatNumber>{status.count}</StatNumber>
                <StatSublabel>{getSublabel(status.columnName)}</StatSublabel>
              </StatusCard>
            );
          })}
        </StatusCardsContainer>
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

      {/* Issues Section */}
      {issues.length === 0 ? (
        <EmptyState />
      ) : (
        <IssuesSection>
          <IssuesHeader>
            <IssuesTitle>
              {selectedStatus || selectedProject ? (
                <>
                  {selectedStatus && (
                    <>
                      {getStatusIcon(selectedStatusData?.columnName)}
                      <span>{selectedStatusData?.columnName || 'Unknown'}</span>
                    </>
                  )}
                  {selectedProject && (
                    <span style={{ marginLeft: selectedStatus ? '0.5rem' : '0' }}>
                      in {projects.find(p => p.id === selectedProject)?.name || 'Unknown Project'}
                    </span>
                  )}
                  <FilterBadge $color={activeColor}>{filteredIssues.length}</FilterBadge>
                </>
              ) : (
                <>
                  <FolderKanban size={18} />
                  <span>All Assigned Issues</span>
                  <FilterBadge>{issues.length}</FilterBadge>
                </>
              )}
            </IssuesTitle>
            <QuickActions>
              {(selectedStatus || selectedProject) && (
                <QuickActionButton onClick={handleClearFilter}>
                  Clear Filter
                  <ChevronRight size={14} />
                </QuickActionButton>
              )}
            </QuickActions>
          </IssuesHeader>
          <IssuesList>
            {filteredIssues.map((issue) => (
              <IssueItem key={issue.id} onClick={() => handleIssueClick(issue)}>
                <IssueIconWrapper $type={issue.type}>
                  <IssueTypeIcon type={issue.type} size={18} />
                </IssueIconWrapper>
                <IssueContent>
                  <IssueTitle>{issue.title}</IssueTitle>
                  <IssueMeta>
                    <IssueKey>{issue.project.key}-{issue.id.slice(-4)}</IssueKey>
                    <span>•</span>
                    <ProjectLink
                      onClick={(e) => handleProjectClick(e, issue.project.id)}
                    >
                      {issue.project.name}
                    </ProjectLink>
                    <span>•</span>
                    <IssueBadges>
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: getStatusColor(issue.column?.name) + '40',
                          backgroundColor: getStatusColor(issue.column?.name) + '10',
                          color: getStatusColor(issue.column?.name)
                        }}
                      >
                        {issue.column?.name || 'Unknown'}
                      </Badge>
                      <PriorityBadge priority={issue.priority} />
                    </IssueBadges>
                  </IssueMeta>
                </IssueContent>
              </IssueItem>
            ))}
            {filteredIssues.length === 0 && selectedStatus && (
              <EmptyStateContainer style={{ padding: '3rem 2rem' }}>
                <EmptyStateIcon>📭</EmptyStateIcon>
                <EmptyStateTitle style={{ fontSize: '1.125rem' }}>
                  No issues in "{selectedStatusData?.columnName || 'Unknown'}"
                </EmptyStateTitle>
                <EmptyStateDescription style={{ marginBottom: '1.5rem' }}>
                  Try selecting a different status filter to view your assigned issues.
                </EmptyStateDescription>
                <Button variant="outline" onClick={handleClearFilter}>
                  View All Issues
                </Button>
              </EmptyStateContainer>
            )}
          </IssuesList>
        </IssuesSection>
      )}
    </DashboardContainer>
  );
};

const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <IssuesSection>
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
    </IssuesSection>
  );
};

export default Dashboard;
