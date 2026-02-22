import styled from 'styled-components';

export const BoardContainer = styled.div`
  flex: 1;
  padding: 1.5rem 2rem;
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  overflow-y: hidden;
  background: #f4f4f5;
  height: calc(100vh - 73px);
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const Column = styled.div`
  width: 300px;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 100%;
`;

export const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.25rem;
`;

export const ColumnHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ColumnDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$color || '#a1a1aa'};
`;

export const ColumnTitle = styled.h2`
  font-size: 0.875rem;
  font-weight: 600;
  color: #18181b;
  margin: 0;
`;

export const Count = styled.span`
  background: #e4e4e7;
  color: #71717a;
  padding: 0.0625rem 0.375rem;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 500;
`;

export const ColumnAddBtn = styled.button`
  color: #a1a1aa;
  cursor: pointer;
  font-size: 1.125rem;
  transition: color 0.2s ease;
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #18181b;
  }
`;

export const CardList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.125rem;

  /* Scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d4d4d8;
    border-radius: 10px;
  }

  ${props => props.$isDragOver && `
    background-color: rgb(0, 0, 255);
    border-radius: 0.75rem;
  `}
`;

export const Card = styled.div`
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

  &:hover {
    border-color: #d4d4d8;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  &:active {
    cursor: grabbing;
  }

  ${props => props.$isDragging && `
    opacity: 0.5;
    transform: rotate(3deg);
  `}
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const CardTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #18181b;
  line-height: 1.4;
  flex: 1;
  margin: 0;
`;

export const GripIcon = styled.span`
  color: #d4d4d8;
  font-size: 0.875rem;
  margin-left: 0.5rem;
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
  border-radius: 4px;
  background: #f4f4f5;
  color: #71717a;
  border: 1px solid #e4e4e7;
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

export const AddButton = styled.button`
  padding: 0.5rem;
  background: transparent;
  border: 1px dashed #d4d4d8;
  border-radius: 0.5rem;
  color: #71717a;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  &:hover {
    border-color: #a1a1aa;
    color: #52525b;
    background-color: #fafafa;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #18181b;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 2px #18181b;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #18181b;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  resize: vertical;
  min-height: 60px;
  outline: none;
  font-family: inherit;

  &:focus {
    box-shadow: 0 0 0 2px #18181b;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const Button = styled.button`
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  background-color: ${props => props.primary ? '#18181b' : '#f4f4f5'};
  color: ${props => props.primary ? '#fafafa' : '#52525b'};

  &:hover {
    background-color: ${props => props.primary ? '#27272a' : '#e4e4e7'};
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #71717a;
  font-size: 0.875rem;
  text-align: center;
  min-height: 100px;
`;
