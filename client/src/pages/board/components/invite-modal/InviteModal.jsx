import { useState } from "react";
import styled from "styled-components";
import { Mail, UserPlus, X, Users } from "lucide-react";
import Modal from "../../../../components/ui/modal/Modal";
import Button from "../../../../components/ui/button/Button";
import ConfirmModal from "../../../../components/ui/confirm-modal/ConfirmModal";
import {
  useSendInvitationMutation,
  useGetProjectInvitationsQuery,
  useCancelInvitationMutation,
} from "../../../../reducers/slices/invitation/invitation.apiSlice";

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
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
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
  max-height: 200px;
  overflow-y: auto;
`;

const PendingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
`;

const PendingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const PendingEmail = styled.span`
  font-weight: 500;
  color: #111827;
`;

const PendingRole = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

const CancelButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 0.75rem;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const InviteModal = ({ isOpen, onClose, projectId }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [error, setError] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [invitationToCancel, setInvitationToCancel] = useState(null);

  const { data: invitationsData } =
    useGetProjectInvitationsQuery(projectId, { skip: !projectId });
  const [sendInvitation, { isLoading: isSending }] = useSendInvitationMutation();
  const [cancelInvitation] = useCancelInvitationMutation();

  const pendingInvitations = invitationsData?.data || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      await sendInvitation({ projectId, email: email.trim(), role });
      setEmail("");
      // Invitations will be refetched automatically
    } catch (err) {
      console.log(err);
      setError(err?.data?.message || "Failed to send invitation");
    }
  };

  const handleCancelClick = (invitation) => {
    setInvitationToCancel(invitation);
    setShowCancelConfirm(true);
  };

  const handleConfirmCancel = async () => {
    if (!invitationToCancel) return;

    try {
      await cancelInvitation({ projectId, invitationId: invitationToCancel.id });
    } catch (err) {
      console.error("Failed to cancel invitation:", err);
    } finally {
      setShowCancelConfirm(false);
      setInvitationToCancel(null);
    }
  };

  const handleCancelModal = () => {
    setShowCancelConfirm(false);
    setInvitationToCancel(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Team Members">
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="colleague@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ButtonGroup>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSending}>
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
            {pendingInvitations.map((invitation) => (
              <PendingItem key={invitation.id}>
                <PendingInfo>
                  <PendingEmail>{invitation.email}</PendingEmail>
                  <PendingRole>
                    Invited as {invitation.role} by {invitation.invitedBy?.username}
                  </PendingRole>
                </PendingInfo>
                <CancelButton
                  onClick={() => handleCancelClick(invitation)}
                >
                  Cancel
                </CancelButton>
              </PendingItem>
            ))}
          </PendingList>
        </Section>
      )}
      <ConfirmModal
        isOpen={showCancelConfirm}
        onClose={handleCancelModal}
        onConfirm={handleConfirmCancel}
        title="Cancel Invitation"
        message="Are you sure you want to cancel this invitation? The user will not be able to join the project."
        confirmText="Cancel Invitation"
        cancelText="Keep Invitation"
        variant="danger"
      />
    </Modal>
  );
};

export default InviteModal;
