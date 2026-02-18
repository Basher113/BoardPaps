import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: ${props => props.$radius || '4px'};
`;

const BoardContainer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 2rem;
  height: calc(100vh - 65px);
`;

const ColumnSkeleton = styled.div`
  background-color: #ffffff;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 363px;
  max-width: 363px;
  min-height: 600px;
  max-height: 500px;
  border: 1px solid oklch(0.922 0 0);
  padding: 1rem;
  padding-bottom: 2rem;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
`;

const ColumnHeaderSkeleton = styled.div`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #cccccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.5rem 0.5rem 0 0;
  margin-bottom: 0.75rem;
`;

const ColumnTitleSkeleton = styled(SkeletonBase)`
  width: 80px;
  height: 14px;
`;

const CountSkeleton = styled(SkeletonBase)`
  width: 24px;
  height: 20px;
  border-radius: 9999px;
`;

const CardListSkeleton = styled.div`
  padding: 0.75rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CardSkeleton = styled.div`
  background-color: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 0.375rem;
  padding: 0.75rem;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
`;

const CardHeaderSkeleton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const CardIdSkeleton = styled(SkeletonBase)`
  width: 60px;
  height: 12px;
`;

const CardTitleSkeleton = styled(SkeletonBase)`
  width: ${props => props.$width || '80%'};
  height: 14px;
  margin-bottom: 0.5rem;
`;

const CardDescriptionSkeleton = styled(SkeletonBase)`
  width: 100%;
  height: 12px;
  margin-bottom: 0.25rem;
  
  &:last-child {
    width: 60%;
  }
`;

const CardFooterSkeleton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
`;

const BadgeSkeleton = styled(SkeletonBase)`
  width: 50px;
  height: 20px;
  border-radius: 4px;
`;

const AvatarSkeleton = styled(SkeletonBase)`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const HeaderSkeleton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  height: 65px;
`;

const HeaderLeftSkeleton = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HeaderTitleSkeleton = styled(SkeletonBase)`
  width: 150px;
  height: 20px;
`;

const HeaderSubtitleSkeleton = styled(SkeletonBase)`
  width: 100px;
  height: 14px;
  margin-top: 0.25rem;
`;

const HeaderRightSkeleton = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ButtonSkeleton = styled(SkeletonBase)`
  width: 80px;
  height: 36px;
  border-radius: 8px;
`;

const BoardSkeleton = ({ columnCount = 4, cardsPerColumn = 3 }) => {
  return (
    <>
      <HeaderSkeleton>
        <HeaderLeftSkeleton>
          <SkeletonBase $radius="4px" style={{ width: '24px', height: '24px' }} />
          <div>
            <HeaderTitleSkeleton />
            <HeaderSubtitleSkeleton />
          </div>
        </HeaderLeftSkeleton>
        <HeaderRightSkeleton>
          <SkeletonBase $radius="50%" style={{ width: '28px', height: '28px' }} />
          <ButtonSkeleton />
          <ButtonSkeleton />
        </HeaderRightSkeleton>
      </HeaderSkeleton>
      
      <BoardContainer>
        {Array.from({ length: columnCount }).map((_, columnIndex) => (
          <ColumnSkeleton key={columnIndex}>
            <ColumnHeaderSkeleton>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ColumnTitleSkeleton />
                <CountSkeleton />
              </div>
              <SkeletonBase $radius="4px" style={{ width: '24px', height: '24px' }} />
            </ColumnHeaderSkeleton>
            
            <CardListSkeleton>
              {Array.from({ length: cardsPerColumn }).map((_, cardIndex) => (
                <CardSkeleton key={cardIndex}>
                  <CardHeaderSkeleton>
                    <CardIdSkeleton />
                    <SkeletonBase $radius="4px" style={{ width: '16px', height: '16px' }} />
                  </CardHeaderSkeleton>
                  <CardTitleSkeleton $width={`${60 + Math.random() * 30}%`} />
                  <div>
                    <CardDescriptionSkeleton />
                    <CardDescriptionSkeleton />
                  </div>
                  <CardFooterSkeleton>
                    <BadgeSkeleton />
                    <AvatarSkeleton />
                  </CardFooterSkeleton>
                </CardSkeleton>
              ))}
            </CardListSkeleton>
          </ColumnSkeleton>
        ))}
      </BoardContainer>
    </>
  );
};

export default BoardSkeleton;
