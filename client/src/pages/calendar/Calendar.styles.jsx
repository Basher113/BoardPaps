import styled from 'styled-components';

export const CalendarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px);
  padding: 24px;
  background: ${({ theme }) => theme?.colors?.background || '#f8fafc'};
`;

export const ComingSoonCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 480px;
  padding: 48px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  text-align: center;
`;

export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  margin-bottom: 24px;
  background: #1f2937;
  border-radius: 50%;
  color: white;
  
  svg {
    width: 64px;
    height: 64px;
  }
`;

export const Title = styled.h1`
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
`;

export const Subtitle = styled.span`
  display: inline-block;
  padding: 6px 16px;
  margin-bottom: 24px;
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  background: #000000;
  border-radius: 9999px;
`;

export const Description = styled.p`
  margin: 0 0 32px 0;
  font-size: 16px;
  line-height: 1.6;
  color: #6b7280;
`;

export const FeatureList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 8px;
`;

export const FeatureIcon = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  background: white;
  border-radius: 8px;
  color: #374151;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const FeatureText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;
