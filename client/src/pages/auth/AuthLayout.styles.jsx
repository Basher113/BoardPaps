import styled from 'styled-components';

export const AuthLayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
`;

export const FormContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  background-color: #fafafa;

  @media (max-width: 1024px) {
    padding: 1.5rem;
  }
`;

export const FormContent = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

export const HeroContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  background-color: #18181b;

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const HeroContent = styled.div`
  text-align: center;
  color: #fafafa;
  padding: 2rem;
`;

export const HeroTitle = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

export const HeroSubtitle = styled.p`
  font-size: 1rem;
  color: #a1a1aa;
  max-width: 400px;
`;

export const HeroImage = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.3;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #18181b 0%, #27272a 100%);
  }
`;
