import styled from 'styled-components';

export const ColumnContainer = styled.div`
  background-color: #ffffff;
  border-radius: 24px;
  
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 363px;
  max-width: 363px;
  min-height: 600px;
  max-height: 500px;
  border: 1px solid oklch(0.922 0 0);
  padding: 1rem;
  padding-bottom: 2rem;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  
  /* Visual feedback when dragging over */
  transition: all 0.2s ease;
  ${props => props.$isDragOver && `
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3), rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  `}
`;

export const ColumnHeader = styled.div`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #cccccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.5rem 0.5rem 0 0;
  position: sticky;
`;

export const ColumnHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ColumnTitle = styled.h2`
  font-size: 0.875rem;
  font-weight: 600;
  color: #18181b;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

export const IssueCount = styled.span`
  background-color: #e4e4e7;
  color: #52525b;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
`;

export const AddButton = styled.button`
  padding: 0.5rem;
  background: transparent;
  border: 1px dashed #d4d4d8;
  border-radius: 0.375rem;
  color: #71717a;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: #a1a1aa;
    color: #52525b;
    background-color: #fafafa;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CardList = styled.div`
  padding: 0.75rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 100px;
  overflow: auto;
  
  /* Visual feedback for drop zone */
  ${props => props.$isDragOver && `
    background-color: rgba(59, 130, 246, 0.05);
    border-radius: 0.5rem;
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
`;
