import styled from 'styled-components';

export const CardContainer = styled.div`
  background-color: #ffffff;
  padding: 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid #e4e4e7;
  transition: all 0.15s ease;
  cursor: pointer;
  margin-bottom: 0.5rem;
  position: relative;
  opacity: ${props => props.$canEdit ? 1 : 0.5};

  &:hover {
    border-color: #d4d4d8;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  @media (min-width: 640px) {
    padding: 1rem;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.375rem;
`;

export const TypeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const IssueId = styled.span`
  font-size: 0.75rem;
  color: #71717a;
  font-family: monospace;
`;

export const CardTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: #18181b;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
`;

export const CardDescription = styled.p`
  font-size: 0.75rem;
  color: #71717a;
  margin: 0 0 0.75rem 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

export const TagsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: wrap;
`;

export const Tag = styled.span`
  background-color: #f4f4f5;
  color: #52525b;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
`;

export const PriorityBadge = styled.span`
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.$priority) {
      case 'LOW':
        return '#f4f4f5';
      case 'MEDIUM':
        return '#f4f4f5';
      case 'HIGH':
        return '#f4f4f5';
      case 'CRITICAL':
        return '#f4f4f5';
      default:
        return '#f4f4f5';
    }
  }};
  color: ${props => {
    switch (props.$priority) {
      case 'LOW':
        return '#52525b';
      case 'MEDIUM':
        return '#52525b';
      case 'HIGH':
        return '#52525b';
      case 'CRITICAL':
        return '#18181b';
      default:
        return '#52525b';
    }
  }};
  border: 1px solid ${props => {
    switch (props.$priority) {
      case 'CRITICAL':
        return '#d4d4d8';
      default:
        return 'transparent';
    }
  }};
`;

export const AssigneeAvatar = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-color: #18181b;
  color: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 500;
`;

export const CardActions = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const ActionButton = styled.button`
  color: #71717a;
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.15s ease;
  opacity: 0;
  ${CardContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    background-color: #f4f4f5;
    color: #18181b;
  }
`;

export const MenuContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const MenuButton = styled.button`
  color: #71717a;
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f4f4f5;
    color: #18181b;
  }
`;

export const MenuBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 5;
`;

export const MenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 10;
  background-color: #ffffff;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: 10rem;
  padding: 0.25rem 0;
  margin-top: 0.25rem;
  border: 1px solid #e4e4e7;
`;

export const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: ${props => props.$danger ? '#dc2626' : '#18181b'};
  background: none;
  border: none;
  text-align: left;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.15s ease;

  &:hover {
    background-color: ${props => props.$danger ? '#fef2f2' : '#f4f4f5'};
  }

  &:disabled {
    opacity: 0.5;
  }
`;
