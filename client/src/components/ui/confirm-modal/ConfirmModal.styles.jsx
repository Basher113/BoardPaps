import styled, { css } from 'styled-components';

const getVariantStyles = (variant) => {
  switch (variant) {
    case 'danger':
      return css`
        background-color: #fef2f2;
        color: #ef4444;
      `;
    case 'warning':
      return css`
        background-color: #fafafa;
        color: #52525b;
      `;
    default:
      return css`
        background-color: #fafafa;
        color: #52525b;
      `;
  }
};

export const ConfirmContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem 0;
`;

export const ConfirmIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  ${props => getVariantStyles(props.$variant)}
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

export const ConfirmMessage = styled.p`
  color: #52525b;
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
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid #e4e4e7;
  background-color: #ffffff;
  color: #18181b;

  &:hover:not(:disabled) {
    background-color: #f4f4f5;
  }

  &:focus {
    outline: 2px solid #18181b;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ConfirmButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
  background-color: ${props => {
    switch (props.$variant) {
      case 'danger':
        return '#ef4444';
      case 'warning':
        return '#52525b';
      default:
        return '#18181b';
    }
  }};
  color: #fafafa;

  &:hover:not(:disabled) {
    background-color: ${props => {
      switch (props.$variant) {
        case 'danger':
          return '#dc2626';
        case 'warning':
          return '#3f3f46';
        default:
          return '#27272a';
      }
    }};
  }

  &:focus {
    outline: 2px solid #18181b;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
