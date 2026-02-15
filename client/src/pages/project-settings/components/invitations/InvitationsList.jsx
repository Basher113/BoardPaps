import { toast } from 'react-toastify';
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
  ResendButton,
  CancelButton
} from '../../ProjectSettings.styles';
import { RefreshCw } from 'lucide-react';

const InvitationsList = ({ project }) => {
  const handleResend = () => {
    // TODO: Implement resend invitation API
    toast.info('Resend invitation feature coming soon');
  };

  const handleCancel = () => {
    // TODO: Implement cancel invitation API
    toast.info('Cancel invitation feature coming soon');
  };

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
                  <ResendButton onClick={() => handleResend(invitation)}>
                    <RefreshCw size={14} />
                  </ResendButton>
                  <CancelButton onClick={() => handleCancel(invitation)}>
                    Cancel
                  </CancelButton>
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
