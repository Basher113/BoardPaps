import { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  DrawerOverlay,
  InviteDrawerContainer,
  DrawerHeader,
  HeaderTop,
  ProjectKey,
  CloseButton,
  DrawerTitle,
  DrawerContent,
  Section,
  SectionTitle,
  InputGroup,
  InputLabel,
  EmailInput,
  HelperText,
  TextAreaCustom,
  RoleSelect,
  DrawerFooter,
  FooterActions,
  ErrorMessage,
} from './InviteDrawer.styles';
import Button from '../../../../components/ui/button/Button';
import {
  useSendInvitationMutation,
} from '../../../../reducers/slices/invitation/invitation.apiSlice';

const InviteDrawer = ({ isOpen, onClose, projectId, projectName = 'Project' }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [sendInvitation, { isLoading: isSending }] = useSendInvitationMutation();

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await sendInvitation({ 
        projectId, 
        email: email.trim().toLowerCase(), 
        role,
        message: message.trim() || undefined 
      }).unwrap();

      toast.success(
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} />
          Invitation sent successfully
        </div>
      );

      // Reset form on success
      setEmail('');
      setMessage('');
      setRole('MEMBER');
      setError('');
      onClose();
    } catch (err) {
      const errorMessage = err?.data?.message || 'Failed to send invitation';
      setError(errorMessage);
      toast.error(
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          {errorMessage}
        </div>
      );
    }
  };

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Reset state when drawer closes
  const handleClose = () => {
    setEmail('');
    setMessage('');
    setRole('MEMBER');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <DrawerOverlay onClick={handleOverlayClick} />
      <InviteDrawerContainer>
        {/* Header */}
        <DrawerHeader>
          <HeaderTop>
            <ProjectKey>{projectName}</ProjectKey>
            <CloseButton onClick={handleClose}>
              <X size={20} />
            </CloseButton>
          </HeaderTop>
          <DrawerTitle>Invite Team</DrawerTitle>
        </DrawerHeader>

        {/* Content */}
        <DrawerContent>
          {/* Email */}
          <Section>
            <SectionTitle>Email Address</SectionTitle>
            <InputGroup>
              <EmailInput
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="colleague@example.com"
                disabled={isSending}
              />
              <HelperText>Enter the email address of the person you want to invite.</HelperText>
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </InputGroup>
          </Section>

          {/* Role */}
          <Section>
            <SectionTitle>Role</SectionTitle>
            <InputGroup>
              <RoleSelect
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isSending}
              >
                <option value="MEMBER">MEMBER - Can view and edit issues</option>
                <option value="ADMIN">ADMIN - Can manage settings and members</option>
              </RoleSelect>
            </InputGroup>
          </Section>

          {/* Message */}
          <Section>
            <SectionTitle>Invitation Message</SectionTitle>
            <InputGroup>
              <TextAreaCustom
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a personal note to your collaborator..."
                disabled={isSending}
                maxLength={250}
              />
            </InputGroup>
          </Section>
        </DrawerContent>

        {/* Footer */}
        <DrawerFooter>
          <FooterActions>
            <Button
              size='md'
              onClick={handleSubmit}
              disabled={isSending || !email.trim()}
            >
              {isSending ? 'Sending...' : 'Send Invitation'}
            </Button>
          </FooterActions>
        </DrawerFooter>
      </InviteDrawerContainer>
    </>
  );
};

export default InviteDrawer;
