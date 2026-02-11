import styled, { keyframes } from "styled-components";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const StyledCTASection = styled.section`
  padding: 6rem 1.5rem;
  background: #18181b;
  text-align: center;
`;

export const CTAContent = styled.div`
  max-width: 48rem;
  margin: 0 auto;
`;

export const CTATitle = styled.h2`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 1.25rem;
  animation: ${fadeInUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
`;

export const CTAText = styled.p`
  font-size: 1.125rem;
  color: #a1a1aa;
  margin-bottom: 2rem;
  line-height: 1.6;
  animation: ${fadeInUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
`;

export const CTAButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 3.5rem;
  padding: 0 2.5rem;
  background: #ffffff;
  color: #18181b;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
  animation: ${fadeInUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;

  &:hover {
    background: #e4e4e7;
  }

  &:active {
    transform: scale(0.97);
  }
`;
