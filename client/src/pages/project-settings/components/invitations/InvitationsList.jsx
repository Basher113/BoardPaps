import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
  PendingList,
  PendingItem,
  PendingInfo,
  PendingEmail,
  PendingRole,
  PendingActions,

} from '../../ProjectSettings.styles';

const InvitationsList = ({ project }) => {
 
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>Pending Invitations</SectionTitle>
        <SectionDescription>View and manage pending invitations</SectionDescription>
      </SectionHeader>
      <SectionContent>
        {project.invitations?.length > 0 ? (
          <PendingList>
            {project.invitations.map((invitation) => (
              <PendingItem key={invitation.id}>
                <PendingInfo>
                  <PendingEmail>{invitation.email}</PendingEmail>
                  <PendingRole>
                    Invited as {invitation.role} by {invitation.invitedBy?.username}
                  </PendingRole>
                </PendingInfo>
                <PendingActions>
                  
                </PendingActions>
              </PendingItem>
            ))}
          </PendingList>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            No pending invitations
          </div>
        )}
      </SectionContent>
    </Section>
  );
};

export default InvitationsList;
