import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const SignUpWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const LogoContainer = styled.div`
  margin-bottom: 1.5rem;
`;

export const Logo = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 0.75rem;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #18181b;
  margin-bottom: 0.375rem;
  text-align: center;
`;

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #71717a;
  margin-bottom: 1.5rem;
  text-align: center;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #18181b;
`;

export const Input = styled.input`
  padding: 0.625rem 0.75rem;
  border: 1px solid ${props => props.$hasError ? '#ef4444' : '#e4e4e7'};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #18181b;
  background-color: #ffffff;
  transition: all 0.15s ease;
  outline: none;

  &:focus {
    border-color: #18181b;
    box-shadow: 0 0 0 1px #18181b;
  }

  &::placeholder {
    color: #a1a1aa;
  }
`;

export const ErrorMessage = styled.span`
  font-size: 0.875rem;
  color: #ef4444;
  margin-top: 0.25rem;
`;

export const SubmitButton = styled.button`
  padding: 0.625rem 1rem;
  background-color: #18181b;
  color: #fafafa;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    background-color: #27272a;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FooterText = styled.p`
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #71717a;
  text-align: center;
`;

export const FooterLink = styled(Link)`
  color: #18181b;
  font-weight: 500;
  text-decoration: none;
  border-bottom: 1px solid #18181b;

  &:hover {
    text-decoration: none;
  }
`;
