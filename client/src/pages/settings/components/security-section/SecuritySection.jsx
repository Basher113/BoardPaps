import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
  Form,
  FormGroup,
  Label,
  RequiredMark,
  Input,
  Button,
  FormActions,
  ErrorMessage,
  SuccessMessage,
  Divider,
  HelperText,
  ModalFormGroup,
  ModalLabel
} from '../../Settings.styles';
import Modal from '../../../../components/ui/modal/Modal';
import { Lock, CheckCircle2, XCircle } from 'lucide-react';

const SecuritySection = ({ hasPassword }) => {
  const { user } = useUser();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const openPasswordModal = () => {
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError(null);
    setPasswordSuccess(null);
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    // Client-side validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    if (passwordForm.newPassword === passwordForm.currentPassword) {
      setPasswordError('New password must be different from current password');
      return;
    }

    setIsChangingPassword(true);

    try {
      // Use Clerk's client-side password update
      // This handles current password verification automatically
      await user.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      
      setPasswordSuccess('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(null);
      }, 1500);
    } catch (err) {
      console.error('Clerk password update error:', err);
      // Handle Clerk-specific errors
      const errorMessage = err.errors?.[0]?.message || err.message || 'Failed to change password';
      setPasswordError(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <>
      <Section>
        <SectionHeader>
          <SectionTitle>Security</SectionTitle>
          <SectionDescription>Manage your password and active sessions</SectionDescription>
        </SectionHeader>
        <SectionContent>
          <Form>
            <FormGroup>
              <Label>Password</Label>
              <div style={{ marginTop: '0.5rem' }}>
                <Button type="button" onClick={openPasswordModal} disabled={!hasPassword}>
                  <Lock size={16} style={{ marginRight: '0.5rem' }} />
                  Change Password
                </Button>
              </div>
              {!hasPassword && (
                <HelperText>Password cannot be changed for OAuth-only accounts</HelperText>
              )}
            </FormGroup>

            <Divider />
          </Form>
        </SectionContent>
      </Section>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
      >
        <Form onSubmit={handlePasswordSubmit}>
          <ModalFormGroup>
            <ModalLabel htmlFor="currentPassword">
              Current Password
              <RequiredMark>*</RequiredMark>
            </ModalLabel>
            <Input
              id="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              placeholder="Enter current password"
              autoComplete="current-password"
            />
          </ModalFormGroup>

          <ModalFormGroup>
            <ModalLabel htmlFor="newPassword">
              New Password
              <RequiredMark>*</RequiredMark>
            </ModalLabel>
            <Input
              id="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              placeholder="Enter new password"
              autoComplete="new-password"
            />
          </ModalFormGroup>

          <ModalFormGroup>
            <ModalLabel htmlFor="confirmPassword">
              Confirm New Password
              <RequiredMark>*</RequiredMark>
            </ModalLabel>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
          </ModalFormGroup>

          {passwordError && (
            <ErrorMessage style={{ marginBottom: '1rem' }}>
              <XCircle size={14} />
              {passwordError}
            </ErrorMessage>
          )}

          {passwordSuccess && (
            <SuccessMessage style={{ marginBottom: '1rem' }}>
              <CheckCircle2 size={16} />
              {passwordSuccess}
            </SuccessMessage>
          )}

          <FormActions style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e4e4e7' }}>
            <Button type="button" variant="outline" onClick={() => setShowPasswordModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword ? 'Changing...' : 'Change Password'}
            </Button>
          </FormActions>
        </Form>
      </Modal>
    </>
  );
};

export default SecuritySection;
