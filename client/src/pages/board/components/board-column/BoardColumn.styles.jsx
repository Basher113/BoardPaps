import styled from 'styled-components';

export const ColumnContainer = styled.div`
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 0.75rem;
  min-width: 280px;
  flex-shrink: 0;
  width: 100%;
  border: 2px solid ${props => props.$isOver ? '#3b82f6' : 'transparent'};
  transition: border-color 0.2s;

  @media (min-width: 640px) {
    padding: 1rem;
    min-width: 300px;
    width: auto;
  }
`;

export const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const ColumnHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ColumnTitle = styled.h3`
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;

  @media (min-width: 640px) {
    font-size: 1rem;
  }
`;

export const IssueCount = styled.span`
  background-color: #e5e7eb;
  color: #374151;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
`;

export const AddButton = styled.button`
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

export const IssuesContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 200px;
  gap: 0.5rem;
`;

export const EmptyColumnMessage = styled.div`
  color: #9ca3af;
  font-size: 0.875rem;
  text-align: center;
  padding: 2rem 1rem;
  border: 2px dashed #e5e7eb;
  border-radius: 0.5rem;
  background-color: #fafafa;
`;