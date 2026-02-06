import styled from 'styled-components';

export const CardContainer = styled.div`
  background-color: white;
  padding: 0.75rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.2s;
  cursor: ${props => props.$canEdit ? 'grab' : 'default'};
  margin-bottom: 0.75rem;
  position: relative;
  opacity: ${props => props.$canEdit ? 1 : 0.50};
  ${props => props.$isDragging && `
    opacity: 0.5;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  `}

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  &.dragging {
    opacity: 0.5;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 640px) {
    padding: 1rem;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

export const TypeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const IssueId = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  font-family: monospace;
`;

export const MenuButton = styled.button`
  color: #9ca3af;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  transition: color 0.2s;

  &:hover {
    color: #4b5563;
  }
`;

export const MenuContainer = styled.div`
  position: relative;
`;

export const MenuDropdown = styled.div`
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  width: 12rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 0.25rem;
  z-index: 20;
`;

export const MenuItem = styled.button`
  width: 100%;
  padding: 0.5rem 1rem;
  text-align: left;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.$danger ? '#dc2626' : 'inherit'};
  transition: background-color 0.2s;
  border-radius: 0.25rem;

  &:hover {
    background-color: ${props => props.$danger ? '#fef2f2' : '#f9fafb'};
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: -2px;
  }
`;

export const CardTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  margin-bottom: 0.5rem;
`;

export const CardDescription = styled.p`
  font-size: 0.75rem;
  color: #4b5563;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const MenuBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10;
`;