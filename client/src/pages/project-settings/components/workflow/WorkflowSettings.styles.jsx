import styled from 'styled-components';

// Section Card
export const SectionCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 1rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin: 0;

  &::before {
    content: '';
    width: 4px;
    height: 18px;
    background: #1a1a1a;
    border-radius: 2px;
  }
`;

export const SectionDesc = styled.p`
  font-size: 0.8125rem;
  color: #808080;
  margin: 0;
`;

// Form Elements
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FormLabel = styled.label`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const FormInput = styled.input`
  padding: 0.75rem 0.875rem;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  font-size: 0.875rem;
  font-family: inherit;
  color: #1a1a1a;
  background: #fafafa;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    background: white;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Column List
export const ColumnList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ColumnItem = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid ${props => props.$isDragging ? '#1a1a1a' : '#f0f0f0'};
  border-radius: 10px;
  background: ${props => props.$isDragging ? '#f5f5f5' : '#fafafa'};
  transition: all 0.2s ease;
  cursor: ${props => props.$canEdit ? 'grab' : 'default'};

  &:hover {
    border-color: #1a1a1a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  ${props => props.$isDragging && `
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: scale(1.02);
  `}
`;

export const DragHandle = styled.span`
  color: #b0b0b0;
  cursor: grab;
  display: flex;
  align-items: center;
  padding: 0.25rem;
  
  &:active {
    cursor: grabbing;
  }

  ${props => props.$disabled && `
    opacity: 0.3;
    cursor: default;
  `}
`;

export const ColumnNameInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid transparent;
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: inherit;
  color: #1a1a1a;
  background: transparent;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #e8e8e8;
    background: white;
  }

  &:disabled {
    opacity: 1;
    cursor: default;
  }
`;

export const ColumnBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #f5f5f5;
  color: #707070;
  border: 1px solid #e0e0e0;
  white-space: nowrap;
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  color: #b0b0b0;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    color: #ff4444;
    background: #fff5f5;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

// Add Column Button
export const AddColumnButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px dashed #d0d0d0;
  border-radius: 10px;
  background: transparent;
  color: #808080;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    border-color: #1a1a1a;
    color: #1a1a1a;
    background: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// New Column Form
export const NewColumnForm = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #1a1a1a;
  border-radius: 10px;
  background: white;
`;

export const NewColumnInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: inherit;
  color: #1a1a1a;
  background: transparent;
  outline: none;

  &::placeholder {
    color: #c0c0c0;
  }
`;

export const FormButton = styled.button`
  padding: 0.5rem 0.875rem;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.$primary ? `
    background: #1a1a1a;
    color: white;

    &:hover:not(:disabled) {
      background: #2d2d2d;
    }
  ` : `
    background: #f5f5f5;
    color: #808080;

    &:hover:not(:disabled) {
      background: #e8e8e8;
      color: #1a1a1a;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Empty State
export const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #808080;
  font-size: 0.875rem;
`;

// Helper Text
export const HelperText = styled.p`
  font-size: 0.6875rem;
  color: #b0b0b0;
  font-style: italic;
  margin: 0;
`;
