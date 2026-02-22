import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { MoreHorizontal, Edit, Trash2, Eye, Calendar, MessageCircle, Paperclip } from 'lucide-react';
import {
  CardContainer,
  CardHeader,
  TypeContainer,
  IssueId,
  MenuButton,
  MenuContainer,
  MenuDropdown,
  MenuItem,
  CardTitle,
  CardDescription,
  CardFooter,
  MenuBackdrop,
  TagGroup,
  Tag,
  TaskStats,
  StatItem,
} from './IssueCard.styles';
import UserAvatar from '../../../../components/ui/user-avatar/UserAvatar';
import { useGetCurrentUserQuery } from '../../../../reducers/slices/user/user.slice';
import { openEditModal, openDeleteModal } from '../../../../reducers/slices/issue/issue.slice';

const IssueCard = ({ 
  issue, 
  columnId,
  isDragging,
  onDragStart,
  onDragOverIssue,
  onDropOnIssue,
  onClick
}) => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  
  // Get current user directly
  const { data: currentUserData, isLoading: currentUserLoading } = useGetCurrentUserQuery();
  const currentUserId = currentUserData?.id;
  
  // Check if currentUserId is loaded and matches assignee OR reporter
  const canEdit = currentUserId && (issue.assignee?.id === currentUserId || issue.reporter?.id === currentUserId);

  // Handle drag start using native HTML5 drag events
  const handleDragStart = useCallback((e) => {
    if (!currentUserId) return;

    // Set drag data with full issue object for the Column to use
    e.dataTransfer.setData('application/json', JSON.stringify({
      issue,
      sourceColumnId: columnId
    }));
    
    // Set drag effect
    e.dataTransfer.effectAllowed = 'move';
    
    // Call the callback if provided
    onDragStart?.();

    // Add visual feedback
    e.target.classList.add('dragging');
  }, [currentUserId, issue, columnId, onDragStart]);

  // Handle drag end
  const handleDragEnd = useCallback((e) => {
    e.target.classList.remove('dragging');
  }, []);

  // Handle drag over for drop target
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOverIssue?.(e, issue.id);
  }, [issue.id, onDragOverIssue]);

  // Handle drag leave
  const handleDragLeave = useCallback((e) => {
    // Only clear if leaving the card entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      // Parent will handle clearing
    }
  }, []);

  // Handle drop on this card
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onDropOnIssue?.(e, issue.id, columnId);
  }, [issue.id, columnId, onDropOnIssue]);

  const handleMenuClick = useCallback((e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  }, [showMenu]);

  const handleCloseMenu = useCallback(() => {
    setShowMenu(false);
  }, []);

  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    if (!canEdit) return;
    dispatch(openEditModal(issue.id));
    setShowMenu(false);
  }, [dispatch, issue.id, canEdit]);

  const handleViewDetails = useCallback((e) => {
    e.stopPropagation();
    onClick?.(issue);
    setShowMenu(false);
  }, [issue, onClick]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    if (!canEdit) return;
    dispatch(openDeleteModal(issue.id));
    setShowMenu(false);
  }, [dispatch, issue.id, canEdit]);

  // Format date for display
  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <CardContainer
      draggable={!!currentUserId}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      $canEdit={currentUserId === issue.assigneeId || currentUserId === issue.reporterId}
      $isDragging={isDragging}
      onClick={() => onClick?.(issue)}
    >
      <CardHeader>
        
       
        
      
        <CardTitle>{issue.title}</CardTitle>
         <MenuContainer>
          <MenuButton 
            onClick={handleMenuClick}
            aria-label="Issue options"
            aria-expanded={showMenu}
            aria-haspopup="true"
          >
            <MoreHorizontal size={16} />
          </MenuButton>
          {showMenu && (
            <>
              <MenuBackdrop onClick={handleCloseMenu} />
              <MenuDropdown role="menu" aria-label="Issue actions">
                {currentUserLoading ? (
                  <MenuItem as="div" style={{ color: '#6b7280', cursor: 'default' }}>
                    Loading...
                  </MenuItem>
                ) : !currentUserId ? (
                  <MenuItem as="div" style={{ color: '#6b7280', cursor: 'default' }}>
                    You're not supposed to be here
                  </MenuItem>
                ) : (
                  <>
                    <MenuItem 
                      onClick={handleViewDetails}
                      role="menuitem"
                    >
                      <Eye size={16} />
                      <span>View Details</span>
                    </MenuItem>
                    <MenuItem 
                      onClick={handleEdit}
                      role="menuitem"
                      disabled={!canEdit}
                      style={{ opacity: canEdit ? 1 : 0.5, cursor: canEdit ? 'pointer' : 'not-allowed' }}
                    >
                      <Edit size={16} />
                      <span>{canEdit ? 'Edit' : 'View Only'}</span>
                    </MenuItem>
                    {canEdit && (
                      <MenuItem
                        $danger
                        onClick={handleDelete}
                        role="menuitem"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </MenuItem>
                    )}
                    {!canEdit && (
                      <MenuItem as="div" style={{ color: '#6b7280', cursor: 'default', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                        Assigned to: {issue.assignee?.username || 'Unassigned'}
                      </MenuItem>
                    )}
                  </>
                )}
              </MenuDropdown>
            </>
          )}
        </MenuContainer>
       
      </CardHeader>
       {issue.description && (
        <CardDescription>{issue.description}</CardDescription>
      )}
      
      {/* Tags - could be issue type or custom tags */}
      <TagGroup>
        <Tag>{issue.type || 'Task'}</Tag>
        {issue.priority && (
          <Tag style={{ 
            color: issue.priority === 'HIGH' || issue.priority === 'URGENT' ? '#ff4444' : '#71717a',
            fontWeight: issue.priority === 'HIGH' || issue.priority === 'URGENT' ? 600 : 500
          }}>
            {issue.priority}
          </Tag>
        )}
      </TagGroup>
      
      <CardFooter>
        <TaskStats>
          {issue.dueDate && (
            <StatItem>
              <Calendar size={12} />
              <span>{formatDate(issue.dueDate)}</span>
            </StatItem>
          )}
          
          
          <StatItem>
            <MessageCircle size={12} />
            <span>{issue._count.comments}</span>
          </StatItem>
          
          
         
        </TaskStats>
        
        {issue.assignee && (
          <UserAvatar user={issue.assignee} size="sm" />
        )}
      </CardFooter>
    </CardContainer>
  );
};

export default IssueCard;
