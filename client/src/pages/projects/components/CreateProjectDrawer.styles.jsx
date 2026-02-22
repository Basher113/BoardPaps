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
export const DrawerContainer = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  width: 100%;
  max-width: 800px;
  background: white;
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 101;
  animation: ${slideIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 840px) {
    max-width: 100%;
  }
`;

// Header
export const DrawerHeader = styled.header`
  padding: 2rem 2.5rem;
  border-bottom: 1px solid #f0f0f0;
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const ProjectTag = styled.span`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #808080;
  background: #f5f5f5;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
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
  font-size: 3rem;
  font-weight: 900;
  color: #1a1a1a;
  letter-spacing: -0.05em;
  margin: 0 0 0.5rem;
  line-height: 1.1;

  @media (max-width: 640px) {
    font-size: 2rem;
  }
`;

export const DrawerSubtitle = styled.p`
  font-size: 1.125rem;
  color: #808080;
  margin: 0;
  line-height: 1.5;
`;

// Content
export const DrawerContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

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
export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// Input Group
export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const InputLabel = styled.label`
  font-size: 0.625rem;
  font-weight: 700;
  color: #808080;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const TitleInput = styled.input`
  width: 100%;
  font-size: 1.125rem;
  font-weight: 500;
  border: none;
  border-bottom: 2px solid #e0e0e0;
  padding: 0.75rem 0;
  color: #1a1a1a;
  outline: none;
  transition: border-color 0.3s ease;
  background: transparent;

  &:focus {
    border-color: #1a1a1a;
  }

  &::placeholder {
    color: #c0c0c0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const KeyInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const KeyInput = styled.input`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-bottom: 1px solid #e0e0e0;
  padding: 0.75rem 0;
  color: #1a1a1a;
  outline: none;
  transition: border-color 0.3s ease;
  background: #fafafa;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  border-radius: 4px;
  width: 120px;
  text-transform: uppercase;

  &:focus {
    border-color: #1a1a1a;
    background: white;
    box-shadow: inset 0 0 0 1px #1a1a1a;
  }

  &::placeholder {
    color: #c0c0c0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const AutoBadge = styled.span`
  font-size: 0.5625rem;
  font-weight: 600;
  color: #808080;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// Divider
export const Divider = styled.div`
  height: 1px;
  background: #f0f0f0;
  width: 100%;
`;

// Description Textarea
export const DescriptionTextarea = styled.textarea`
  width: 100%;
  font-size: 0.9375rem;
  font-weight: 400;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 1rem;
  color: #1a1a1a;
  outline: none;
  transition: all 0.3s ease;
  background: #fafafa;
  resize: none;
  min-height: 120px;
  line-height: 1.6;

  &:focus {
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

// Footer
export const DrawerFooter = styled.footer`
  padding: 1.5rem 2.5rem;
  border-top: 1px solid #f0f0f0;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FooterLeft = styled.div``;

export const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #808080;
  cursor: pointer;
  padding: 1rem;
  transition: color 0.3s ease;

  &:hover:not(:disabled) {
    color: #1a1a1a;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #1a1a1a;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: scale(1.02);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;
