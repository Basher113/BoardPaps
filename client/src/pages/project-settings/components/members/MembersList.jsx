import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  AvatarWrapper,
  MemberInfo,
  MemberName,
  MemberEmail,
  RoleBadge,
  ActionButton
} from '../../ProjectSettings.styles';
import ConfirmModal from '../../../../components/ui/confirm-modal/ConfirmModal';
import UserAvatar from '../../../../components/ui/user-avatar/UserAvatar';
import { useUpdateMemberRoleMutation, useRemoveMemberMutation } from '../../../../reducers/slices/project/project.apiSlice';

const MembersList = ({ project, currentUserId, canManageSettings, refetchProject }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const [updateMemberRole, { isLoading: roleLoading }] = useUpdateMemberRoleMutation();
  const [removeMember, { isLoading: removeLoading }] = useRemoveMemberMutation();

  const handleRoleChange = async (memberId, newRole) => {
    try {
      await updateMemberRole({ 
        projectId: project.id, 
        memberId, 
        role: newRole 
      }).unwrap();
      toast.success('Member role updated successfully');
      refetchProject();
    } catch (err) {
      console.error('Failed to update role:', err);
      toast.error(err.data?.message || 'Failed to update member role');
    }
  };

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

  const openRemoveModal = (member) => {
    setSelectedMember(member);
    setShowRemoveModal(true);
  };

  return (
    <>
      <Section>
        <SectionHeader>
          <SectionTitle>Team Members</SectionTitle>
          <SectionDescription>Manage project members and their roles</SectionDescription>
        </SectionHeader>
        <SectionContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Member</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {project.members?.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <AvatarWrapper>
                      <UserAvatar user={member.user} size="md" />
                    </AvatarWrapper>
                    <MemberInfo>
                      <MemberName>
                        {member.user.username}
                        {member.user.id === currentUserId && ' (You)'}
                      </MemberName>
                      <MemberEmail>{member.user.email}</MemberEmail>
                    </MemberInfo>
                  </TableCell>
                  <TableCell>
                    <RoleBadge $role={member.role}>{member.role}</RoleBadge>
                  </TableCell>
                  <TableCell>{formatDate(project.createdAt)}</TableCell>
                  <TableCell>
                    {canManageSettings && member.role !== 'OWNER' && member.user.id !== currentUserId && (
                      <ActionButton
                        variant="outline"
                        onClick={() => handleRoleChange(member.id, member.role === 'ADMIN' ? 'MEMBER' : 'ADMIN')}
                        disabled={roleLoading}
                      >
                        {member.role === 'ADMIN' ? 'Demote to Member' : 'Promote to Admin'}
                      </ActionButton>
                    )}
                    {member.user.id !== currentUserId && member.role !== 'OWNER' && (
                      <ActionButton
                        variant="destructive"
                        onClick={() => openRemoveModal(member)}
                        disabled={removeLoading}
                        style={{ marginLeft: '0.5rem' }}
                      >
                        Remove
                      </ActionButton>
                    )}
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
    </>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default MembersList;
