import styled from 'styled-components';

export const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  min-height: calc(100vh - 2rem);
`;

export const Header = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
`;

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.025em;
`;

export const Subtitle = styled.p`
  font-size: 0.9375rem;
  color: #64748b;
  margin: 0;
`;

export const StatusCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const StatusCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${props => props.$color || '#3b82f6'};
    border-radius: 0.75rem 0 0 0.75rem;
    transform: scaleY(0);
    transition: transform 0.2s ease;
  }

  &:hover {
    border-color: ${props => props.$color || '#3b82f6'};
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);

    &::before {
      transform: scaleY(1);
    }
  }

  ${props => props.$isActive && `
    border-color: ${props.$color || '#3b82f6'};
    background-color: ${props.$color}08;
    box-shadow: 0 4px 12px ${props.$color}20;

    &::before {
      transform: scaleY(1);
    }
  `}
`;

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
  font-weight:700;
  color: #0f172a;
  line-height: 1;
`;

export const StatusCountLabel = styled.span`
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 400;
`;

export const IssuesSection = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

export const IssuesHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
`;

export const IssuesTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const FilterBadge = styled.span`
  background: ${props => props.$color || '#3b82f6'};
  color: white;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
`;

export const IssuesList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const IssueItem = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f8fafc;
    padding-left: 1.75rem;
  }
`;

export const IssueIconWrapper = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    switch (props.$type) {
      case 'BUG': return '#fef2f2';
      case 'TASK': return '#f0fdf4';
      case 'STORY': return '#eff6ff';
      case 'EPIC': return '#faf5ff';
      default: return '#f8fafc';
    }
  }};
  color: ${props => {
    switch (props.$type) {
      case 'BUG': return '#dc2626';
      case 'TASK': return '#16a34a';
      case 'STORY': return '#2563eb';
      case 'EPIC': return '#9333ea';
      default: return '#64748b';
    }
  }};
`;

export const IssueContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const IssueTitle = styled.h3`
  font-size: 0.9375rem;
  font-weight: 500;
  color: #0f172a;
  margin: 0 0 0.375rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s ease;

  ${IssueItem}:hover & {
    color: #3b82f6;
  }
`;

export const IssueMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8125rem;
  color: #64748b;
`;

export const IssueKey = styled.span`
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  background: #f1f5f9;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
`;

export const ProjectLink = styled.span`
  color: #3b82f6;
  font-weight: 500;
  transition: all 0.15s ease;

  &:hover {
    color: #1d4ed8;
    text-decoration: underline;
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
  color: #0f172a;
  margin: 0 0 0.75rem 0;
`;

export const EmptyStateDescription = styled.p`
  font-size: 0.9375rem;
  color: #64748b;
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
  color: #64748b;
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
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
  color: #64748b;
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
  color: #0f172a;
  margin: 0 0 0.5rem 0;
`;

export const ErrorDescription = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 1.5rem 0;
`;

export const QuickActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

export const QuickActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: #f1f5f9;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #e2e8f0;
    color: #1e293b;
  }
`;
