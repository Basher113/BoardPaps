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

export const Content = styled.div`
  padding: 3rem 2rem;
  background-color: #fafafa;
  min-height: calc(100vh - 2rem);

  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

export const Header = styled.header`
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #18181b;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.025em;

  @media (max-width: 640px) {
    font-size: 1.25rem;
  }
`;

export const Subtitle = styled.p`
  color: #71717a;
  margin: 0;
  font-size: 0.875rem;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    width: 100%;
  }
`;

export const SearchInput = styled.input`
  padding: 0.5rem 0.75rem;
  padding-left: 2.25rem;
  border: 1px solid #e4e4e7;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  width: 220px;
  background-color: #ffffff;
  transition: all 0.15s ease;

  &::placeholder {
    color: #a1a1aa;
  }

  &:focus {
    outline: none;
    border-color: #18181b;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
    width: 260px;
  }

  @media (max-width: 640px) {
    width: 100%;

    &:focus {
      width: 100%;
    }
  }
`;

export const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const SearchIcon = styled.span`
  position: absolute;
  left: 0.75rem;
  color: #a1a1aa;
  pointer-events: none;
  display: flex;
  align-items: center;
`;

export const NewButton = styled.button`
  padding: 0.625rem 1.25rem;
  background-color: #18181b;
  color: #fafafa;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;

  &:hover {
    background-color: #27272a;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 640px) {
    justify-content: center;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
`;

export const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
  animation: ${fadeIn} 0.4s ease-out;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const ProjectCard = styled.div`
  background-color: #ffffff;
  border-radius: 0.5rem;
  padding: 1.25rem;
  cursor: pointer;
  border: 1px solid #e4e4e7;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    border-color: #d4d4d8;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

export const ProjectName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #18181b;
  margin: 0;
  flex: 1;
  line-height: 1.4;
`;

export const ProjectKey = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #a1a1aa;
  background-color: #f4f4f5;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  margin-left: 0.5rem;
`;

export const QuickActionsButton = styled.button`
  background: transparent;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: #a1a1aa;
  border-radius: 0.25rem;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f4f4f5;
    color: #52525b;
  }
`;

export const QuickActionsMenu = styled.div`
  position: absolute;
  top: 2rem;
  right: 1rem;
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 0.375rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  min-width: 140px;
  overflow: hidden;
`;

export const MenuItem = styled.button`
  width: 100%;
  padding: 0.625rem 1rem;
  text-align: left;
  background: transparent;
  border: none;
  font-size: 0.875rem;
  color: #52525b;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #f4f4f5;
    color: #18181b;
  }

  &:first-child {
    border-radius: 0.375rem 0.375rem 0 0;
  }

  &:last-child {
    border-radius: 0 0 0.375rem 0.375rem;
  }
`;

export const ProjectDescription = styled.p`
  font-size: 0.875rem;
  color: #71717a;
  margin: 0 0 1rem 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ProjectMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 0.875rem;
  border-top: 1px solid #f4f4f5;
  flex-wrap: wrap;
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #71717a;
`;

export const MetaLabel = styled.span`
  color: #a1a1aa;
  font-weight: 500;
`;

export const MetaValue = styled.span`
  color: #52525b;
`;

export const OwnerBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  background-color: #f4f4f5;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  color: #52525b;
`;

export const MemberAvatars = styled.div`
  display: flex;
  align-items: center;
`;

export const Avatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #e4e4e7;
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 600;
  color: #71717a;
  margin-left: -8px;

  &:first-child {
    margin-left: 0;
  }
`;

export const AvatarOverflow = styled(Avatar)`
  background-color: #f4f4f5;
  color: #71717a;
`;

export const IssueCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #71717a;
`;

export const LastUpdated = styled.div`
  font-size: 0.75rem;
  color: #a1a1aa;
  margin-left: auto;
`;

export const RoleIndicator = styled.span`
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  margin-left: 0.5rem;
  
  ${props => props.$role === 'OWNER' && `
    background-color: #18181b;
    color: #ffffff;
  `}
  
  ${props => props.$role === 'ADMIN' && `
    background-color: #f4f4f5;
    color: #52525b;
  `}
  
  ${props => (props.$role === 'MEMBER' || !props.$role) && `
    background-color: #f4f4f5;
    color: #a1a1aa;
  `}
`;

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
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f4f4f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: #d4d4d8;
`;

export const EmptyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #18181b;
  margin: 0 0 0.5rem 0;
`;

export const EmptyDescription = styled.p`
  font-size: 0.875rem;
  color: #71717a;
  margin: 0 0 1.5rem 0;
  max-width: 300px;
`;

export const EmptyButton = styled.button`
  padding: 0.625rem 1.25rem;
  background-color: #18181b;
  color: #fafafa;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: #27272a;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.15s ease-out;
`;

export const ModalContent = styled.div`
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 28rem;
  width: 100%;
  z-index: 10;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
  animation: ${fadeIn} 0.2s ease-out;
`;

export const ModalTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #18181b;
  margin: 0 0 1.5rem 0;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #e4e4e7;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.15s ease;
  margin-bottom: 1rem;

  &::placeholder {
    color: #a1a1aa;
  }

  &:focus {
    outline: none;
    border-color: #18181b;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
  }

  &:disabled {
    background-color: #f4f4f5;
    cursor: not-allowed;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #e4e4e7;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.15s ease;
  margin-bottom: 1rem;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;

  &::placeholder {
    color: #a1a1aa;
  }

  &:focus {
    outline: none;
    border-color: #18181b;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
  }

  &:disabled {
    background-color: #f4f4f5;
    cursor: not-allowed;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

export const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid #e4e4e7;
  background-color: ${props => props.primary ? '#18181b' : '#ffffff'};
  color: ${props => props.primary ? '#ffffff' : '#52525b'};

  &:hover {
    background-color: ${props => props.primary ? '#27272a' : '#f4f4f5'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #71717a;
  font-size: 0.875rem;
`;
