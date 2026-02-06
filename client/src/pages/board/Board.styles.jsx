import styled from "styled-components";

export const BoardContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding: 1rem;
`;


export const Column = styled.div`
  background: white;
  border-radius: 8px;
  min-width: 300px;
  height: 600px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  flex: 1;
`;

export const ColumnHeader = styled.div`
  padding:  0.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #e4e4e4;
  border-radius: 8px 8px 0 0;
`;

export const ColumnHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ColumnTitle = styled.h2`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const Count = styled.span`
  background: #f3f4f6;
  color: #6b7280;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

export const CardList = styled.div`
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 200px;
  border: 1px solid ${({ isDraggingOver }) =>
    isDraggingOver ? "var(--primary)" : "transparent"};
  transition: border 0.2s;
`;

export const Card = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
  cursor: grab;
  transition: all 0.2s;
  opacity: ${({ isDragging }) => (isDragging ? 0.5 : 1)};
`;

export const CardTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
`;

export const CardDescription = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0 0 0.75rem 0;
  line-height: 1.5;
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Tag = styled.span`
  background: #f3f4f6;
  color: #4b5563;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 500;
`;

export const AddButton = styled.button`
  margin: 0 1rem 1rem;
  padding: 0.75rem;
  background: transparent;
  border: 2px dashed #e5e7eb;
  border-radius: 6px;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #d1d5db;
    color: #4b5563;
    background: #f9fafb;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  resize: vertical;
  min-height: 60px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  background: ${({ primary }) => (primary ? "#1a1a1a" : "#f3f4f6")};
  color: ${({ primary }) => (primary ? "white" : "#6b7280")};
`;