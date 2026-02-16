import { useState } from "react";
import styled from "styled-components";
import { Mail, UserPlus, X, Users, Clock, AlertCircle, CheckCircle, Copy, RefreshCw, MessageSquare } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "../../../../components/ui/modal/Modal";
import Button from "../../../../components/ui/button/Button";
import ConfirmModal from "../../../../components/ui/confirm-modal/ConfirmModal";
import {
  useSendInvitationMutation,
  useGetProjectInvitationsQuery,
  useCancelInvitationMutation,
  useResendInvitationMutation,
} from "../../../../reducers/slices/invitation/invitation.apiSlice";
import { formatDistanceToNow } from "../../../../utils/date";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const Section = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PendingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 240px;
  overflow-y: auto;
`;

const PendingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  border: 1px solid #e5e7eb;
`;

const PendingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
`;

const PendingEmail = styled.span`
  font-weight: 500;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PendingMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: #6b7280;
`;

const RoleTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${props => props.role === 'ADMIN' ? '#fef3c7' : '#e0e7ff'};
  color: ${props => props.role === 'ADMIN' ? '#92400e' : '#3730a3'};
`;

const ExpiryTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.isExpiringSoon ? '#dc2626' : '#6b7280'};
`;

const CancelButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #fef2f2;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: #6366f1;
  cursor: pointer;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    background-color: #eef2ff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const TextArea = styled.textarea`
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const CharCount = styled.span`
  font-size: 0.75rem;
  color: ${props => props.isNearLimit ? '#f59e0b' : '#9ca3af'};
  text-align: right;
  margin-top: 0.25rem;
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SuccessMessage = styled.p`
  color: #059669;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ToastMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EmptyPending = styled.div`
  text-align: center;
  padding: 1.5rem;
  color: #9ca3af;
  font-size: 0.875rem;
