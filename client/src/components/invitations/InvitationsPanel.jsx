import {
  PanelOverlay,
  PanelContainer,
  PanelHeader,
  PanelTitle,
  InvitationCount,
  CloseButton,
  InvitationsList,
  InvitationCard,
  ProjectInfo,
  ProjectIcon,
  CardBody,
  ProjectName,
  ProjectKey,
  InvitationMeta,
  MetaItem,
  RoleBadge,
  ExpiryBadge,
  InvitedBy,
  Actions,
  ActionButton,
  LoadingState,
  LoadingSpinner,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  ErrorState,
  ErrorIcon,
  RetryButton,
} from "./InvitationsPanel.styles";
import { X, Check, Bell, Clock, User } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ui/confirm-modal/ConfirmModal";
import {
  useGetMyInvitationsQuery,
  useAcceptInvitationMutation,
  useDeclineInvitationMutation,
} from "../../reducers/slices/invitation/invitation.apiSlice";
import { formatDistanceToNow } from "../../utils/date";

const InvitationsPanel = ({ onClose }) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetMyInvitationsQuery();
  const [acceptInvitation, { isLoading: isAccepting }] = useAcceptInvitationMutation();
  const [declineInvitation, { isLoading: isDeclining }] = useDeclineInvitationMutation();

  const invitations = data?.data || [];
  const isProcessing = isAccepting || isDeclining;
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);
  const [invitationToDecline, setInvitationToDecline] = useState(null);

  const handleAccept = async (invitation) => {
    try {
      await acceptInvitation(invitation.id).unwrap();
      toast.success(`You have joined ${invitation.project.name} as ${invitation.role}`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to accept invitation");
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
      toast.success(`Invitation to ${invitationToDecline.project.name} declined`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to decline invitation");
    } finally {
      setShowDeclineConfirm(false);
      setInvitationToDecline(null);
    }
  };

  const handleDeclineCancel = () => {
    setShowDeclineConfirm(false);
    setInvitationToDecline(null);
  };

  // Calculate time remaining for invitation
  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires - now;

    if (diff <= 0) {
      return { text: "Expired", expired: true };
    }

    return {
      text: formatDistanceToNow(expiresAt),
      expired: false,
    };
  };

  // Handle panel click to prevent closing
  const handlePanelClick = (e) => {
    e.stopPropagation();
  };

  return (
    <PanelOverlay onClick={onClose}>
      <PanelContainer onClick={handlePanelClick}>
        <PanelHeader>
          <PanelTitle>
            <Bell size={20} />
            Invitations
            {invitations.length > 0 && (
              <InvitationCount>{invitations.length}</InvitationCount>
            )}
          </PanelTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </PanelHeader>

        <InvitationsList>
          {isLoading ? (
            <LoadingState>
              <LoadingSpinner />
              <span>Loading invitations...</span>
            </LoadingState>
          ) : error ? (
            <ErrorState>
              <ErrorIcon>
                <Bell size={24} />
              </ErrorIcon>
              <EmptyTitle>Failed to load</EmptyTitle>
              <EmptyDescription>
                {error?.data?.message || "Unable to fetch invitations"}
              </EmptyDescription>
              <RetryButton onClick={() => refetch()}>Try Again</RetryButton>
            </ErrorState>
          ) : invitations.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <Bell size={32} />
              </EmptyIcon>
              <EmptyTitle>No pending invitations</EmptyTitle>
              <EmptyDescription>
                When someone invites you to join their project, you'll see.
              </EmptyDescription>
            </EmptyState>
          ) : (
            invitations.map((invitation) => {
              const { text: timeRemaining, expired } = getTimeRemaining(
                invitation.expiresAt
              );

              return (
                <InvitationCard key={invitation.id}>
                  <ProjectInfo>
                    <ProjectIcon>
                      {invitation.project.key.substring(0, 2).toUpperCase()}
                    </ProjectIcon>
                    <CardBody>
                      <ProjectName>{invitation.project.name}</ProjectName>
                      <ProjectKey>{invitation.project.key}</ProjectKey>

                      <InvitationMeta>
                        <RoleBadge>{invitation.role}</RoleBadge>
                        <ExpiryBadge
                          style={{
                            background: expired ? "#fee2e2" : "#fef3c7",
                            color: expired ? "#dc2626" : "#b45309",
                          }}
                        >
                          <Clock size={12} />
                          {expired ? "Expired" : timeRemaining}
                        </ExpiryBadge>
                      </InvitationMeta>

                      <InvitedBy>
                        <User size={12} style={{ marginRight: "0.25rem" }} />
                        Invited by{" "}
                        <strong>{invitation.invitedBy?.username}</strong>
                      </InvitedBy>
                    </CardBody>
                  </ProjectInfo>

                  <Actions>
                    <ActionButton
                      variant="accept"
                      onClick={() => handleAccept(invitation)}
                      disabled={isProcessing || expired}
                    >
                      <Check size={16} />
                      Accept
                    </ActionButton>
                    <ActionButton
                      variant="decline"
                      onClick={() => handleDeclineClick(invitation)}
                      disabled={isProcessing}
                    >
                      <X size={16} />
                      Decline
                    </ActionButton>
                  </Actions>
                </InvitationCard>
              );
            })
          )}
        </InvitationsList>
      </PanelContainer>
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
    </PanelOverlay>
  );
};

export default InvitationsPanel;
