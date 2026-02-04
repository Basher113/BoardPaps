import { Link } from "react-router-dom";
import styled from "styled-components";

export const SignInWrapper = styled.div`
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
  border-radius: 12px;
`;

export const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
  text-align: center;
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 2rem;
  text-align: center;
`;

export const Form = styled.form`
  width: 100%;
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
  color: #374151;
`;

export const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${(props) => (props.$hasError ? "#ef4444" : "#d1d5db")};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #111827;
  background-color: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const ErrorMessage = styled.span`
  font-size: 0.875rem;
  color: ${(props) => (props.type === "submit" ? "#dc2626" : "#ef4444")};
  margin-top: 0.25rem;
`;

export const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    background-color: #1d4ed8;
    transform: scale(1.02);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FooterText = styled.p`
  margin-top: 2rem;
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
`;

export const FooterLink = styled(Link)`
  color: #2563eb;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
