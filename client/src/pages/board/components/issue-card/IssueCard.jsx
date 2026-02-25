import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, Edit, Trash2, Eye, Calendar, MessageCircle } from 'lucide-react';
import {
  CardContainer,
  CardHeader,
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
  isDragging = false,
  onClick
}) => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  
  // Get current user directly
  const { data: currentUserData, isLoading: currentUserLoading } = useGetCurrentUserQuery();
  const currentUserId = currentUserData?.id;
  
  // Check if currentUserId is loaded and matches assignee OR reporter
  const canEdit = currentUserId && (issue?.assignee?.id === currentUserId || issue?.reporter?.id === currentUserId);

  // ==================== DND-KIT SORTABLE ====================
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ 
    id: issue?.id || 'placeholder',
    disabled: !currentUserId || !issue?.id, // Disable drag if not logged in or no issue
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  // ==================== MENU HANDLERS ====================

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

  // Combine dragging states
  const isCurrentlyDragging = isDragging || isSortableDragging;

  // Guard: Don't render if issue data is incomplete
  if (!issue?.id) {
    return null;
  }

  return (
    <CardContainer
      ref={setNodeRef}
      style={style}
      $canEdit={currentUserId === issue.assigneeId || currentUserId === issue.reporterId}
      $isDragging={isCurrentlyDragging}
      onClick={() => onClick?.(issue)}
      {...attributes}
      {...listeners}
    >
      <CardHeader>
        <CardTitle>{issue.title || 'Untitled Issue'}</CardTitle>
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
            color: issue.priority === 'HIGH' || issue.priority === 'CRITICAL' ? '#ff4444' : '#71717a',
            fontWeight: issue.priority === 'HIGH' || issue.priority === 'CRITICAL' ? 600 : 500
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
            <span>{issue._count?.comments}</span>
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
