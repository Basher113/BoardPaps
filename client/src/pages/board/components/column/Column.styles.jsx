import styled from 'styled-components';

export const ColumnContainer = styled.div`
  width: 360px;
  min-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 100%;
  border: 1px solid rgb(219, 219, 219);
  border-radius: 5px;
  padding: 1rem;
  
  /* Visual feedback when dragging over */
  transition: all 0.2s ease;
  ${props => props.$isDragOver && `
    & > div:last-child {
      background-color: rgba(26, 51, 119, 0.72)
      border-radius: 0.75rem;
    }
  `}
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

export const IssueCount = styled.span`
  background: #e4e4e7;
  color: #71717a;
  padding: 0.0625rem 0.375rem;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 500;
`;

export const AddButton = styled.button`
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
  width: 24px;
  height: 24px;

  &:hover {
    color: #18181b;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CardList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;

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
    background-color: rgba(98, 153, 255, 0.1);
    border-radius: 0.75rem;
  `}
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
  background: white;
  border-radius: 12px;
  border: 1px dashed #d4d4d8;
`;
