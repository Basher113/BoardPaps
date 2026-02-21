import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Page Layout
export const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 2.5rem;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

// Header Section
export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 1.5rem;
  gap: 1rem;
  animation: ${fadeIn} 0.3s ease-out;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

export const HeaderLeft = styled.div``;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.5px;
  margin: 0 0 0.5rem 0;
`;

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #808080;
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }
`;

export const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const SearchIcon = styled.span`
  position: absolute;
  left: 0.875rem;
  color: #b0b0b0;
  pointer-events: none;
  display: flex;
  align-items: center;
`;

export const SearchInput = styled.input`
  padding: 0.625rem 1rem 0.625rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background: white;
  font-size: 0.8125rem;
  width: 280px;
  outline: none;
  transition: all 0.3s ease;

  &::placeholder {
    color: #b0b0b0;
  }

  &:focus {
    border-color: #1a1a1a;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const NewButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.625rem 1.25rem;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: #2d2d2d;
    box-shadow: 0 6px 16px rgba(26, 26, 26, 0.18);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

// Projects Container
export const ProjectsTable = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1fr;
  padding: 1rem 1.5rem;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #b0b0b0;

  @media (max-width: 1024px) {
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const TableHeaderCell = styled.div`
  &:last-child {
    text-align: right;
  }
`;

export const ProjectRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1fr;
  padding: 1.5rem;
  border-bottom: 1px solid #f8f8f8;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fafafa;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
`;

export const ProjectInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const ProjectIcon = styled.div`
  display: none;
`;

export const ProjectDetails = styled.div``;

export const ProjectName = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
`;

export const ProjectDescription = styled.span`
  font-size: 0.75rem;
  color: #808080;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const ProjectKey = styled.span`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.8125rem;
  color: #707070;
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  width: fit-content;

  @media (max-width: 768px) {
    grid-column: 1;
  }
`;

export const MemberAvatars = styled.div`
  display: flex;
  align-items: center;
  margin-left: 4px;

  > * {
    margin-left: -8px;
    
    &:first-child {
      margin-left: 0;
    }
  }

  @media (max-width: 768px) {
    grid-column: 1 / -1;
  }
`;

export const AvatarOverflow = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid white;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5625rem;
  font-weight: 700;
  color: white;
  margin-left: -8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const LastUpdated = styled.div`
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 2px;

  @media (max-width: 1024px) {
    text-align: left;
  }

  @media (max-width: 768px) {
    grid-column: 2;
    text-align: right;
  }
`;

export const LastUpdatedTime = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1a1a1a;
`;

export const LastUpdatedBy = styled.span`
  font-size: 0.6875rem;
  color: #b0b0b0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// Quick Actions Menu
export const QuickActionsButton = styled.button`
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #b0b0b0;
  opacity: 0;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  ${ProjectRow}:hover & {
    opacity: 1;
  }

  &:hover {
    color: #1a1a1a;
  }
`;

export const QuickActionsMenu = styled.div`
  position: absolute;
  top: 50%;
  right: 2rem;
  transform: translateY(-50%);
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 140px;
  overflow: hidden;
`;

export const MenuItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: transparent;
  border: none;
  font-size: 0.8125rem;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #fafafa;
    color: #1a1a1a;
  }
`;

// Empty State
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  animation: ${fadeIn} 0.4s ease-out;
`;

export const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: #b0b0b0;
`;

export const EmptyTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.5rem;
`;

export const EmptyDescription = styled.p`
  font-size: 0.875rem;
  color: #808080;
  margin: 0 0 1.5rem;
  max-width: 300px;
`;

export const EmptyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #2d2d2d;
    box-shadow: 0 6px 16px rgba(26, 26, 26, 0.18);
  }
`;

// Footer Stats
export const Footer = styled.footer`
  display: flex;
  gap: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  margin-top: auto;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

export const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4caf50;
`;

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const StatValue = styled.span`
  font-size: 0.8125rem;
  font-weight: 700;
  color: #1a1a1a;
`;

export const StatLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #b0b0b0;
`;

// Modal
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} 0.15s ease-out;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 28rem;
  width: 100%;
  z-index: 10;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
`;

export const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 1.5rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.875rem;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  font-size: 0.875rem;
  font-family: inherit;
  color: #1a1a1a;
  background: #fafafa;
  transition: all 0.3s ease;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    background: white;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  &::placeholder {
    color: #b0b0b0;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 0.875rem;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  font-size: 0.875rem;
  font-family: inherit;
  color: #1a1a1a;
  background: #fafafa;
  transition: all 0.3s ease;
  min-height: 100px;
  resize: vertical;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    background: white;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  &::placeholder {
    color: #b0b0b0;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

export const Button = styled.button`
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  ${(props) =>
    props.primary
      ? `
    background: #1a1a1a;
    color: white;

    &:hover:not(:disabled) {
      background: #2d2d2d;
      box-shadow: 0 6px 16px rgba(26, 26, 26, 0.18);
    }
  `
      : `
    background: white;
    color: #1a1a1a;
    border: 1px solid #e0e0e0;

    &:hover:not(:disabled) {
      background: #fafafa;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Skeleton
export const SkeletonRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1fr;
  padding: 1.5rem;
  border-bottom: 1px solid #f8f8f8;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const SkeletonText = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  height: ${(props) => props.height || '16px'};
  width: ${(props) => props.width || '100%'};

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;
