import styled from 'styled-components';

export const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%);
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 2rem 2.5rem 0;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem 1rem 0;
  }
`;

export const HeaderTitle = styled.div`
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a1a;
    letter-spacing: -1px;
    margin-bottom: 0.5rem;

    strong {
      font-weight: 700;
    }
  }

  p {
    font-size: 0.875rem;
    color: #808080;
    margin: 0;
  }
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -1px;
  margin: 0 0 0.5rem 0;
`;

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #808080;
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const NewTaskButton = styled.button`
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #1a1a1a;
  color: white;

  &:hover {
    background: #2d2d2d;
    box-shadow: 0 6px 16px rgba(26, 26, 26, 0.18);
  }
`;

// Metrics Grid
export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  padding: 0 2.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }
`;

export const MetricCard = styled.div`
  background: white;
  padding: 2rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  transition: transform 0.3s ease;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  
  &:hover {
    transform: ${props => props.$clickable ? 'translateY(-4px)' : 'none'};
  }

  ${props => props.$isActive && `
    background: #1a1a1a;
    
    span {
      color: white;
    }
  `}
`;

export const MetricLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  color: #b0b0b0;
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

export const MetricValue = styled.span`
  font-size: 3rem;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -2px;
  line-height: 1;
`;

// Focus Section
export const FocusSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1440px;
  padding: 0 2.5rem;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

// Task List
export const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 100%;
`;

export const TaskItem = styled.div`
  background: white;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  cursor: pointer;

  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    border-color: #f0f0f0;
  }
`;

export const TaskCheckbox = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  ${TaskItem}:hover & {
    border-color: #1a1a1a;
  }
`;

export const TaskContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`;

export const TaskName = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const TaskTag = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #808080;
`;

export const TagDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${props => props.$color || '#e0e0e0'};
`;

export const TaskDue = styled.span`
  font-size: 0.75rem;
  color: #b0b0b0;
  text-align: right;
  min-width: 100px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const PriorityUrgent = styled(TaskTag)`
  color: #ff4444;
  font-weight: 700;
`;

// Legacy exports for compatibility
export const StatusCardsContainer = MetricsGrid;
export const StatusCard = MetricCard;
export const StatusCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;
export const StatusIndicator = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.$color || '#3b82f6'};
  box-shadow: 0 0 0 3px ${props => props.$color}20;
`;
export const StatusName = styled.span`
  font-size: 0.8125rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;
export const StatusCount = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
`;
export const StatusCountLabel = styled.span`
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 400;
`;
export const StatLabel = MetricLabel;
export const StatNumber = MetricValue;
export const StatSublabel = styled.div`
  font-size: 0.8125rem;
  color: #71717a;
`;
export const IssuesSection = styled.div`
  background: transparent;
  border: none;
  border-radius: 0;
  overflow: visible;
  box-shadow: none;
`;
export const IssuesHeader = styled.div`
  padding: 0;
  border-bottom: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  margin-bottom: 1rem;
`;
export const IssuesTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
export const FilterBadge = styled.span`
  background: ${props => props.$color || '#1a1a1a'};
  color: white;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
`;
export const IssuesList = TaskList;
export const IssueItem = TaskItem;
export const IssueIconWrapper = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;
export const IssueContent = TaskContent;
export const IssueTitle = TaskName;
export const IssueMeta = TaskMeta;
export const IssueKey = styled.span`
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #b0b0b0;
  background: #f5f5f5;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
`;
export const ProjectLink = styled.span`
  color: #808080;
  font-weight: 500;
  transition: all 0.15s ease;

  &:hover {
    color: #1a1a1a;
  }
`;
export const IssueBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
export const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  text-align: center;
`;
export const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.8;
`;
export const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.75rem 0;
`;
export const EmptyStateDescription = styled.p`
  font-size: 0.9375rem;
  color: #808080;
  margin: 0 0 2rem 0;
  max-width: 360px;
  line-height: 1.6;
`;
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  color: #808080;
`;
export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #e0e0e0;
  border-top-color: #1a1a1a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
export const LoadingText = styled.p`
  font-size: 0.9375rem;
  color: #808080;
  margin: 0;
`;
export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  text-align: center;
`;
export const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;
export const ErrorTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
`;
export const ErrorDescription = styled.p`
  font-size: 0.875rem;
  color: #808080;
  margin: 0 0 1.5rem 0;
`;
export const QuickActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;
export const QuickActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f5f5f5;
    border-color: #d0d0d0;
  }
`;
export const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 2.5rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;
export const ProjectFilter = styled.select`
  padding: 0.625rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  color: #1a1a1a;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  min-width: 180px;
  transition: all 0.15s ease;

  &:hover {
    border-color: #d0d0d0;
  }

  &:focus {
    outline: none;
    border-color: #1a1a1a;
  }
`;
export const FilterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: #808080;
`;

// Footer
export const DashboardFooter = styled.footer`
  margin-top: auto;
  padding-top: 2.5rem;
  text-align: center;
  border-top: 1px solid #e0e0e0;
  margin-left: 2.5rem;
  margin-right: 2.5rem;

  @media (max-width: 768px) {
    margin-left: 1rem;
    margin-right: 1rem;
  }
`;

export const FooterText = styled.p`
  font-size: 0.8125rem;
  color: #b0b0b0;
  margin: 0;
  padding-bottom: 2rem;
`;
