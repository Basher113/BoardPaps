import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  position: relative;
`;

export const MainContent = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
  padding: 40px 24px;
`;

export const ErrorContent = styled.div`
  position: relative;
  z-index: 10;
  max-width: 600px;
  width: 100%;
  text-align: center;
  animation: ${fadeInUp} 0.6s ease-out;
`;

export const ErrorCode = styled.div`
  font-size: clamp(64px, 15vw, 120px);
  font-weight: 900;
  line-height: 1;
  color: #000;
  margin-bottom: 24px;
  letter-spacing: -2px;
`;

export const ErrorDivider = styled.div`
  width: 48px;
  height: 2px;
  background: #000;
  margin: 0 auto 32px;
`;

export const ErrorTitle = styled.h1`
  font-size: clamp(24px, 5vw, 42px);
  font-weight: 600;
  line-height: 1.3;
  color: #1a1a1a;
  margin: 0 0 16px 0;
  letter-spacing: -0.5px;
`;

export const ErrorMessage = styled.p`
  font-size: 16px;
  font-weight: 400;
  color: #666;
  margin: 0 0 40px 0;
  line-height: 1.6;
  letter-spacing: 0.2px;
`;

export const ErrorReference = styled.div`
  font-size: 12px;
  color: #999;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 40px;
`;

export const CurrentPath = styled.div`
  font-size: 13px;
  color: #999;
  background: #fafafa;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 32px;
  border: 1px solid #e5e5e5;
  word-break: break-all;
  
  span {
    color: #666;
    font-weight: 500;
  }
`;

export const ErrorActions = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const PrimaryButton = styled.button`
  padding: 14px 32px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  background: #000;
  color: white;

  &:hover {
    background: #1a1a1a;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

export const SecondaryButton = styled.button`
  padding: 14px 32px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  background: #f5f5f5;
  color: #000;
  border: 1px solid #e0e0e0;

  &:hover {
    background: #efefef;
    border-color: #d0d0d0;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;
