import { useState } from 'react';

import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
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
  MenuBackdrop
} from './IssueCard.styles';
import IssueTypeIcon from '../issue-type-icon/IssueTypeIcon';
import PriorityBadge from '../priority-badge/PriorityBadge';
import UserAvatar from '../../../../components/ui/user-avatar/UserAvatar';

const IssueCard = ({ issue, onDragStart, onDragEnd, onEdit, onDelete, currentUserId, projectKey }) => {
  const [showMenu, setShowMenu] = useState(false);
  const canEdit = issue.assigneeId === currentUserId;
  
  return (
    <CardContainer
      draggable={canEdit}
      onDragStart={(e) => canEdit && onDragStart(e, issue)}
      onDragEnd={onDragEnd}
      canEdit={canEdit}
    >
      <CardHeader>
        <TypeContainer>
          <IssueTypeIcon type={issue.type} />
          <IssueId>{projectKey}-{issue.id.slice(-4)}</IssueId>
        </TypeContainer>
        <MenuContainer>
          <MenuButton onClick={() => setShowMenu(!showMenu)}>
            <MoreHorizontal size={16} />
          </MenuButton>
          {showMenu && (
            <>
              <MenuBackdrop onClick={() => setShowMenu(false)} />
              <MenuDropdown>
                {canEdit && (
                  <MenuItem
                    onClick={() => {
                      onEdit(issue);
                      setShowMenu(false);
                    }}
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </MenuItem>
                )}
                {canEdit && (
                  <MenuItem
                    danger
                    onClick={() => {
                      onDelete(issue.id);
                      setShowMenu(false);
                    }}
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </MenuItem>
                )}
                {!canEdit && (
                  <MenuItem as="div" style={{ color: '#6b7280', cursor: 'default' }}>
                    View only
                  </MenuItem>
                )}
              </MenuDropdown>
            </>
          )}
        </MenuContainer>
      </CardHeader>
      <CardTitle>{issue.title}</CardTitle>
      {issue.description && (
        <CardDescription>{issue.description}</CardDescription>
      )}
      <CardFooter>
        <PriorityBadge priority={issue.priority} />
        <UserAvatar userId={issue.assigneeId} size="sm" />
      </CardFooter>
    </CardContainer>
  );
};

export default IssueCard;