`;

// Helper function to check if invitation is expiring soon (within 24 hours)
const isExpiringSoon = (expiresAt) => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const hoursUntilExpiry = (expiry - now) / (1000 * 60 * 60);
  return hoursUntilExpiry < 24 && hoursUntilExpiry > 0;
};

const InviteModal = ({ isOpen, onClose, projectId }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [invitationToCancel, setInvitationToCancel] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [resendingId, setResendingId] = useState(null);

  const { data: invitationsData } =
    useGetProjectInvitationsQuery(projectId, { skip: !projectId });
  const [sendInvitation, { isLoading: isSending }] = useSendInvitationMutation();
  const [cancelInvitation] = useCancelInvitationMutation();
  const [resendInvitation] = useResendInvitationMutation();

  const pendingInvitations = invitationsData?.data || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      await sendInvitation({ 
        projectId, 
        email: email.trim(), 
        role,
        message: message.trim() || undefined 
      }).unwrap();
      setEmail("");
      setMessage("");
      setSuccess(`Invitation sent to ${email.trim()}`);
      toast.success(
        <ToastMessage>
          <CheckCircle size={18} />
          Invitation sent successfully
        </ToastMessage>
      );
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const errorMessage = err?.data?.message || "Failed to send invitation";
      setError(errorMessage);
      toast.error(
        <ToastMessage>
          <AlertCircle size={18} />
          {errorMessage}
        </ToastMessage>
      );
    }
  };

  const handleResend = async (invitation) => {
    setResendingId(invitation.id);
    try {
      await resendInvitation({ projectId, invitationId: invitation.id }).unwrap();
      toast.success(
        <ToastMessage>
          <CheckCircle size={18} />
          Invitation resent to {invitation.email}
        </ToastMessage>
      );
    } catch (err) {
      toast.error(
        <ToastMessage>
          <AlertCircle size={18} />
          {err?.data?.message || "Failed to resend invitation"}
        </ToastMessage>
      );
    } finally {
      setResendingId(null);
    }
  };

  const handleCancelClick = (invitation) => {
    setInvitationToCancel(invitation);
    setShowCancelConfirm(true);
  };

  const handleConfirmCancel = async () => {
    if (!invitationToCancel) return;

    setCancellingId(invitationToCancel.id);
    try {
      await cancelInvitation({ projectId, invitationId: invitationToCancel.id }).unwrap();
      toast.success(
        <ToastMessage>
          <CheckCircle size={18} />
          Invitation cancelled
        </ToastMessage>
      );
    } catch (err) {
      toast.error(
        <ToastMessage>
          <AlertCircle size={18} />
          {err?.data?.message || "Failed to cancel invitation"}
        </ToastMessage>
      );
    } finally {
      setShowCancelConfirm(false);
      setInvitationToCancel(null);
      setCancellingId(null);
    }
  };

  const handleCancelModal = () => {
    setShowCancelConfirm(false);
    setInvitationToCancel(null);
  };

  const handleModalClose = () => {
    setEmail("");
    setRole("MEMBER");
    setMessage("");
    setError("");
    setSuccess("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} title="Invite Team Members">
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="colleague@company.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
              setSuccess("");
            }}
            disabled={isSending}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="role">Role</Label>
          <Select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={isSending}
          >
            <option value="MEMBER">Member - Can view and edit issues</option>
            <option value="ADMIN">Admin - Can manage settings and members</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="message">
            <MessageSquare size={14} style={{ marginRight: "0.5rem" }} />
            Personal Message (optional)
          </Label>
          <TextArea
            id="message"
            placeholder="Add a personal note to include in the invitation email..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSending}
            maxLength={250}
          />
          <CharCount isNearLimit={message.length > 200}>
            {message.length}/250
          </CharCount>
        </FormGroup>

        {error && (
          <ErrorMessage>
            <AlertCircle size={16} />
            {error}
          </ErrorMessage>
        )}

        {success && (
          <SuccessMessage>
            <CheckCircle size={16} />
            {success}
          </SuccessMessage>
        )}

        <ButtonGroup>
          <Button type="button" variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSending || !email.trim()}>
            {isSending ? "Sending..." : "Send Invitation"}
          </Button>
        </ButtonGroup>
      </Form>

      {pendingInvitations.length > 0 && (
        <Section>
          <SectionTitle>
            <Users size={16} />
            Pending Invitations ({pendingInvitations.length})
          </SectionTitle>
          <PendingList>
            {pendingInvitations.map((invitation) => {
              const expiringSoon = isExpiringSoon(invitation.expiresAt);
              const isCancelling = cancellingId === invitation.id;
              const isResending = resendingId === invitation.id;
              
              return (
                <PendingItem key={invitation.id}>
                  <PendingInfo>
                    <PendingEmail>{invitation.email}</PendingEmail>
                    <PendingMeta>
                      <RoleTag role={invitation.role}>
                        {invitation.role}
                      </RoleTag>
                      <ExpiryTag isExpiringSoon={expiringSoon}>
                        <Clock size={12} />
                        {expiringSoon ? "Expires soon" : formatDistanceToNow(new Date(invitation.expiresAt))}
                      </ExpiryTag>
                    </PendingMeta>
                  </PendingInfo>
                  <ActionButtons>
                    <ResendButton
                      onClick={() => handleResend(invitation)}
                      disabled={isResending || isCancelling}
                      title="Resend invitation"
                    >
                      <RefreshCw size={12} />
                      {isResending ? "Sending..." : "Resend"}
                    </ResendButton>
                    <CancelButton
                      onClick={() => handleCancelClick(invitation)}
                      disabled={isCancelling || isResending}
                    >
                      {isCancelling ? "Cancelling..." : "Cancel"}
                    </CancelButton>
                  </ActionButtons>
                </PendingItem>
              );
            })}
          </PendingList>
        </Section>
      )}

      {pendingInvitations.length === 0 && (
        <Section>
          <SectionTitle>
            <Users size={16} />
            Pending Invitations
          </SectionTitle>
          <EmptyPending>
            No pending invitations. Invite team members to collaborate!
          </EmptyPending>
        </Section>
      )}

      <ConfirmModal
        isOpen={showCancelConfirm}
        onClose={handleCancelModal}
        onConfirm={handleConfirmCancel}
        title="Cancel Invitation"
        message={`Are you sure you want to cancel the invitation for ${invitationToCancel?.email}? They will not be able to join the project.`}
        confirmText="Cancel Invitation"
        cancelText="Keep Invitation"
        variant="danger"
      />
    </Modal>
  );
};

export default InviteModal;
