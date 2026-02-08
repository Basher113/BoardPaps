import styled from 'styled-components';

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

export const Input = styled.input`
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`;

export const TextArea = styled.textarea`
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 60px;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

export const ColorPicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const ColorOption = styled.button`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: ${props => props.color};
  border: 2px solid ${props => props.selected ? '#111827' : 'transparent'};
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  padding: 0;

  &:hover {
    transform: scale(1.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
