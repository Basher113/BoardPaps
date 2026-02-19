import styled from 'styled-components';

export const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #fafafa 0%, #f4f4f5 100%);
`;

export const ErrorContent = styled.div`
  max-width: 480px;
  width: 100%;
  text-align: center;
  background: #ffffff;
  border-radius: 16px;
  padding: 3rem 2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid #e4e4e7;
`;

export const ErrorIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #fef2f2;
  color: #dc2626;
  margin-bottom: 1.5rem;
`;

export const ErrorTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #18181b;
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.02em;
`;

export const ErrorMessage = styled.p`
  font-size: 0.9375rem;
  color: #71717a;
  line-height: 1.6;
  margin: 0 0 2rem 0;
`;

export const ErrorActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
`;

export const RetryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffffff;
  background: #18181b;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;

  &:hover {
    background: #27272a;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const HomeButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #18181b;
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.1s ease;

  &:hover {
    background: #fafafa;
    border-color: #a1a1aa;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const ErrorDetails = styled.div`
  margin-top: 2rem;
  text-align: left;
`;

export const ErrorDetailsToggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  color: #a1a1aa;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;

  &:hover {
    color: #71717a;
  }
`;

export const ErrorDetailsContent = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e4e4e7;
  overflow: auto;
  max-height: 200px;

  p {
    margin: 0 0 0.5rem 0;
    font-size: 0.75rem;
    color: #71717a;
  }

  strong {
    color: #3f3f46;
  }

  pre {
    margin: 0.5rem 0 0 0;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Mono', monospace;
    font-size: 0.6875rem;
    color: #dc2626;
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.5;
  }
`;
