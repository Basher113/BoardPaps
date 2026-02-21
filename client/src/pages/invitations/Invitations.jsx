import { useState, useEffect } from "react";
import { Clock, CheckCircle, AlertCircle, User, Calendar, Users } from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setActiveView } from "../../reducers/slices/navigation/navigation.slice";
import ConfirmModal from "../../components/ui/confirm-modal/ConfirmModal";
import Button from "../../components/ui/button/Button";
import {
  useGetMyInvitationsQuery,
  useAcceptInvitationMutation,
  useDeclineInvitationMutation,
} from "../../reducers/slices/invitation/invitation.apiSlice";
import { formatDistanceToNow } from "../../utils/date";
import { InvitationCardSkeleton, ButtonSpinner } from "../../components/ui/skeleton/Skeleton";
import {
  PageContainer,
  Header,
  HeaderTop,
  HeaderLeft,
  Title,
  Subtitle,

  Tabs,
  Tab,
  TabCount,
  Content,
  InvitationsList,
  InvitationCard,
  InvitationContent,
  InvitationAvatar,
  InvitationInfo,
  InvitationTitle,
  InvitationDetails,
  InvitationMeta,
  MetaItem,
  MetaIcon,
  InvitationActions,
  StatusBadge,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  ToastMessage,
} from "./Invitations.styles";

// Gradient colors for avatars
const avatarGradients = [
  "linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)",
  "linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%)",
  "linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)",
];

