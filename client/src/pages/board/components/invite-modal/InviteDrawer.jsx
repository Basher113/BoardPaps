import { useState, useRef, useCallback } from 'react';
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
  RecipientsWrapper,
  EmailPill,
  PillRemove,
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
  const [emails, setEmails] = useState([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const inputRef = useRef(null);

  const [sendInvitation, { isLoading: isSending }] = useSendInvitationMutation();

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Add email to list
  const addEmail = useCallback((email) => {
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail) return;
    
    if (!isValidEmail(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (emails.includes(trimmedEmail)) {
      setError('Email already added');
      return;
    }
    
    setEmails(prev => [...prev, trimmedEmail]);
    setCurrentEmail('');
    setError('');
  }, [emails]);

  // Handle key down in input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addEmail(currentEmail);
    }
    
    // Remove last email on backspace if input is empty
    if (e.key === 'Backspace' && !currentEmail && emails.length > 0) {
      setEmails(prev => prev.slice(0, -1));
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const pastedEmails = pastedText.split(/[,\s]+/).filter(email => email.trim());
    
    pastedEmails.forEach(email => {
      if (isValidEmail(email.trim())) {
        addEmail(email.trim());
      }
    });
  };

  // Remove email from list
  const removeEmail = (emailToRemove) => {
    setEmails(prev => prev.filter(email => email !== emailToRemove));
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (emails.length === 0) {
      setError('Please add at least one email address');
      return;
    }

    try {
      // Send invitations one by one
      const results = await Promise.allSettled(
        emails.map(email => 
          sendInvitation({ 
            projectId, 
            email, 
            role,
            message: message.trim() || undefined 
          }).unwrap()
        )
      );

      const succeeded = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      if (succeeded > 0) {
        toast.success(
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} />
            {succeeded} invitation{succeeded > 1 ? 's' : ''} sent successfully
          </div>
        );
      }

      if (failed > 0) {
        toast.error(
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            {failed} invitation{failed > 1 ? 's' : ''} failed to send
          </div>
        );
      }

      // Reset form on success
      if (succeeded > 0) {
        setEmails([]);
        setMessage('');
        setRole('MEMBER');
        onClose();
      }
    } catch (err) {
      const errorMessage = err?.data?.message || 'Failed to send invitations';
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
    setEmails([]);
    setCurrentEmail('');
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
          {/* Recipients */}
          <Section>
            <SectionTitle>Recipients</SectionTitle>
            <InputGroup>
              <RecipientsWrapper onClick={() => inputRef.current?.focus()}>
                {emails.map((email) => (
                  <EmailPill key={email}>
                    {email}
                    <PillRemove 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeEmail(email);
                      }}
                      type="button"
                    >
                      <X size={12} />
                    </PillRemove>
                  </EmailPill>
                ))}
                <EmailInput
                  ref={inputRef}
                  type="email"
                  value={currentEmail}
                  onChange={(e) => {
                    setCurrentEmail(e.target.value);
                    setError('');
                  }}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  placeholder={emails.length === 0 ? 'Add email...' : ''}
                  disabled={isSending}
                />
              </RecipientsWrapper>
              <HelperText>Press enter or comma to add multiple email addresses.</HelperText>
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
                <option value="MEMBER">MEMBER - Can view and create issues</option>
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
                placeholder="Type a personal note to your collaborators..."
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
              disabled={isSending || emails.length === 0}
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
