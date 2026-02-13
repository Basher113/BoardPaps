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
import UserAvatar from '../../../../components/ui/user-avatar/UserAvatar';

const MembersList = ({
  project,
  currentUserId,
  canManageSettings,
  roleLoading,
  removeLoading,
  onRoleChange,
  onRemoveMember
}) => {
  return (
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
                      onClick={() => onRoleChange(member.id, member.role === 'ADMIN' ? 'MEMBER' : 'ADMIN')}
                      disabled={roleLoading}
                    >
                      {member.role === 'ADMIN' ? 'Demote to Member' : 'Promote to Admin'}
                    </ActionButton>
                  )}
                  {member.user.id !== currentUserId && member.role !== 'OWNER' && (
                    <ActionButton
                      variant="destructive"
                      onClick={() => onRemoveMember(member)}
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
