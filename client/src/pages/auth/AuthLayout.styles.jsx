import styled from "styled-components";

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
  background: var(--background);
  

`;

export const FormContent = styled.div`
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  padding: 1rem;
`;

export const HeroContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;

  @media (max-width: 1024px) {
    display: none;
  }

`;

export const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;

  animation: pulse 10s ease-in-out infinite;
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
  }
`;

