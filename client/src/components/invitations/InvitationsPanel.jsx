import styled from "styled-components";
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
import { X, Check, Bell, Clock, User, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ui/confirm-modal/ConfirmModal";
import {
  useGetMyInvitationsQuery,
  useAcceptInvitationMutation,
  useDeclineInvitationMutation,
} from "../../reducers/slices/invitation/invitation.apiSlice";
import { formatDistanceToNow } from "../../utils/date";

const ToastMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Helper function to check if invitation is expiring soon (within 24 hours)
const isExpiringSoon = (expiresAt) => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const hoursUntilExpiry = (expiry - now) / (1000 * 60 * 60);
  return hoursUntilExpiry < 24 && hoursUntilExpiry > 0;
};

// Helper function to check if invitation is expired
const isExpired = (expiresAt) => {
  return new Date(expiresAt) < new Date();
};

const InvitationsPanel = ({ onClose }) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetMyInvitationsQuery();
  const [acceptInvitation, { isLoading: isAccepting }] = useAcceptInvitationMutation();
  const [declineInvitation, { isLoading: isDeclining }] = useDeclineInvitationMutation();

  const allInvitations = data?.data || [];
  // Filter out expired invitations
  const invitations = allInvitations.filter(inv => !isExpired(inv.expiresAt));
  const isProcessing = isAccepting || isDeclining;
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);
  const [invitationToDecline, setInvitationToDecline] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const handleAccept = async (invitation) => {
    setProcessingId(invitation.id);
    try {
      const result = await acceptInvitation(invitation.id).unwrap();
      toast.success(
        <ToastMessage>
          <CheckCircle size={18} />
          {result.message || `You have joined ${invitation.project.name} as ${invitation.role}`}
        </ToastMessage>
      );
    } catch (err) {
      toast.error(
        <ToastMessage>
          <AlertCircle size={18} />
          {err?.data?.message || "Failed to accept invitation"}
        </ToastMessage>
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeclineClick = (invitation) => {
    setInvitationToDecline(invitation);
    setShowDeclineConfirm(true);
  };

  const handleConfirmDecline = async () => {
    if (!invitationToDecline) return;

    setProcessingId(invitationToDecline.id);
    try {
      const result = await declineInvitation(invitationToDecline.id).unwrap();
      toast.success(
        <ToastMessage>
          <CheckCircle size={18} />
          {result.message || "Invitation declined"}
        </ToastMessage>
      );
    } catch (err) {
      toast.error(
        <ToastMessage>
          <AlertCircle size={18} />
          {err?.data?.message || "Failed to decline invitation"}
        </ToastMessage>
      );
    } finally {
      setShowDeclineConfirm(false);
      setInvitationToDecline(null);
      setProcessingId(null);
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
                When someone invites you to join their project, you'll see it here.
              </EmptyDescription>
            </EmptyState>
          ) : (
            invitations.map((invitation) => {
              const { text: timeRemaining, expired } = getTimeRemaining(
                invitation.expiresAt
              );
              const expiringSoon = isExpiringSoon(invitation.expiresAt);
              const isThisProcessing = processingId === invitation.id;

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
                        <RoleBadge role={invitation.role}>
                          {invitation.role}
                        </RoleBadge>
                        <ExpiryBadge
                          style={{
                            background: expired ? "#fee2e2" : expiringSoon ? "#fef3c7" : "#f3f4f6",
                            color: expired ? "#dc2626" : expiringSoon ? "#b45309" : "#6b7280",
                          }}
                        >
                          <Clock size={12} />
                          {expired ? "Expired" : expiringSoon ? `Soon: ${timeRemaining}` : timeRemaining}
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
                      isLoading={isThisProcessing && isAccepting}
                    >
                      <Check size={16} />
                      Accept
                    </ActionButton>
                    <ActionButton
                      variant="decline"
                      onClick={() => handleDeclineClick(invitation)}
                      disabled={isProcessing}
                      isLoading={isThisProcessing && isDeclining}
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
        message={`Are you sure you want to decline the invitation to join ${invitationToDecline?.project?.name || 'this project'}? This action cannot be undone.`}
        confirmText="Decline"
        cancelText="Cancel"
        variant="danger"
      />
    </PanelOverlay>
  );
};

export default InvitationsPanel;
