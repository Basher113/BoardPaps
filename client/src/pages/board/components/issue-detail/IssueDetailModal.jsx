import styled, { keyframes } from 'styled-components';
import { X, Paperclip, Smile, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import UserAvatar from '../../../../components/ui/user-avatar/UserAvatar';

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Overlay
const DrawerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(2px);
  z-index: 100;
  animation: ${fadeIn} 0.3s ease;
`;

// Drawer
const IssueDrawer = styled.div`
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
const DrawerHeader = styled.header`
  padding: 2rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IssueKey = styled.span`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  color: #808080;
  background: #f5f5f5;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  letter-spacing: 0.5px;
`;

const CloseButton = styled.button`
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

const IssueTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
  letter-spacing: -0.5px;
  margin: 0;
`;

// Content
const DrawerContent = styled.div`
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
const Section = styled.section``;

const SectionTitle = styled.h3`
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
const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DetailLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  color: #b0b0b0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const DetailValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const StatusDot = styled.span`
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

const AvatarWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const PriorityIcon = styled.span`
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
const DescriptionText = styled.div`
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #4a4a4a;
  white-space: pre-wrap;
`;

// Comments
const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CommentItem = styled.div`
  display: flex;
  gap: 1rem;
`;

const CommentAvatar = styled.div`
  flex-shrink: 0;
`;

const CommentBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CommentAuthor = styled.span`
  font-size: 0.8125rem;
  font-weight: 700;
  color: #1a1a1a;
`;

const CommentTime = styled.span`
  font-size: 0.6875rem;
  color: #b0b0b0;
`;

const CommentText = styled.p`
  font-size: 0.875rem;
  line-height: 1.5;
  color: #606060;
  margin: 0;
`;

// Footer
const DrawerFooter = styled.footer`
  padding: 1.5rem 2rem;
  border-top: 1px solid #f0f0f0;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CommentTextarea = styled.textarea`
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

const FooterActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AttachmentBtns = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
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

const PostButton = styled.button`
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
`;

// Hardcoded comments data
const HARDCODED_COMMENTS = [
  {
    id: '1',
    author: { username: 'Marcus Thorne', initials: 'MT' },
    text: "I've started auditing the coordinate mapping. It seems most of the coupling is in the LayoutProvider.ts file.",
    timeAgo: '2 hours ago',
    avatarBg: '#f0f0f0',
  },
  {
    id: '2',
    author: { username: 'Elena Rossi', initials: 'ER' },
    text: "Thanks Marcus. Let's make sure we don't break the responsive hooks while moving those functions.",
    timeAgo: '45 minutes ago',
    avatarBg: '#e8f5e9',
  },
];

// Helper functions
const getStatusText = (status) => {
  switch (status) {
    case 'TODO': return 'To Do';
    case 'IN_PROGRESS': return 'In Progress';
    case 'DONE': return 'Done';
    default: return status;
  }
};

const getPriorityIcon = (priority) => {
  switch (priority) {
    case 'HIGH': return <ArrowUp size={16} />;
    case 'LOW': return <ArrowDown size={16} />;
    case 'MEDIUM':
    default: return <Minus size={16} />;
  }
};

const IssueDetailModal = ({ isOpen, onClose, issue }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <DrawerOverlay onClick={handleOverlayClick} />
      <IssueDrawer>
        {/* Header */}
        <DrawerHeader>
          <HeaderTop>
            <IssueKey>{issue.projectKey || 'BP'}-{issue.key || '0000'}</IssueKey>
            <CloseButton onClick={onClose}>
              <X size={20} />
            </CloseButton>
          </HeaderTop>
          <IssueTitle>{issue.title || 'Untitled Issue'}</IssueTitle>
        </DrawerHeader>

        {/* Content */}
        <DrawerContent>
          {/* Details */}
          <Section>
            <SectionTitle>Details</SectionTitle>
            <DetailsGrid>
              <DetailItem>
                <DetailLabel>Status</DetailLabel>
                <DetailValue>
                  <StatusDot $status={issue.column?.name} />
                  {getStatusText(issue.column?.name || 'TODO', issue)}
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Assignee</DetailLabel>
                <DetailValue>
                  {issue.assignee ? (
                    <AvatarWrapper>
                      <UserAvatar user={issue.assignee} size="xs" />
                      {issue.assignee.username}
                    </AvatarWrapper>
                  ) : (
                    'Unassigned'
                  )}
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Priority</DetailLabel>
                <DetailValue style={{ color: issue.priority === 'HIGH' ? '#ff4444' : issue.priority === 'MEDIUM' ? '#f59e0b' : '#22c55e' }}>
                  <PriorityIcon $priority={issue.priority}>
                    {getPriorityIcon(issue.priority)}
                  </PriorityIcon>
                  {issue.priority || 'Medium'}
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Reporter</DetailLabel>
                <DetailValue>
                  {issue.reporter ? (
                    <AvatarWrapper>
                      <UserAvatar user={issue.reporter} size="xs" />
                      {issue.reporter.username}
                    </AvatarWrapper>
                  ) : (
                    'Unknown'
                  )}
                </DetailValue>
              </DetailItem>
            </DetailsGrid>
          </Section>

          {/* Description */}
          <Section>
            <SectionTitle>Description</SectionTitle>
            <DescriptionText>
              {issue.description || 'No description provided.'}
            </DescriptionText>
          </Section>

          {/* Comments */}
          <Section>
            <SectionTitle>Comments ({HARDCODED_COMMENTS.length})</SectionTitle>
            <CommentsList>
              {HARDCODED_COMMENTS.map((comment) => (
                <CommentItem key={comment.id}>
                  <CommentAvatar>
                    <UserAvatar 
                      user={{ username: comment.author.username }} 
                      size="sm" 
                    />
                  </CommentAvatar>
                  <CommentBody>
                    <CommentHeader>
                      <CommentAuthor>{comment.author.username}</CommentAuthor>
                      <CommentTime>{comment.timeAgo}</CommentTime>
                    </CommentHeader>
                    <CommentText>{comment.text}</CommentText>
                  </CommentBody>
                </CommentItem>
              ))}
            </CommentsList>
          </Section>
        </DrawerContent>

        {/* Footer */}
        <DrawerFooter>
          <CommentTextarea placeholder="Add a detailed comment..." rows={3} />
          <FooterActions>
            <AttachmentBtns>
              <IconButton title="Attach file">
                <Paperclip size={18} />
              </IconButton>
              <IconButton title="Add emoji">
                <Smile size={18} />
              </IconButton>
            </AttachmentBtns>
            <PostButton>Post Comment</PostButton>
          </FooterActions>
        </DrawerFooter>
      </IssueDrawer>
    </>
  );
};

export default IssueDetailModal;
