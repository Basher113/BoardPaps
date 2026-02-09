import styled from 'styled-components';

export const PanelOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
`;

export const PanelContainer = styled.div`
  background: #ffffff;
  width: 380px;
  max-width: 100%;
  height: 100vh;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  animation: slideIn 0.2s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
`;

export const PanelHeader = styled.div`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e4e4e7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fafafa;
`;

export const PanelTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #18181b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
`;

export const InvitationCount = styled.span`
  background: #18181b;
  color: #fafafa;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #71717a;
  cursor: pointer;
  padding: 0.375rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background: #f4f4f5;
    color: #18181b;
  }
`;

export const InvitationsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

export const InvitationCard = styled.div`
  padding: 1rem;
  border: 1px solid #e4e4e7;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
  background: #ffffff;
  transition: all 0.15s ease;

  &:hover {
    border-color: #d4d4d8;
  }
`;

export const InvitationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const ProjectName = styled.span`
  font-weight: 600;
  font-size: 0.875rem;
  color: #18181b;
`;

export const InvitationDetails = styled.div`
  margin-bottom: 0.75rem;
`;

export const InvitationText = styled.p`
  font-size: 0.875rem;
  color: #52525b;
  margin: 0;
  line-height: 1.5;
`;

export const InvitationRole = styled.span`
  font-size: 0.75rem;
  color: #71717a;
  background: #f4f4f5;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
`;

export const InvitationActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

export const ActionButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  background-color: ${props => props.$variant === 'accept' ? '#18181b' : '#f4f4f5'};
  color: ${props => props.$variant === 'accept' ? '#fafafa' : '#52525b'};

  &:hover {
    background-color: ${props => props.$variant === 'accept' ? '#27272a' : '#e4e4e7'};
  }
`;

export const EmptyInvitations = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: #71717a;
`;

export const EmptyText = styled.p`
  font-size: 0.875rem;
  margin: 0;
`;
