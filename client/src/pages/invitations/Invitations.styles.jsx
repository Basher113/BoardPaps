import styled from "styled-components";

// Page Layout
export const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%);
`;

// Header Section
export const Header = styled.header`
  padding: 2rem 2.5rem;
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: -0.5px;
  margin: 0;
`;

export const Subtitle = styled.p`
  color: #808080;
  margin: 0;
  font-size: 0.8125rem;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 768px) {
    width: 100%;
    flex-wrap: wrap;
  }
`;

export const FilterButton = styled.button`
  padding: 0.625rem 1rem;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:hover {
    background: #fafafa;
    border-color: #d0d0d0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }

  ${props => props.$active && `
    background: #1a1a1a;
    color: white;
    border-color: #1a1a1a;
  `}
`;

// Tabs
export const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e0e0e0;
  padding: 0 2.5rem;
`;

export const Tab = styled.button`
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: #808080;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  bottom: -1px;

  &:hover {
    color: #1a1a1a;
  }

  ${props => props.$active && `
    color: #1a1a1a;
    border-bottom-color: #1a1a1a;
  `}
`;

export const TabCount = styled.span`
  background: #f5f5f5;
  color: #707070;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-left: 0.375rem;
`;

// Content
export const Content = styled.main`
  padding: 0 2.5rem 3rem;

  @media (max-width: 768px) {
    padding: 0 1rem 2rem;
  }
`;

// Invitations List
export const InvitationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// Invitation Card
export const InvitationCard = styled.div`
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    border-color: #e8e8e8;
  }

  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const InvitationContent = styled.div`
  display: flex;
  gap: 1rem;
  flex: 1;
  align-items: center;
`;

export const InvitationAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${props => props.$gradient || 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 600;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    font-size: 1.125rem;
  }
`;

export const InvitationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const InvitationTitle = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1a1a1a;
`;

export const InvitationDetails = styled.div`
  font-size: 0.8125rem;
  color: #808080;
  line-height: 1.4;
`;

export const InvitationMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.25rem;
  flex-wrap: wrap;
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #a0a0a0;
`;

export const MetaIcon = styled.div`
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const InvitationActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;

  @media (max-width: 1200px) {
    width: 100%;
  }
`;

// Status Badge
export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.3px;

  ${props => props.$status === 'pending' && `
    background: #fff8e1;
    color: #f57f17;
  `}

  ${props => props.$status === 'accepted' && `
    background: #e8f5e9;
    color: #2e7d32;
  `}

  ${props => props.$status === 'declined' && `
    background: #ffebee;
    color: #c62828;
  `}
`;

// Empty State
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 5rem 2.5rem;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
  opacity: 0.3;
`;

export const EmptyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

export const EmptyDescription = styled.p`
  font-size: 0.875rem;
  color: #808080;
  margin: 0;
  max-width: 25rem;
`;

// Toast
export const ToastMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Legacy exports for compatibility
export const Breadcrumb = styled.div``;
export const BreadcrumbActive = styled.span``;
export const ActionBadge = styled.div``;
export const ActionBadgeText = styled.span``;
export const CardLeft = styled.div``;
export const ProjectIcon = styled.div``;
export const CardDetails = styled.div``;
export const ProjectNameRow = styled.div``;
export const ProjectName = styled.h3``;
export const NewBadge = styled.span``;
export const InviterRow = styled.div``;
export const InviterAvatar = styled.div``;
export const InviterText = styled.p``;
export const InviterName = styled.span``;
export const TimeRow = styled.div``;
export const CardActions = styled.div``;
export const Footer = styled.footer``;
export const FooterText = styled.p``;
export const FooterNav = styled.div``;
export const FooterNavButton = styled.button``;
export const HeaderContent = styled.div``;
export const BackButton = styled.div``;
export const HeaderTitle = styled.div``;
export const InvitationCount = styled.span``;
export const Section = styled.div``;
export const SectionHeader = styled.div``;
export const SectionTitle = styled.div``;
export const SectionDescription = styled.div``;
export const CardContent = styled.div``;
export const CardBody = styled.div``;
export const ProjectKey = styled.span``;
export const DetailItem = styled.div``;
export const DetailLabel = styled.span``;
export const RoleBadge = styled.span``;
export const ExpiryWarning = styled.span``;
export const InvitedBy = styled.div``;
export const AcceptButton = styled.button``;
export const DeclineButton = styled.button``;
export const ProjectIconText = styled.span``;
