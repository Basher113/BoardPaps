import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const DrawerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(2px);
  z-index: 100;
  animation: ${fadeIn} 0.3s ease;
`;

export const DrawerContainer = styled.div`
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
`;

export const DrawerHeader = styled.div`
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

export const ProjectTag = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: white;
  background: #18181b;
  padding: 4px 10px;
  border-radius: 4px;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #b0b0b0;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:hover {
    background: #f5f5f5;
    color: #18181b;
  }
`;

export const DrawerTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #18181b;
  letter-spacing: -0.5px;
  text-transform: uppercase;
  margin: 0;
`;

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
    background: #d0d0d0;
    border-radius: 10px;
  }
`;

export const FormSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;



export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InputLabel = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #808080;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const TitleInput = styled.input`
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  border: none;
  border-bottom: 2px solid ${props => props.$hasError ? '#dc2626' : '#18181b'};
  padding: 8px 0;
  color: #18181b;
  outline: none;
  text-transform: uppercase;
  transition: border-color 0.3s ease;
  background: transparent;

  &:focus {
    border-color: ${props => props.$hasError ? '#dc2626' : '#b0b0b0'};
  }

  &::placeholder {
    color: #e0e0e0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const GridParams = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

export const SelectCustom = styled.select`
  width: 100%;
  border: none;
  border-bottom: 1px solid #18181b;
  padding: 10px 0;
  font-size: 16px;
  font-weight: 600;
  outline: none;
  background: transparent;
  cursor: pointer;
  color: #18181b;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #b0b0b0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PersonnelWrapper = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #18181b;
  gap: 12px;
  transition: border-color 0.3s ease;

  &:focus-within {
    border-color: #b0b0b0;
  }
`;

export const PersonnelInput = styled.input`
  flex: 1;
  border: none;
  padding: 12px 0;
  font-size: 13px;
  font-weight: 600;
  outline: none;
  background: transparent;
  color: #18181b;

  &::placeholder {
    color: #c0c0c0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const AssigneeSelect = styled.select`
  flex: 1;
  border: none;
  padding: 12px 0;
  font-size: 16px;
  font-weight: 600;
  outline: none;
  background: transparent;
  cursor: pointer;
  color: #18181b;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const TextAreaCustom = styled.textarea`
  width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  line-height: 1.6;
  outline: none;
  resize: none;
  min-height: 160px;
  background: #fafafa;
  transition: all 0.3s ease;
  color: #18181b;

  &:focus {
    border-color: #18181b;
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  &::placeholder {
    color: #c0c0c0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DrawerFooter = styled.div`
  padding: 1.5rem 2rem;
  border-top: 1px solid #f0f0f0;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StatusMsg = styled.span`
  font-size: 9px;
  color: #b0b0b0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const ExecuteButton = styled.button`
  background: #18181b;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 4px 4px 0px #000;

  &:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px #000;
  }

  &:active:not(:disabled) {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px #000;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.span`
  color: #dc2626;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const DateInput = styled.input`
  width: 100%;
  border: none;
  border-bottom: 1px solid #18181b;
  padding: 10px 0;
  font-size: 16px;
  font-weight: 600;
  outline: none;
  background: transparent;
  cursor: pointer;
  color: #18181b;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #b0b0b0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.6;
    
    &:hover {
      opacity: 1;
    }
  }
`;

export const SearchIcon = styled.span`
  font-size: 16px;
  color: #808080;
`;
