import { useState } from 'react';
import { X, ArrowUp, ArrowDown, Minus, Calendar, Trash2, Loader2 } from 'lucide-react';
import UserAvatar from '../../../../components/ui/user-avatar/UserAvatar';
import { useGetCommentsQuery, useCreateCommentMutation, useDeleteCommentMutation } from '../../../../reducers/slices/comment/comment.apiSlice';
import { useGetCurrentUserQuery } from '../../../../reducers/slices/user/user.slice';
import { formatRelativeTime } from '../../../../utils/date';
import { logger } from '../../../../utils/logger';
import {
  DrawerOverlay,
  IssueDrawer,
  DrawerHeader,
  HeaderTop,
  IssueKey,
  CloseButton,
  IssueTitle,
  DrawerContent,
  Section,
  SectionTitle,
  DetailsGrid,
  DetailItem,
  DetailLabel,
  DetailValue,
  StatusDot,
  AvatarWrapper,
  PriorityIcon,
  DescriptionText,
  CommentsList,
  CommentItem,
  CommentAvatar,
  CommentBody,
  CommentHeader,
  CommentAuthor,
  CommentTime,
  CommentText,
  DeleteButton,
  DrawerFooter,
  CommentTextarea,
  FooterActions,
  LoadingSpinner,
  EmptyState,
  DueDate,
} from './IssueDetailModal.styles';
import Button from '../../../../components/ui/button/Button';

// Helper functions
const getStatusText = (status) => {
  switch (status) {
    case 'TODO': return 'To Do';
    case 'IN_PROGRESS': return 'In Progress';
    case 'DONE': return 'Done';
    default: return status || 'To Do';
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

const formatDueDate = (dueDate) => {
  if (!dueDate) return 'No due date';
  const date = new Date(dueDate);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const IssueDetailModal = ({ isOpen, onClose, issue, projectId }) => {
  const [commentText, setCommentText] = useState('');
  const [commentToDelete, setCommentToDelete] = useState(null);
  
  // Get current user for permission checks
  const { data: currentUser } = useGetCurrentUserQuery();
  const currentUserId = currentUser?.id;
  
  // Fetch comments for this issue
  const { 
    data: commentsData, 
    isLoading: isLoadingComments,
    error: commentsError 
  } = useGetCommentsQuery(
    { projectId, issueId: issue?.id },
    { skip: !isOpen || !issue?.id }
  );
  
  // Create comment mutation
  const [createComment, { isLoading: isCreatingComment }] = useCreateCommentMutation();
  
  // Delete comment mutation
  const [deleteComment, { isLoading: isDeletingComment }] = useDeleteCommentMutation();

  if (!isOpen) return null;

  const comments = commentsData?.data || [];
  const totalComments = commentsData?.pagination?.total || 0;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handlePostComment = async () => {
    if (!commentText.trim() || isCreatingComment) return;
    
    try {
      await createComment({
        projectId,
        issueId: issue.id,
        content: commentText.trim(),
      }).unwrap();
      
      setCommentText('');
    } catch (error) {
      logger.apiError('Post comment', error);
    }
  };





  const handleDeleteComment = async () => {
    if (!commentToDelete || isDeletingComment) return;
    
    try {
      await deleteComment({
        projectId,
        issueId: issue.id,
        commentId: commentToDelete,
      }).unwrap();
    } catch (error) {
      logger.apiError('Delete comment', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handlePostComment();
    }
  };

  return (
    <>
      <DrawerOverlay onClick={handleOverlayClick} />
      <IssueDrawer>
        {/* Header */}
        <DrawerHeader>
          <HeaderTop>
            <IssueKey>{issue.issueKey || 'BP-0000'}</IssueKey>
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
                  {getStatusText(issue.column?.name)}
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
                <DetailValue style={{ color: issue.priority === 'HIGH' ? '#ff4444' : issue.priority === 'MEDIUM' ? '#f59e0b' : '#ff7944' }}>
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
              <DetailItem>
                <DetailLabel>Type</DetailLabel>
                <DetailValue>
                  {issue.type || 'Task'}
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Due Date</DetailLabel>
                <DetailValue>
                  <DueDate $dueDate={issue.dueDate}>
                    <Calendar size={14} />
                    {formatDueDate(issue.dueDate)}
                  </DueDate>
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
            <SectionTitle>Comments ({totalComments})</SectionTitle>
            
            {isLoadingComments ? (
              <LoadingSpinner>
                <Loader2 size={24} className="animate-spin" />
              </LoadingSpinner>
            ) : commentsError ? (
              <EmptyState>Failed to load comments</EmptyState>
            ) : comments.length === 0 ? (
              <EmptyState>No comments yet. Be the first to comment!</EmptyState>
            ) : (
              <CommentsList>
                {comments.map((comment) => (
                  <CommentItem key={comment.id}>
                    <CommentAvatar>
                      <UserAvatar 
                        user={comment.author} 
                        size="sm" 
                      />
                    </CommentAvatar>
                    <CommentBody>
                      <CommentHeader>
                        <CommentAuthor>{comment.author?.username || 'Unknown'}</CommentAuthor>
                        <CommentTime>
                          {formatRelativeTime(comment.createdAt)}
                        </CommentTime>
                        {currentUserId === comment.author?.id && (
                          <DeleteButton 
                            onClick={() => {
                              setCommentToDelete(comment.id);
                              handleDeleteComment()
                            }}
                            disabled={isDeletingComment}
                            title="Delete comment"
                          >
                            <Trash2 size={14} />
                          </DeleteButton>
                        )}
                      </CommentHeader>
                      <CommentText>{comment.content}</CommentText>
                    </CommentBody>
                  </CommentItem>
                ))}
              </CommentsList>
            )}
          </Section>
        </DrawerContent>

        {/* Footer */}
        <DrawerFooter>
          <CommentTextarea 
            placeholder="Add a detailed comment..." 
            rows={3}
            value={commentText}
            onChange={handleCommentChange}
            onKeyDown={handleKeyDown}
            disabled={isCreatingComment}
          />
          <FooterActions>
            <Button
              size='md' 
              onClick={handlePostComment}
              disabled={!commentText.trim() || isCreatingComment}
            >
              {isCreatingComment ? 'Posting...' : 'Post Comment'}
            </Button>
          </FooterActions>
        </DrawerFooter>
      </IssueDrawer>

    
    </>
  );
};

export default IssueDetailModal;
