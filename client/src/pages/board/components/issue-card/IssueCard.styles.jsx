import styled from 'styled-components';

export const CardContainer = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #e4e4e7;
  cursor: ${props => props.$canEdit ? 'grab' : 'default'};
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
  
  /* Better touch handling for mobile */
  touch-action: none;
  user-select: none;
  
  &:hover {
    border-color: #d4d4d8;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  &:active {
    cursor: grabbing;
  }

  ${props => props.$isDragging && `
    opacity: 0.5;
    transform: rotate(3deg) scale(1.02);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    z-index: 100;
  `}
  
  ${props => props.$hasBorderTop && `
    border-top: 3px solid #18181b;
  `}
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const TypeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const IssueId = styled.span`
  font-size: 0.6875rem;
  color: #a1a1aa;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
`;

export const CardTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #18181b;
  line-height: 1.4;
  flex: 1;
  margin: 0;
`;

export const CardDescription = styled.p`
  font-size: 0.8125rem;
  color: #71717a;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
`;

export const TagGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

export const Tag = styled.span`
  font-size: 0.6875rem;
  font-weight: 500;
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  background: #f4f4f5;
  color: #71717a;
  border: 1px solid #e4e4e7;
  text-transform: capitalize;
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid #f4f4f5;
`;

export const TaskStats = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #a1a1aa;
`;

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6875rem;
  font-weight: 500;
`;

export const StatIcon = styled.span`
  font-size: 0.75rem;
`;

export const AssigneeAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props => props.$background || '#f4f4f5'};
  color: ${props => props.$color || '#18181b'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 600;
  border: 2px solid white;
  box-shadow: 0 0 0 1px #e4e4e7;
`;

// Legacy exports for compatibility
export const TagsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: wrap;
`;

export const PriorityBadge = styled.span`
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 500;
  background-color: #f4f4f5;
  color: #71717a;
  border: 1px solid #e4e4e7;
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
  color: #a1a1aa;
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  border-radius: 4px;
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
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  font-size: 0.8125rem;
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
