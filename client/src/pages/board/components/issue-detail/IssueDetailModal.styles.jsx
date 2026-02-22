import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Overlay
export const DrawerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(2px);
  z-index: 100;
  animation: ${fadeIn} 0.3s ease;
`;

// Drawer
export const IssueDrawer = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  width: 100%;
  max-width: 600px;
  background: white;
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 101;
  animation: ${slideIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 640px) {
    max-width: 100%;
  }
`;

// Header
export const DrawerHeader = styled.header`
  padding: 2rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const IssueKey = styled.span`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  color: #808080;
  background: #f5f5f5;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  letter-spacing: 0.5px;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: #b0b0b0;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: #f5f5f5;
    color: #1a1a1a;
  }
`;

export const IssueTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
  letter-spacing: -0.5px;
  margin: 0;
`;

// Content
export const DrawerContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #d0d0d0;
  }
`;

// Section
export const Section = styled.section``;

export const SectionTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 700;
  color: #b0b0b0;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #f0f0f0;
  }
`;

// Details Grid
export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const DetailLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  color: #b0b0b0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const DetailValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
`;

export const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
    switch (props.$status) {
      case 'DONE': return '#22c55e';
      case 'IN_PROGRESS': return '#3b82f6';
      case 'TODO':
      default: return '#1a1a1a';
    }
  }};
`;

export const AvatarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

export const PriorityIcon = styled.span`
  color: ${props => {
    switch (props.$priority) {
      case 'HIGH': return '#ff4444';
      case 'MEDIUM': return '#f59e0b';
      case 'LOW': return '#22c55e';
      default: return '#808080';
    }
  }};
  display: flex;
  align-items: center;
`;

// Description
export const DescriptionText = styled.div`
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #4a4a4a;
  white-space: pre-wrap;
`;

// Comments
export const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const CommentItem = styled.div`
  display: flex;
  gap: 1rem;
`;

export const CommentAvatar = styled.div`
  flex-shrink: 0;
`;

export const CommentBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CommentAuthor = styled.span`
  font-size: 0.8125rem;
  font-weight: 700;
  color: #1a1a1a;
`;

export const CommentTime = styled.span`
  font-size: 0.6875rem;
  color: #b0b0b0;
`;

export const CommentText = styled.p`
  font-size: 0.875rem;
  line-height: 1.5;
  color: #606060;
  margin: 0;
`;

export const CommentActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${CommentItem}:hover & {
    opacity: 1;
  }
`;

export const CommentActionButton = styled.button`
  background: none;
  border: none;
  color: #b0b0b0;
  cursor: pointer;
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
    color: #1a1a1a;
  }

  &:focus {
    outline: none;
    background: #f0f0f0;
  }
`;

export const DeleteButton = styled(CommentActionButton)`
  color: #ff4444;

  &:hover {
    background: #fff0f0;
    color: #cc0000;
  }
`;

// Footer
export const DrawerFooter = styled.footer`
  padding: 1.5rem 2rem;
  border-top: 1px solid #f0f0f0;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const CommentTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  font-size: 0.875rem;
  font-family: inherit;
  resize: none;
  background: #fafafa;
  transition: all 0.3s ease;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: #1a1a1a;
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  &::placeholder {
    color: #b0b0b0;
  }
`;

export const FooterActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const AttachmentBtns = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  color: #b0b0b0;
  cursor: pointer;
  padding: 0.375rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f5f5f5;
    color: #1a1a1a;
  }
`;

export const PostButton = styled.button`
  background: #1a1a1a;
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #2d2d2d;
    box-shadow: 0 4px 12px rgba(26, 26, 26, 0.2);
  }

  &:disabled {
    background: #e0e0e0;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

// Loading and Empty States
export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #b0b0b0;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #b0b0b0;
  font-size: 0.875rem;
`;

// Due Date styling
export const DueDate = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => {
    if (!props.$dueDate) return '#808080';
    const dueDate = new Date(props.$dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    if (dueDate < today) return '#ff4444'; // Overdue
    if (dueDate.getTime() === today.getTime()) return '#f59e0b'; // Due today
    return '#1a1a1a'; // Future
  }};
`;
