import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
`;

export const RequiredMark = styled.span`
  color: #dc2626;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${props => props.$hasError ? '#dc2626' : '#d1d5db'};
  border-radius: 0.5rem;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: ${props => props.$hasError ? '#dc2626' : '#3b82f6'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(220, 38, 38, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }

  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${props => props.$hasError ? '#dc2626' : '#d1d5db'};
  border-radius: 0.5rem;
  outline: none;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: ${props => props.$hasError ? '#dc2626' : '#3b82f6'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(220, 38, 38, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }

  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
  background-color: white;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

export const FormActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
`;

export const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: ${props => props.variant === 'primary' ? 'none' : '1px solid #d1d5db'};
  background-color: ${props => props.variant === 'primary' ? '#2563eb' : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : '#374151'};

  &:hover:not(:disabled) {
    background-color: ${props => props.variant === 'primary' ? '#1d4ed8' : '#f9fafb'};
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;
