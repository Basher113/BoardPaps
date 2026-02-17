import { useState } from 'react';
import {
  ActivityItem as Item,
  ActivityAvatar,
  ActivityContent,
  ActivityHeader,
  ActivityUser,
  ActivityAction,
  ActionBadge,
  ActivityDetails,
  ActivityTimestamp,
  MetadataSection,
  MetadataItem,
  MetadataLabel,
  MetadataValue,
  ExpandButton
} from './ActivityList.styles';
import { formatRelativeTime } from '../../../../utils/date';

// Action configuration for display
const ACTION_CONFIG = {
  PROJECT_CREATED: {
    label: 'Project Created',
    icon: 'folder-plus',
    color: '#10b981',
    bgColor: '#d1fae5',
    description: 'created this project'
  },
  PROJECT_UPDATED: {
    label: 'Project Updated',
    icon: 'folder-open',
    color: '#6366f1',
    bgColor: '#e0e7ff',
    description: 'updated project settings'
  },
  PROJECT_DELETED: {
    label: 'Project Deleted',
    icon: 'trash-2',
    color: '#dc2626',
    bgColor: '#fee2e2',
    description: 'deleted this project'
  },
  OWNERSHIP_TRANSFERRED: {
    label: 'Ownership Transferred',
    icon: 'arrow-right-left',
    color: '#8b5cf6',
    bgColor: '#ede9fe',
    description: 'transferred ownership'
  },
  MEMBER_ROLE_CHANGED: {
    label: 'Role Changed',
    icon: 'shield',
    color: '#3b82f6',
    bgColor: '#dbeafe',
    description: 'changed a member role'
  },
  MEMBER_REMOVED: {
    label: 'Member Removed',
    icon: 'user-minus',
    color: '#dc2626',
    bgColor: '#fee2e2',
    description: 'removed a member'
  },
  MEMBER_LEFT: {
    label: 'Member Left',
    icon: 'log-out',
    color: '#f59e0b',
    bgColor: '#fef3c7',
    description: 'left the project'
  },
  INVITATION_CREATED: {
    label: 'Invitation Sent',
    icon: 'mail-plus',
    color: '#10b981',
    bgColor: '#d1fae5',
    description: 'sent an invitation'
  },
  INVITATION_ACCEPTED: {
    label: 'Invitation Accepted',
    icon: 'mail-check',
    color: '#10b981',
    bgColor: '#d1fae5',
    description: 'accepted an invitation'
  },
  INVITATION_DECLINED: {
    label: 'Invitation Declined',
    icon: 'mail-x',
    color: '#f59e0b',
    bgColor: '#fef3c7',
    description: 'declined an invitation'
  },
  INVITATION_CANCELLED: {
    label: 'Invitation Cancelled',
    icon: 'mail-minus',
    color: '#dc2626',
    bgColor: '#fee2e2',
    description: 'cancelled an invitation'
  },
  INVITATION_RESENT: {
    label: 'Invitation Resent',
    icon: 'refresh-cw',
    color: '#3b82f6',
    bgColor: '#dbeafe',
    description: 'resent an invitation'
  }
};

// Format metadata for display
const formatMetadata = (action, metadata) => {
  if (!metadata) return null;

  const items = [];

  switch (action) {
    case 'MEMBER_ROLE_CHANGED':
      if (metadata.oldRole && metadata.newRole) {
        items.push({ label: 'Previous Role', value: metadata.oldRole });
        items.push({ label: 'New Role', value: metadata.newRole });
      }
      if (metadata.targetUserName) {
        items.push({ label: 'Member', value: metadata.targetUserName });
      }
      break;
    
    case 'OWNERSHIP_TRANSFERRED':
      if (metadata.previousOwnerName) {
        items.push({ label: 'Previous Owner', value: metadata.previousOwnerName });
      }
      if (metadata.newOwnerName) {
        items.push({ label: 'New Owner', value: metadata.newOwnerName });
      }
      break;
    
    case 'INVITATION_CREATED':
    case 'INVITATION_ACCEPTED':
    case 'INVITATION_DECLINED':
    case 'INVITATION_CANCELLED':
    case 'INVITATION_RESENT':
      if (metadata.email) {
        items.push({ label: 'Email', value: metadata.email });
      }
      if (metadata.role) {
        items.push({ label: 'Role', value: metadata.role });
      }
      break;
    
    case 'PROJECT_UPDATED':
      if (metadata.fields) {
        items.push({ label: 'Updated Fields', value: metadata.fields.join(', ') });
      }
      break;
    
    default:
      // For any other action, show all metadata
      Object.entries(metadata).forEach(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number') {
          items.push({ 
            label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), 
            value 
          });
        }
      });
  }

  return items.length > 0 ? items : null;
};

const ActivityItem = ({ log }) => {
  const [expanded, setExpanded] = useState(false);
  
  const config = ACTION_CONFIG[log.action] || {
    label: log.action.replace(/_/g, ' '),
    color: '#6b7280',
    bgColor: '#f3f4f6',
    description: 'performed an action'
  };

  const metadataItems = formatMetadata(log.action, log.metadata);
  const hasMetadata = metadataItems && metadataItems.length > 0;

  // Get user display info
  const userName = log.user?.username || 'Unknown User';
  const userAvatar = log.user?.avatar;

  return (
    <Item>
      <ActivityAvatar>
        {userAvatar ? (
          <img src={userAvatar} alt={userName} />
        ) : (
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6b7280' }}>
            {userName.charAt(0).toUpperCase()}
          </span>
        )}
      </ActivityAvatar>
      
      <ActivityContent>
        <ActivityHeader>
          <ActivityUser>{userName}</ActivityUser>
          <ActivityAction>{config.description}</ActivityAction>
          <ActionBadge $bgColor={config.bgColor} $textColor={config.color}>
            {config.label}
          </ActionBadge>
        </ActivityHeader>

        {hasMetadata && !expanded && (
          <ActivityDetails>
            {metadataItems.slice(0, 2).map((item, index) => (
              <span key={index}>
                {item.label}: <strong>{item.value}</strong>
                {index < Math.min(metadataItems.length, 2) - 1 && '; '}
              </span>
            ))}
            {metadataItems.length > 2 && (
              <ExpandButton onClick={() => setExpanded(true)}>
                Show more
              </ExpandButton>
            )}
          </ActivityDetails>
        )}

        {hasMetadata && expanded && (
          <MetadataSection>
            {metadataItems.map((item, index) => (
              <MetadataItem key={index}>
                <MetadataLabel>{item.label}:</MetadataLabel>
                <MetadataValue>{item.value}</MetadataValue>
              </MetadataItem>
            ))}
            <ExpandButton onClick={() => setExpanded(false)}>
              Show less
            </ExpandButton>
          </MetadataSection>
        )}

        <ActivityTimestamp>
          {formatRelativeTime(log.createdAt)}
        </ActivityTimestamp>
      </ActivityContent>
    </Item>
  );
};

export default ActivityItem;
export { ACTION_CONFIG };