// Get initials from name
const getInitials = (name) => {
  if (!name) return "??";
  const words = name.split(" ");
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Get consistent gradient based on string
const getGradient = (str) => {
  if (!str) return avatarGradients[0];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarGradients[Math.abs(hash) % avatarGradients.length];
};

// Helper function to check if invitation is expired
const isExpired = (expiresAt) => {
  return new Date(expiresAt) < new Date();
};

const InvitationsPage = () => {
  const dispatch = useDispatch();
  
  // Set active view on mount
  useEffect(() => {
    dispatch(setActiveView('invitations'));
  }, [dispatch]);
  
  const { data, isLoading } = useGetMyInvitationsQuery();
  const [acceptInvitation, { isLoading: isAccepting }] = useAcceptInvitationMutation();
  const [declineInvitation, { isLoading: isDeclining }] = useDeclineInvitationMutation();

  const invitations = data?.data || [];
  const isProcessing = isAccepting || isDeclining;
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);
  const [invitationToDecline, setInvitationToDecline] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  // Filter invitations by status
  const pendingInvitations = invitations.filter(inv => inv.status === "PENDING" && !isExpired(inv.expiresAt));
  const acceptedInvitations = invitations.filter(inv => inv.status === "ACCEPTED");
  const declinedInvitations = invitations.filter(inv => inv.status === "DECLINED");

  // Get displayed invitations based on active tab
  const getDisplayedInvitations = () => {
    switch (activeTab) {
      case "pending":
        return pendingInvitations;
      case "accepted":
        return acceptedInvitations;
      case "declined":
        return declinedInvitations;
      default:
        return pendingInvitations;
    }
  };

  // Filter by status filter
  const getFilteredInvitations = () => {
    const displayed = getDisplayedInvitations();
    return displayed.filter(inv => inv.status.toLowerCase() === activeTab);
  };

  const displayedInvitations = getFilteredInvitations();

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
    } catch (error) {
      toast.error(
        <ToastMessage>
          <AlertCircle size={18} />
          {error?.data?.message || "Failed to accept invitation"}
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
    } catch (error) {
      toast.error(
        <ToastMessage>
          <AlertCircle size={18} />
          {error?.data?.message || "Failed to decline invitation"}
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <Header>
          <HeaderTop>
            <HeaderLeft>
              <Title>Invitations</Title>
              <Subtitle>Loading your invitations...</Subtitle>
            </HeaderLeft>
          </HeaderTop>
        </Header>
        <Tabs>
          <Tab $active>Pending <TabCount>0</TabCount></Tab>
          <Tab>Accepted <TabCount>0</TabCount></Tab>
          <Tab>Declined <TabCount>0</TabCount></Tab>
        </Tabs>
        <Content>
          <InvitationsList>
            {Array.from({ length: 3 }).map((_, i) => (
              <InvitationCardSkeleton key={i} />
            ))}
          </InvitationsList>
        </Content>
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer>
        <Header>
          <HeaderTop>
            <HeaderLeft>
              <Title>Invitations</Title>
              <Subtitle>Manage your project invitations</Subtitle>
            </HeaderLeft>
            
          </HeaderTop>
        </Header>

        <Tabs>
          <Tab $active={activeTab === "pending"} onClick={() => handleTabChange("pending")}>
            Pending
            <TabCount>{pendingInvitations.length}</TabCount>
          </Tab>
          <Tab $active={activeTab === "accepted"} onClick={() => handleTabChange("accepted")}>
            Accepted
            <TabCount>{acceptedInvitations.length}</TabCount>
          </Tab>
          <Tab $active={activeTab === "declined"} onClick={() => handleTabChange("declined")}>
            Declined
            <TabCount>{declinedInvitations.length}</TabCount>
          </Tab>
        </Tabs>

        <Content>
          {displayedInvitations.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📧</EmptyIcon>
              <EmptyTitle>
                {activeTab === "pending" && "No pending invitations"}
                {activeTab === "accepted" && "No accepted invitations"}
                {activeTab === "declined" && "No declined invitations"}
              </EmptyTitle>
              <EmptyDescription>
                {activeTab === "pending" && "You don't have any pending project invitations. When someone invites you to join their project, you'll see it here."}
                {activeTab === "accepted" && "You haven't accepted any invitations yet. Accepted invitations will appear here."}
                {activeTab === "declined" && "You don't have any declined invitations."}
              </EmptyDescription>
            </EmptyState>
          ) : (
            <InvitationsList>
              {displayedInvitations.map((invitation) => {
                const isThisProcessing = processingId === invitation.id;
                const inviterName = invitation.invitedBy?.username || "Unknown";
                const projectName = invitation.project?.name || "Unknown Project";
                const gradient = getGradient(projectName);
                const initials = getInitials(inviterName);
                const status = invitation.status.toLowerCase();
                
                return (
                  <InvitationCard key={invitation.id}>
                    <InvitationContent>
                      <InvitationAvatar $gradient={gradient}>
                        {initials}
                      </InvitationAvatar>
                      <InvitationInfo>
                        <InvitationTitle>
                          {inviterName} invited you to {projectName}
                        </InvitationTitle>
                        <InvitationDetails>
                          You've been invited to collaborate on the {projectName} team as a {invitation.role || "Member"}.
                        </InvitationDetails>
                        <InvitationMeta>
                          <MetaItem>
                            <MetaIcon>
                              <Calendar size={14} />
                            </MetaIcon>
                            <span>{formatDistanceToNow(new Date(invitation.createdAt))}</span>
                          </MetaItem>
                          <MetaItem>
                            <MetaIcon>
                              <Users size={14} />
                            </MetaIcon>
                            <span>{invitation.role || "Member"} Role</span>
                          </MetaItem>
                          <MetaItem>
                            <StatusBadge $status={status}>
                              {status.toUpperCase()}
                            </StatusBadge>
                          </MetaItem>
                        </InvitationMeta>
                      </InvitationInfo>
                    </InvitationContent>
                    <InvitationActions>
                      {invitation.status === "PENDING" && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleAccept(invitation)}
                            disabled={isProcessing}
                            style={{ 
                              padding: '0.625rem 1.25rem',
                              fontSize: '0.8125rem',
                              fontWeight: 500,
                              background: '#1a1a1a',
                              borderRadius: '8px',
                            }}
                          >
                            {isThisProcessing && isAccepting ? (
                              <>
                                <ButtonSpinner />
                                Accepting...
                              </>
                            ) : (
                              "Accept"
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeclineClick(invitation)}
                            disabled={isProcessing}
                            style={{ 
                              padding: '0.625rem 1.25rem',
                              fontSize: '0.8125rem',
                              fontWeight: 500,
                              background: 'white',
                              border: '1px solid #e0e0e0',
                              borderRadius: '8px',
                              color: '#1a1a1a',
                            }}
                          >
                            {isThisProcessing && isDeclining ? (
                              <>
                                <ButtonSpinner />
                                Declining...
                              </>
                            ) : (
                              "Decline"
                            )}
                          </Button>
                        </>
                      )}
                      {invitation.status === "ACCEPTED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          style={{ 
                            padding: '0.625rem 1.25rem',
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            background: 'white',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            color: '#808080',
                            cursor: 'not-allowed',
                          }}
                        >
                          Joined
                        </Button>
                      )}
                      {invitation.status === "DECLINED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          style={{ 
                            padding: '0.625rem 1.25rem',
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            background: 'white',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            color: '#808080',
                            cursor: 'not-allowed',
                          }}
                        >
                          Declined
                        </Button>
                      )}
                    </InvitationActions>
                  </InvitationCard>
                );
              })}
            </InvitationsList>
          )}
        </Content>
      </PageContainer>

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
    </>
  );
};

export default InvitationsPage;
