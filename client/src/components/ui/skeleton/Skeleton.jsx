import React from 'react';
import styled, { keyframes } from 'styled-components';

/**
 * Skeleton Component Library
 * Reusable skeleton loaders for consistent loading states across the app
 */

// Shimmer animation
const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Base skeleton element
export const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: ${props => props.$radius || '4px'};
  display: inline-block;
`;

// Text skeleton - for lines of text
export const SkeletonText = styled(SkeletonBase)`
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '14px'};
  margin-bottom: ${props => props.$mb || '0'};
`;

// Circle skeleton - for avatars
export const SkeletonCircle = styled(SkeletonBase)`
  width: ${props => props.$size || '40px'};
  height: ${props => props.$size || '40px'};
  border-radius: 50%;
`;

// Rectangle skeleton - for cards, images
export const SkeletonRect = styled(SkeletonBase)`
  width: ${props => props.$width || '100%'};
  height: ${props => props.$height || '100px'};
  border-radius: ${props => props.$radius || '8px'};
`;

// Button skeleton
export const SkeletonButton = styled(SkeletonBase)`
  width: ${props => props.$width || '80px'};
  height: ${props => props.$height || '36px'};
  border-radius: 8px;
`;

// Badge skeleton
export const SkeletonBadge = styled(SkeletonBase)`
  width: ${props => props.$width || '50px'};
  height: ${props => props.$height || '20px'};
  border-radius: 4px;
`;

// Container for skeleton layouts
export const SkeletonContainer = styled.div`
  display: ${props => props.$display || 'flex'};
  flex-direction: ${props => props.$direction || 'column'};
  gap: ${props => props.$gap || '1rem'};
  padding: ${props => props.$padding || '0'};
  width: 100%;
`;

// Row container
export const SkeletonRow = styled.div`
  display: flex;
  align-items: ${props => props.$align || 'center'};
  gap: ${props => props.$gap || '0.5rem'};
  justify-content: ${props => props.$justify || 'flex-start'};
`;

// ============ PRE-BUILT SKELETON COMPONENTS ============

// Project Card Skeleton
export const ProjectCardSkeleton = () => (
  <ProjectCardSkeletonWrapper>
    <SkeletonRow $justify="space-between">
      <SkeletonRow $gap="0.5rem">
        <SkeletonCircle $size="32px" />
        <div>
          <SkeletonText $width="120px" $height="16px" $mb="4px" />
          <SkeletonText $width="60px" $height="12px" />
        </div>
      </SkeletonRow>
      <SkeletonCircle $size="24px" />
    </SkeletonRow>
    <SkeletonText $width="100%" $height="12px" $mb="4px" />
    <SkeletonText $width="80%" $height="12px" $mb="8px" />
    <SkeletonRow $justify="space-between">
      <SkeletonRow $gap="0.5rem">
        <SkeletonCircle $size="24px" />
        <SkeletonCircle $size="24px" />
        <SkeletonCircle $size="24px" />
      </SkeletonRow>
      <SkeletonBadge $width="40px" />
    </SkeletonRow>
  </ProjectCardSkeletonWrapper>
);

const ProjectCardSkeletonWrapper = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

// Invitation Card Skeleton
export const InvitationCardSkeleton = () => (
  <InvitationCardSkeletonWrapper>
    <SkeletonRow $justify="space-between">
      <SkeletonRow $gap="0.75rem">
        <SkeletonCircle $size="40px" />
        <div>
          <SkeletonText $width="150px" $height="16px" $mb="4px" />
          <SkeletonText $width="100px" $height="12px" />
        </div>
      </SkeletonRow>
      <SkeletonBadge $width="60px" />
    </SkeletonRow>
    <SkeletonText $width="200px" $height="12px" />
    <SkeletonRow $justify="space-between">
      <SkeletonText $width="100px" $height="12px" />
      <SkeletonRow $gap="0.5rem">
        <SkeletonButton $width="70px" $height="32px" />
        <SkeletonButton $width="70px" $height="32px" />
      </SkeletonRow>
    </SkeletonRow>
  </InvitationCardSkeletonWrapper>
);

const InvitationCardSkeletonWrapper = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

// Member Row Skeleton
export const MemberRowSkeleton = () => (
  <MemberRowSkeletonWrapper>
    <SkeletonRow $gap="0.75rem">
      <SkeletonCircle $size="36px" />
      <div>
        <SkeletonText $width="120px" $height="14px" $mb="4px" />
        <SkeletonText $width="150px" $height="12px" />
      </div>
    </SkeletonRow>
    <SkeletonBadge $width="60px" />
    <SkeletonRow $gap="0.5rem">
      <SkeletonButton $width="60px" $height="28px" />
      <SkeletonButton $width="60px" $height="28px" />
    </SkeletonRow>
  </MemberRowSkeletonWrapper>
);

const MemberRowSkeletonWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

// Activity Item Skeleton
export const ActivityItemSkeleton = () => (
  <ActivityItemSkeletonWrapper>
    <SkeletonCircle $size="32px" />
    <div style={{ flex: 1 }}>
      <SkeletonText $width="80%" $height="14px" $mb="4px" />
      <SkeletonText $width="40%" $height="12px" />
    </div>
  </ActivityItemSkeletonWrapper>
);

const ActivityItemSkeletonWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
`;

// Settings Section Skeleton
export const SettingsSectionSkeleton = () => (
  <SettingsSectionSkeletonWrapper>
    <SkeletonText $width="150px" $height="20px" $mb="0.5rem" />
    <SkeletonText $width="250px" $height="14px" $mb="1.5rem" />
    <SkeletonContainer $gap="1rem">
      <SkeletonRow $gap="1rem">
        <SkeletonText $width="100px" $height="14px" />
        <SkeletonRect $width="200px" $height="40px" />
      </SkeletonRow>
      <SkeletonRow $gap="1rem">
        <SkeletonText $width="100px" $height="14px" />
        <SkeletonRect $width="200px" $height="40px" />
      </SkeletonRow>
      <SkeletonButton $width="100px" $height="36px" />
    </SkeletonContainer>
  </SettingsSectionSkeletonWrapper>
);

const SettingsSectionSkeletonWrapper = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

// ============ SPINNER COMPONENT ============

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.div`
  width: ${props => props.$size || '24px'};
  height: ${props => props.$size || '24px'};
  border: 3px solid #e5e7eb;
  border-top-color: #1d1d1d;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

// Loading Container with spinner and text
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.$padding || '3rem'};
  gap: 1rem;
  min-height: ${props => props.$minHeight || '200px'};
`;

export const LoadingText = styled.span`
  color: #6b7280;
  font-size: 0.875rem;
`;

// Full page loading
export const FullPageLoading = ({ text = 'Loading...' }) => (
  <FullPageLoadingWrapper>
    <Spinner $size="60px" />
    <LoadingText>{text}</LoadingText>
  </FullPageLoadingWrapper>
);

const FullPageLoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1rem;
  background: #f9fafb;
`;

// Inline loading for buttons
export const ButtonSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin-right: 0.5rem;
`;

export default {
  SkeletonBase,
  SkeletonText,
  SkeletonCircle,
  SkeletonRect,
  SkeletonButton,
  SkeletonBadge,
  SkeletonContainer,
  SkeletonRow,
  ProjectCardSkeleton,
  InvitationCardSkeleton,
  MemberRowSkeleton,
  ActivityItemSkeleton,
  SettingsSectionSkeleton,
  Spinner,
  LoadingContainer,
  LoadingText,
  FullPageLoading,
  ButtonSpinner,
};
