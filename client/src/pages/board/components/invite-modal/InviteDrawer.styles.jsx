import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Overlay
export const DrawerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(2px);
  z-index: 100;
  animation: ${fadeIn} 0.3s ease;
`;

// Drawer
export const InviteDrawerContainer = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  width: 100%;
  max-width: 600px;
  background: white;
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 101;
  animation: ${slideIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 640px) {
    max-width: 100%;
  }
`;

// Header
export const DrawerHeader = styled.header`
  padding: 2rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ProjectKey = styled.span`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  color: #808080;
  background: #f5f5f5;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  letter-spacing: 0.5px;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #b0b0b0;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: #f5f5f5;
    color: #1a1a1a;
  }
`;

export const DrawerTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
  letter-spacing: -0.5px;
  margin: 0;
`;

// Content
export const DrawerContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #d0d0d0;
  }
`;

// Section
export const Section = styled.section``;

export const SectionTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 700;
  color: #b0b0b0;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #f0f0f0;
  }
`;

// Input Group
export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const InputLabel = styled.label`
  font-size: 0.6875rem;
  font-weight: 700;
  color: #b0b0b0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// Email Input
export const EmailInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  font-size: 0.9375rem;
  font-family: inherit;
  background: #fafafa;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  &::placeholder {
    color: #b0b0b0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const HelperText = styled.p`
  font-size: 0.6875rem;
  color: #b0b0b0;
  font-style: italic;
  margin: 0;
`;

// Text Area
export const TextAreaCustom = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  font-size: 0.875rem;
  font-family: inherit;
  resize: none;
  background: #fafafa;
  transition: all 0.3s ease;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  &::placeholder {
    color: #b0b0b0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Role Select
export const RoleSelect = styled.select`
  width: 100%;
  padding: 0.75rem 0;
  border: none;
  border-bottom: 1px solid #e8e8e8;
  font-size: 0.875rem;
  font-weight: 600;
  outline: none;
  background: transparent;
  cursor: pointer;
  color: #1a1a1a;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #1a1a1a;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Footer
export const DrawerFooter = styled.footer`
  padding: 1.5rem 2rem;
  border-top: 1px solid #f0f0f0;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FooterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

// Error Message
export const ErrorMessage = styled.span`
  color: #ff4444;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;
