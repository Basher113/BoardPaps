import {
  FiltersRow,
  FilterGroup,
  FilterLabel,
  FilterSelect,
  ClearButton
} from './ActivityList.styles';
import { ACTION_CONFIG } from './ActivityItem';

const ActivityFilters = ({ 
  actionFilter, 
  setActionFilter, 
  userFilter, 
  setUserFilter, 
  members,
  onClearFilters 
}) => {
  const hasFilters = actionFilter || userFilter;

  return (
    <FiltersRow>
      <FilterGroup>
        <FilterLabel>Action:</FilterLabel>
        <FilterSelect 
          value={actionFilter} 
          onChange={(e) => setActionFilter(e.target.value)}
        >
          <option value="">All Actions</option>
          <optgroup label="Project">
            <option value="PROJECT_CREATED">Project Created</option>
            <option value="PROJECT_UPDATED">Project Updated</option>
            <option value="PROJECT_DELETED">Project Deleted</option>
            <option value="OWNERSHIP_TRANSFERRED">Ownership Transferred</option>
          </optgroup>
          <optgroup label="Members">
            <option value="MEMBER_ROLE_CHANGED">Role Changed</option>
            <option value="MEMBER_REMOVED">Member Removed</option>
            <option value="MEMBER_LEFT">Member Left</option>
          </optgroup>
          <optgroup label="Invitations">
            <option value="INVITATION_CREATED">Invitation Sent</option>
            <option value="INVITATION_ACCEPTED">Invitation Accepted</option>
            <option value="INVITATION_DECLINED">Invitation Declined</option>
            <option value="INVITATION_CANCELLED">Invitation Cancelled</option>
            <option value="INVITATION_RESENT">Invitation Resent</option>
          </optgroup>
        </FilterSelect>
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>User:</FilterLabel>
        <FilterSelect 
          value={userFilter} 
          onChange={(e) => setUserFilter(e.target.value)}
        >
          <option value="">All Users</option>
          {members?.map((member) => (
            <option key={member.user.id} value={member.user.id}>
              {member.user.username}
            </option>
          ))}
        </FilterSelect>
      </FilterGroup>

      {hasFilters && (
        <ClearButton onClick={onClearFilters}>
          Clear Filters
        </ClearButton>
      )}
    </FiltersRow>
  );
};

export default ActivityFilters;