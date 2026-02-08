import styled from "styled-components";

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
  background: white;
  width: 380px;
  max-width: 100%;
  height: 100vh;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
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
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f9fafb;
`;

export const PanelTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const InvitationCount = styled.span`
  background: #6366f1;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
    color: #374151;
  }
`;

export const InvitationsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

export const InvitationCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  transition: all 0.2s;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    border-color: #c7d2fe;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
  }
`;

export const ProjectInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

export const ProjectIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
`;

export const CardBody = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ProjectName = styled.h4`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.125rem;
`;

export const ProjectKey = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
`;

export const InvitationMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
`;

export const RoleBadge = styled.span`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background: #e0e7ff;
  color: #4338ca;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

export const ExpiryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  background: #fef3c7;
  color: #b45309;
  border-radius: 4px;
  font-size: 0.75rem;
`;

export const InvitedBy = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.5rem;

  strong {
    color: #374151;
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.875rem;
  padding-top: 0.875rem;
  border-top: 1px solid #f3f4f6;
`;

export const ActionButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${({ variant }) =>
    variant === "accept"
      ? `
        background: #10b981;
        color: white;
        &:hover:not(:disabled) {
          background: #059669;
        }
        &:disabled {
          background: #a7f3d0;
          cursor: not-allowed;
        }
      `
      : variant === "decline"
      ? `
        background: white;
        color: #ef4444;
        border: 1px solid #fecaca;
        &:hover:not(:disabled) {
          background: #fef2f2;
        }
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `
      : ""
  }
`;

export const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: #6b7280;
`;

export const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  margin-bottom: 1rem;
`;

export const EmptyTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.375rem;
`;

export const EmptyDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  max-width: 280px;
  line-height: 1.5;
`;

export const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  text-align: center;
`;

export const ErrorIcon = styled.div`
  width: 48px;
  height: 48px;
  background: #fef2f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
  margin-bottom: 1rem;
`;

export const RetryButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #4f46e5;
  }
`;
