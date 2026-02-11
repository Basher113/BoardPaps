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

const underlineDraw = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

export const HeroWrapper = styled.section`
  padding-top: 10rem;
  padding-bottom: 4rem;
  text-align: center;

  @media (min-width: 768px) {
    padding-top: 12rem;
    padding-bottom: 6rem;
  }
`;

export const HeroContent = styled.div`
  max-width: 48rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

export const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 6vw, 4.25rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: #18181b;
  animation: ${fadeInUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
`;

export const AnimatedWord = styled.span`
  position: relative;
  display: inline-block;

  &::after {
    content: "";
    position: absolute;
    bottom: 2px;
    left: 0;
    height: 4px;
    background: #18181b;
    border-radius: 2px;
    animation: ${underlineDraw} 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s both;
  }

  @media (min-width: 768px) {
    &::after {
      height: 5px;
      bottom: 4px;
    }
  }
`;

export const HeroText = styled.p`
  font-size: 1.175rem;
  line-height: 1.65;
  color: #71717a;
  max-width: 32rem;
  animation: ${fadeInUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;

  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const HeroActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
  animation: ${fadeInUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
`;

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 3.25rem;
  padding: 0 2rem;
  background: #18181b;
  color: #fafafa;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;

  &:hover {
    background: #27272a;
  }

  &:active {
    transform: scale(0.97);
  }
`;

export const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 3.25rem;
  padding: 0 2rem;
  background: transparent;
  color: #18181b;
  border: 1px solid #d4d4d8;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease,
    transform 0.1s ease;

  &:hover {
    border-color: #a1a1aa;
    background: #f4f4f5;
  }

  &:active {
    transform: scale(0.97);
  }
`;
