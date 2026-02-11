import styled, { keyframes } from 'styled-components';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

export const SettingsContainer = styled.div`
  width: 100%;
  max-width: 1440px;
  padding: 3rem 2rem;
  animation: ${fadeIn} 0.4s ease-out;
  margin: 0 auto;
`;

export const SettingsHeader = styled.div`
  margin-bottom: 2rem;
`;

export const SettingsTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #18181b;
  margin: 0 0 0.5rem 0;
`;

export const SettingsSubtitle = styled.p`
  font-size: 0.875rem;
  color: #71717a;
  margin: 0;
`;

export const Section = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e4e4e7;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease-out;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f4f4f5;
`;

export const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #18181b;
  margin: 0 0 0.25rem 0;
`;

export const SectionDescription = styled.p`
  font-size: 0.8125rem;
  color: #71717a;
  margin: 0;
  line-height: 1.5;
`;

export const SectionContent = styled.div`
  padding: 1.5rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #3f3f46;
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export const RequiredMark = styled.span`
  color: #ef4444;
  font-size: 0.75rem;
`;

export const Input = styled.input`
  height: 2.75rem;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e4e4e7;
  background-color: #fafafa;
  padding: 0 1rem;
  font-size: 0.9375rem;
  color: #18181b;
  transition: all 0.2s ease;
  outline: none;

  &::placeholder {
    color: #a1a1aa;
  }

  &:hover:not(:disabled) {
    border-color: #d4d4d8;
    background-color: #ffffff;
  }

  &:focus {
    border-color: #18181b;
    background-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(24, 24, 27, 0.08);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    background-color: #f4f4f5;
  }
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
  outline: none;
  padding: 0.625rem 1.25rem;

  ${props => props.$variant === 'destructive' ? `
    background-color: #fef2f2;
    border-color: #fecaca;
    color: #dc2626;
    &:hover:not(:disabled) { 
      background-color: #fee2e2; 
      border-color: #fca5a5;
    }
    &:active:not(:disabled) { 
      background-color: #fecaca; 
    }
  ` : props.$variant === 'outline' ? `
    background-color: #ffffff;
    border-color: #e4e4e7;
    color: #3f3f46;
    &:hover:not(:disabled) { 
      background-color: #fafafa; 
      border-color: #d4d4d8;
    }
  ` : props.$variant === 'ghost' ? `
    background-color: transparent;
    color: #71717a;
    &:hover:not(:disabled) { 
      background-color: #f4f4f5; 
      color: #18181b;
    }
  ` : `
    background-color: #18181b;
    color: #ffffff;
    &:hover:not(:disabled) { 
      background-color: #27272a; 
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    }
    &:active:not(:disabled) { 
      background-color: #3f3f46; 
      transform: translateY(0);
    }
  `}

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #f4f4f5;
  margin-top: 0.5rem;
`;

export const ErrorMessage = styled.span`
  font-size: 0.8125rem;
  color: #ef4444;
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export const SuccessMessage = styled.span`
  font-size: 0.875rem;
  color: #16a34a;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.75rem 1rem;
  background: #f0fdf4;
  border-radius: 8px;
  margin-top: -0.5rem;
`;

export const MetaInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 1rem 1.125rem;
  background: #fafafa;
  border-radius: 10px;
  margin-top: 1.5rem;
`;

export const MetaItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid #e4e4e7;
  }
`;

export const MetaLabel = styled.span`
  font-size: 0.875rem;
  color: #71717a;
`;

export const MetaValue = styled.span`
  font-size: 0.875rem;
  color: #18181b;
  font-weight: 500;
`;

export const DangerZone = styled.div`
  border: 1px solid #fecaca;
  border-radius: 12px;
  background: linear-gradient(to bottom, #fffbeb 0%, #fef2f2 100%);
  overflow: hidden;
`;

export const DangerHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #fecaca;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

export const DangerIconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #fef2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const DangerTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #dc2626;
  margin: 0 0 0.25rem 0;
`;

export const DangerDescription = styled.p`
  font-size: 0.875rem;
  color: #991b1b;
  margin: 0;
  line-height: 1.5;
`;

export const DangerContent = styled.div`
  padding: 1.5rem;
  background: #ffffff;
`;

export const LoadingSkeleton = styled.div`
  background: linear-gradient(90deg, #f4f4f5 25%, #e4e4e7 50%, #f4f4f5 75%);
  background-size: 200% 100%;
  border-radius: 8px;
  height: ${props => props.$height || '1rem'};
  width: ${props => props.$width || '100%'};
  animation: ${shimmer} 1.5s infinite;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  color: #71717a;
`;

export const EmptyStateIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f4f4f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: #a1a1aa;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e4e4e7;
  margin: 1.5rem 0;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

export const HelperText = styled.span`
  font-size: 0.8125rem;
  color: #71717a;
  margin-top: 0.25rem;
`;

export const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

// Modal Styles
export const ModalFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ModalLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #3f3f46;
`;

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #fef2f2;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

export const CheckboxInput = styled.input`
  width: 1.125rem;
  height: 1.125rem;
  margin-top: 0.125rem;
  cursor: pointer;
  accent-color: #dc2626;
  border-radius: 4px;
  border: 1px solid #fca5a5;
`;

export const CheckboxText = styled.span`
  font-size: 0.875rem;
  color: #991b1b;
  line-height: 1.5;
`;
