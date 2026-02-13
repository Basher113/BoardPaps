import styled from 'styled-components';

export const BoardContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  overflow-x: auto;
  padding: 2rem;
  height: calc(100vh - 65px);
`;

export const Column = styled.div`
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

export const Count = styled.span`
  background-color: #e4e4e7;
  color: #52525b;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
`;

export const CardList = styled.div`
  padding: 0.75rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 100px;
  overflow: auto;

`;

export const Card = styled.div`
  background-color: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 0.375rem;
  padding: 0.75rem;
  cursor: ${props => props.$canEdit ? 'grab' : 'default'};
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;

  transition: all 0.15s ease;
  opacity: ${props => props.$canEdit ? 1 : 0.5};
  &:hover {
    border-color: #d4d4d8;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

export const CardTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: #18181b;
  margin: 0 0 0.375rem 0;
`;

export const CardDescription = styled.p`
  font-size: 0.75rem;
  color: #71717a;
  margin: 0 0 0.75rem 0;
  line-height: 1.5;
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Tag = styled.span`
  background-color: #f4f4f5;
  color: #52525b;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
`;

export const AddButton = styled.button`
  margin: 0.75rem;
  padding: 0.5rem;
  background: transparent;
  border: 1px dashed #d4d4d8;
  border-radius: 0.375rem;
  color: #71717a;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;

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
