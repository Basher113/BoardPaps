import { useState } from 'react';
import { toast } from 'react-toastify';
import { Trash, ChevronDown } from 'lucide-react';
import {
  Section,
  SectionHeader,
  SectionHeaderContent,
  SectionTitle,
  SectionDescription,
  SectionContent,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  TableHeaderCell,
  UserCell,
  UserInfo,
  MemberName,
  MemberEmail,
  RoleBadge,
  ActionButton,
  Button,
  RoleDropdown,
  RoleDropdownMenu,
  RoleDropdownItem,
  ActionsCell,
} from '../../ProjectSettings.styles';
import ConfirmModal from '../../../../components/ui/confirm-modal/ConfirmModal';
import UserAvatarComponent from '../../../../components/ui/user-avatar/UserAvatar';
import { useRemoveMemberMutation, useUpdateMemberRoleMutation } from '../../../../reducers/slices/member/member.apiSlice';

const MembersList = ({ project, currentUserId, canManageSettings, refetchProject }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);

  const [removeMember, { isLoading: removeLoading }] = useRemoveMemberMutation();
  const [updateMemberRole, { isLoading: roleLoading }] = useUpdateMemberRoleMutation();

  // Find current user's membership and role
  const currentMember = project.members?.find(m => m.user.id === currentUserId);
  const currentUserRole = currentMember?.role;

  // Check if current user is owner
  const isOwner = currentUserRole === 'OWNER';

  const handleRemoveMember = async () => {
    if (!selectedMember) return;

    try {
      await removeMember({ 
        projectId: project.id, 
        memberId: selectedMember.id 
      }).unwrap();
      toast.success('Member removed successfully');
      setShowRemoveModal(false);
      setSelectedMember(null);
      refetchProject();
    } catch (err) {
      console.error('Failed to remove member:', err);
      toast.error(err.data?.message || 'Failed to remove member');
    }
  };

  const handleRoleChange = async () => {
    if (!selectedMember || !newRole) return;

    try {
      await updateMemberRole({
        projectId: project.id,
        memberId: selectedMember.id,
        role: newRole
      }).unwrap();
      toast.success('Member role updated successfully');
      setShowRoleModal(false);
      setSelectedMember(null);
      setNewRole('');
      refetchProject();
    } catch (err) {
      console.error('Failed to update member role:', err);
      toast.error(err.data?.message || 'Failed to update member role');
    }
  };

  const openRemoveModal = (member) => {
    setSelectedMember(member);
    setShowRemoveModal(true);
    setOpenDropdown(null);
  };

  const openRoleModal = (member, role) => {
    setSelectedMember(member);
    setNewRole(role);
    setShowRoleModal(true);
    setOpenDropdown(null);
  };

  // Check if current user can modify a member's role
  const canModifyRole = (member) => {
    // Can't modify own role
    if (member.user.id === currentUserId) return false;
    // Can't modify owner's role
    if (member.role === 'OWNER') return false;
    // Only owner can modify roles
    return isOwner;
  };

  // Check if current user can remove a member
  const canRemoveMember = (member) => {
    // Can't remove yourself (use leave project instead)
    if (member.user.id === currentUserId) return false;
    // Can't remove owner
    if (member.role === 'OWNER') return false;
    // Owner can remove anyone
    if (isOwner) return true;
    // Admin can remove members (but not other admins)
    if (currentUserRole === 'ADMIN' && member.role === 'MEMBER') return true;
    return false;
  };

  // Get available roles for promotion/demotion
  const getAvailableRoles = (currentRole) => {
    const roles = ['MEMBER', 'ADMIN'];
    return roles.filter(role => role !== currentRole);
  };

  return (
    <>
      <Section>
        <SectionHeader>
          <SectionHeaderContent>
            <SectionTitle>Members</SectionTitle>
            <SectionDescription>Manage who can view and edit this project.</SectionDescription>
          </SectionHeaderContent>
          {canManageSettings && (
            <Button $variant="primary" style={{ padding: '0.5rem 0.875rem', fontSize: '0.75rem' }}>
              + Add Member
            </Button>
          )}
        </SectionHeader>
        <SectionContent style={{ padding: 0 }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Team Member</TableHeaderCell>
                <TableHeaderCell>Role</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {project.members?.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <UserCell>
                      <UserAvatarComponent user={member.user} size="sm" />
                      <UserInfo>
                        <MemberName>
                          {member.user.username}
                          {member.user.id === currentUserId && ' (You)'}
                        </MemberName>
                        <MemberEmail>{member.user.email}</MemberEmail>
                      </UserInfo>
                    </UserCell>
                  </TableCell>
                  <TableCell>
                    {canModifyRole(member) ? (
                      <RoleDropdown>
                        <RoleBadge 
                          $isLead={member.role === 'OWNER' || member.role === 'ADMIN'}
                          onClick={() => setOpenDropdown(openDropdown === member.id ? null : member.id)}
                          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                          {member.role}
                          <ChevronDown size={12} />
                        </RoleBadge>
                        {openDropdown === member.id && (
                          <RoleDropdownMenu>
                            {getAvailableRoles(member.role).map((role) => (
                              <RoleDropdownItem 
                                key={role}
                                onClick={() => openRoleModal(member, role)}
                              >
                                {role === 'ADMIN' ? 'Promote to Admin' : 'Demote to Member'}
                              </RoleDropdownItem>
                            ))}
                          </RoleDropdownMenu>
                        )}
                      </RoleDropdown>
                    ) : (
                      <RoleBadge $isLead={member.role === 'OWNER' || member.role === 'ADMIN'}>
                        {member.role}
                      </RoleBadge>
                    )}
                  </TableCell>
                  <TableCell>
                    <ActionsCell>
                      {canRemoveMember(member) && (
                        <ActionButton onClick={() => openRemoveModal(member)}>
                          <Trash color='rgb(255, 120, 120)'/>
                        </ActionButton>
                      )}
                    </ActionsCell>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionContent>
      </Section>

      {/* Remove Member Confirmation Modal */}
      <ConfirmModal
        isOpen={showRemoveModal}
        onClose={() => {
          setShowRemoveModal(false);
          setSelectedMember(null);
        }}
        onConfirm={handleRemoveMember}
        title="Remove Member"
        message={`Are you sure you want to remove ${selectedMember?.user?.username} from this project?`}
        confirmText="Remove"
        cancelText="Cancel"
        variant="danger"
        isLoading={removeLoading}
      />

      {/* Role Change Confirmation Modal */}
      <ConfirmModal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          setSelectedMember(null);
          setNewRole('');
        }}
        onConfirm={handleRoleChange}
        title="Change Member Role"
        message={`Are you sure you want to ${newRole === 'ADMIN' ? 'promote' : 'demote'} ${selectedMember?.user?.username} to ${newRole}?`}
        confirmText={newRole === 'ADMIN' ? 'Promote' : 'Demote'}
        cancelText="Cancel"
        variant="primary"
        isLoading={roleLoading}
      />
    </>
  );
};

export default MembersList;
