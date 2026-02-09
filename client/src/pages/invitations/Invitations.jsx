import { useState } from "react";
import styled from "styled-components";
import { Mail, Check, X, Bell, Briefcase, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/button/Button";
import ConfirmModal from "../../components/ui/confirm-modal/ConfirmModal";
import {
  useGetMyInvitationsQuery,
  useAcceptInvitationMutation,
  useDeclineInvitationMutation,
} from "../../reducers/slices/invitation/invitation.apiSlice";
import { formatDistanceToNow } from "../../utils/date";

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f3f4f6;
`;

const Header = styled.header`
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
`;

const HeaderContent = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #f3f4f6;
  color: #374151;
  transition: all 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const InvitationCount = styled.span`
  background: #6366f1;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
`;

const Content = styled.main`
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const Section = styled.section`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

const InvitationsList = styled.div`
  display: flex;
  flex-direction: column;
`;

const InvitationCard = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f9fafb;
  }
`;

const CardContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const ProjectIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const CardBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProjectName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
`;

const ProjectKey = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const InvitationDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.75rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const DetailLabel = styled.span`
  color: #9ca3af;
`;

const DetailValue = styled.span`
  color: #374151;
  font-weight: 500;
`;

const InvitedBy = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.75rem;

  strong {
    color: #374151;
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
`;

const AcceptButton = styled(Button)`
  flex: 1;
`;

const DeclineButton = styled(Button)`
  flex: 1;
`;

const EmptyState = styled.div`
  padding: 4rem 1.5rem;
  text-align: center;
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  margin: 0 auto 1.5rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const EmptyDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  max-width: 400px;
  margin: 0 auto;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  color: #6b7280;
`;

const InvitationsPage = () => {
  const { data, isLoading } = useGetMyInvitationsQuery();
  const [acceptInvitation, { isLoading: isAccepting }] = useAcceptInvitationMutation();
  const [declineInvitation, { isLoading: isDeclining }] = useDeclineInvitationMutation();

  const invitations = data?.data || [];
  const isProcessing = isAccepting || isDeclining;
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);
  const [invitationToDecline, setInvitationToDecline] = useState(null);

  const handleAccept = async (invitationId) => {
    try {
      await acceptInvitation(invitationId).unwrap();
    } catch (error) {
      console.error("Failed to accept invitation:", error);
    }
  };

  const handleDeclineClick = (invitation) => {
    setInvitationToDecline(invitation);
    setShowDeclineConfirm(true);
  };

  const handleConfirmDecline = async () => {
    if (!invitationToDecline) return;

    try {
      await declineInvitation(invitationToDecline.id).unwrap();
    } catch (error) {
      console.error("Failed to decline invitation:", error);
    } finally {
      setShowDeclineConfirm(false);
      setInvitationToDecline(null);
    }
  };

  const handleDeclineCancel = () => {
    setShowDeclineConfirm(false);
    setInvitationToDecline(null);
  };

  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          <BackButton to="/app">
            <ArrowLeft size={20} />
          </BackButton>
          <HeaderTitle>
            <Bell size={24} />
            Invitations
            {invitations.length > 0 && (
              <InvitationCount>{invitations.length}</InvitationCount>
            )}
          </HeaderTitle>
        </HeaderContent>
      </Header>

      <Content>
        {isLoading ? (
          <LoadingState>Loading invitations...</LoadingState>
        ) : invitations.length === 0 ? (
          <Section>
            <EmptyState>
              <EmptyIcon>
                <Mail size={40} />
              </EmptyIcon>
              <EmptyTitle>No pending invitations</EmptyTitle>
              <EmptyDescription>
                You don't have any project invitations at the moment. When someone
                invites you to join their project, you'll see it here.
              </EmptyDescription>
            </EmptyState>
          </Section>
        ) : (
          <Section>
            <SectionHeader>
              <SectionTitle>
                <Briefcase size={20} />
                Project Invitations
              </SectionTitle>
              <SectionDescription>
                Review and respond to your pending project invitations
              </SectionDescription>
            </SectionHeader>

            <InvitationsList>
              {invitations.map((invitation) => (
                <InvitationCard key={invitation.id}>
                  <CardContent>
                    <ProjectIcon>
                      {invitation.project.key.substring(0, 2).toUpperCase()}
                    </ProjectIcon>
                    <CardBody>
                      <ProjectName>{invitation.project.name}</ProjectName>
                      <ProjectKey>{invitation.project.key}</ProjectKey>

                      <InvitationDetails>
                        <DetailItem>
                          <DetailLabel>Role:</DetailLabel>
                          <DetailValue>{invitation.role}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                          <DetailLabel>Expires:</DetailLabel>
                          <DetailValue>
                            {formatDistanceToNow(new Date(invitation.expiresAt))}
                          </DetailValue>
                        </DetailItem>
                      </InvitationDetails>

                      <InvitedBy>
                        Invited by <strong>{invitation.invitedBy?.username}</strong>
                      </InvitedBy>
                    </CardBody>
                  </CardContent>

                  <CardActions>
                    <AcceptButton
                      onClick={() => handleAccept(invitation.id)}
                      disabled={isProcessing}
                    >
                      <Check size={18} style={{ marginRight: "0.5rem" }} />
                      Accept
                    </AcceptButton>
                    <DeclineButton
                      variant="secondary"
                      onClick={() => handleDeclineClick(invitation)}
                      disabled={isProcessing}
                    >
                      <X size={18} style={{ marginRight: "0.5rem" }} />
                      Decline
                    </DeclineButton>
                  </CardActions>
                </InvitationCard>
              ))}
            </InvitationsList>
          </Section>
        )}
      </Content>
      <ConfirmModal
        isOpen={showDeclineConfirm}
        onClose={handleDeclineCancel}
        onConfirm={handleConfirmDecline}
        title="Decline Invitation"
        message="Are you sure you want to decline this invitation? This action cannot be undone."
        confirmText="Decline"
        cancelText="Cancel"
        variant="danger"
      />
    </PageContainer>
  );
};

export default InvitationsPage;
