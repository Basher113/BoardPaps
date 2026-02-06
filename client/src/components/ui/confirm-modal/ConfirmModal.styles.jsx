import styled from 'styled-components';

const getVariantColor = (variant) => {
  switch (variant) {
    case 'danger':
      return '#dc2626';
    case 'warning':
      return '#f59e0b';
    default:
      return '#3b82f6';
  }
};

const getVariantBgColor = (variant) => {
  switch (variant) {
    case 'danger':
      return '#fef2f2';
    case 'warning':
      return '#fffbeb';
    default:
      return '#eff6ff';
  }
};

export const ConfirmContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem 0;
`;

export const ConfirmIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: ${props => getVariantBgColor(props.$variant)};
  color: ${props => getVariantColor(props.$variant)};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

export const ConfirmMessage = styled.p`
  color: #4b5563;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 1.5rem 0;
  max-width: 300px;
`;

export const ConfirmActions = styled.div`
  display: flex;
  gap: 0.75rem;
  width: 100%;
  justify-content: center;
`;

export const CancelButton = styled.button`
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #d1d5db;
  background-color: white;
  color: #374151;

  &:hover:not(:disabled) {
    background-color: #f9fafb;
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

export const ConfirmButton = styled.button`
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background-color: ${props => getVariantColor(props.$variant)};
  color: white;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:focus {
    outline: 2px solid ${props => getVariantColor(props.$variant)};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
