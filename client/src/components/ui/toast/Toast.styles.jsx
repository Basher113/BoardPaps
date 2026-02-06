import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const ToastContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
  width: 100%;
  pointer-events: none;

  @media (max-width: 640px) {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
`;

const getTypeColor = (type) => {
  switch (type) {
    case 'success':
      return '#10b981';
    case 'error':
      return '#ef4444';
    case 'warning':
      return '#f59e0b';
    default:
      return '#3b82f6';
  }
};

const getTypeBgColor = (type) => {
  switch (type) {
    case 'success':
      return '#ecfdf5';
    case 'error':
      return '#fef2f2';
    case 'warning':
      return '#fffbeb';
    default:
      return '#eff6ff';
  }
};

export const ToastWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background-color: ${props => getTypeBgColor(props.$type)};
  border: 1px solid ${props => getTypeColor(props.$type)}20;
  border-left: 4px solid ${props => getTypeColor(props.$type)};
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  animation: ${slideIn} 0.3s ease-out;
  pointer-events: auto;
`;

export const ToastIcon = styled.div`
  flex-shrink: 0;
  color: ${props => getTypeColor(props.$type)};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ToastContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ToastTitle = styled.p`
  font-weight: 600;
  font-size: 0.875rem;
  color: #111827;
  margin: 0;
`;

export const ToastMessage = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
  word-wrap: break-word;
`;

export const ToastCloseButton = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #9ca3af;
  transition: color 0.2s;

  &:hover {
    color: #4b5563;
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
    border-radius: 0.25rem;
  }
`;
