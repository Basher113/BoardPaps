import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  SettingsContainer,
  SettingsHeader,
  SettingsTitle,
  SettingsSubtitle,
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
  MetaInfo,
  MetaItem,
  MetaLabel,
  MetaValue,
  DangerZone,
  DangerHeader,
  DangerIconWrapper,
  DangerTitle,
  DangerDescription,
  DangerContent,
  Divider,
  FormRow,
  LoadingSkeleton,
  ModalFormGroup,
  ModalLabel,
  CheckboxWrapper,
  CheckboxInput,
  CheckboxText
} from './Settings.styles';
import Modal from '../../components/ui/modal/Modal';
import ConfirmModal from '../../components/ui/confirm-modal/ConfirmModal';
import {
  Trash2,
  LogOut,
  Lock,
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';

import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
  useGetSessionsQuery,
  useRevokeSessionMutation,
  useRevokeAllSessionsMutation,
  useDeleteAccountMutation
} from '../../reducers/slices/settings/settings.apiSlice';

import { apiSlice } from '../../reducers/apiSlice';
import { useDispatch } from 'react-redux';
import { setActiveView } from '../../reducers/slices/navigation/navigation.slice';

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Set active view on mount
  useEffect(() => {
    dispatch(setActiveView('settings'));
  }, [dispatch]);

  // Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [revokeSessionId, setRevokeSessionId] = useState(null);
  const [revokeAll, setRevokeAll] = useState(false);

  // Profile queries
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: updateProfileLoading, error: updateProfileError }] = useUpdateUserProfileMutation();

  // Security queries
  const [changePassword, { isLoading: changePasswordLoading }] = useChangePasswordMutation();
  const { data: sessionsData, isLoading: sessionsLoading, refetch: refetchSessions } = useGetSessionsQuery();
  const [revokeSession, { isLoading: revokeLoading }] = useRevokeSessionMutation();
  const [revokeAllSessions, { isLoading: revokeAllLoading }] = useRevokeAllSessionsMutation();
  const [deleteAccount, { isLoading: deleteLoading }] = useDeleteAccountMutation();

  // Form states
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const profileInitialized = useRef(false);

  const handleRevokeClick = (sessionId, isAll = false) => {
    setRevokeSessionId(sessionId);
    setRevokeAll(isAll);
    setShowRevokeModal(true);
  };

  // Initialize form data when profile loads
  useEffect(() => {
    const setProfileFormFunc = () => {
      if (profile && !profileInitialized.current) {
        setProfileForm({
          username: profile.username || '',
          email: profile.email || '',
        });
        profileInitialized.current = true;
      }
    }
    setProfileFormFunc();
  }, [profile]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm).unwrap();
      refetchProfile();
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }).unwrap();
      setPasswordSuccess('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(null);
      }, 1500);
    } catch (err) {
      if (err?.data?.errors) {
        setPasswordError(err.data.errors.currentPassword?.[0] || 'Failed to change password');
      } else {
        setPasswordError(err.data?.message || 'Failed to change password');
      }
    }
  };

  const handleRevokeConfirm = async () => {
    try {
      if (revokeAll) {
        await revokeAllSessions().unwrap();
        dispatch(apiSlice.util.resetApiState());
        navigate('/');
      } else {
        await revokeSession(revokeSessionId).unwrap();
        refetchSessions();
      }
    } catch (err) {
      console.error('Failed to revoke session:', err);
    }
    setShowRevokeModal(false);
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteConfirmModal(false);
    try {
      await deleteAccount({ password: deletePassword }).unwrap();
      toast.success("Your account has been deleted successfully");
      dispatch(apiSlice.util.resetApiState());
      navigate('/');
    } catch (err) {
      console.error('Failed to delete account:', err);
      toast.error(err.data?.message || 'Failed to delete account. Please check your password.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const openPasswordModal = () => {
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError(null);
    setPasswordSuccess(null);
    setShowPasswordModal(true);
  };

  if (profileLoading) {
    return (
      <SettingsContainer>
        <SettingsHeader>
          <SettingsTitle>Settings</SettingsTitle>
          <SettingsSubtitle>Loading your settings...</SettingsSubtitle>
        </SettingsHeader>
        <Section>
          <SectionContent>
            <LoadingSkeleton $height="3rem" />
            <div style={{ marginTop: '1.5rem' }} />
            <LoadingSkeleton $height="3rem" />
          </SectionContent>
        </Section>
      </SettingsContainer>
    );
  }

  return (
    <SettingsContainer>
      <SettingsHeader>
        <SettingsTitle>Settings</SettingsTitle>
        <SettingsSubtitle>Manage your account settings and security preferences</SettingsSubtitle>
      </SettingsHeader>

      {/* Profile Section */}
      <Section>
        <SectionHeader>
          <SectionTitle>Profile Information</SectionTitle>
          <SectionDescription>Update your personal information and account details</SectionDescription>
        </SectionHeader>
        <SectionContent>
          <Form onSubmit={handleProfileSubmit}>
            <FormRow>
              <FormGroup>
                <Label htmlFor="username">
                  Username
                  <RequiredMark>*</RequiredMark>
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={profileForm.username}
                  onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">
                  Email Address
                  <RequiredMark>*</RequiredMark>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </FormGroup>
            </FormRow>

            {updateProfileError && (
              <ErrorMessage>
                <XCircle size={14} />
                {updateProfileError.data?.errors?.username?.[0] ||
                  updateProfileError.data?.errors?.email?.[0] ||
                  'Failed to update profile'}
              </ErrorMessage>
            )}

            <FormActions>
              <Button type="submit" disabled={updateProfileLoading}>
                {updateProfileLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </FormActions>

            <Divider />

            <MetaInfo>
              <MetaItem>
                <MetaLabel>Account Created</MetaLabel>
                <MetaValue>{formatDate(profile?.createdAt)}</MetaValue>
              </MetaItem>
              <MetaItem>
                <MetaLabel>Sign-in Method</MetaLabel>
                <MetaValue>{profile?.provider === 'google' ? 'Google Account' : 'Email & Password'}</MetaValue>
              </MetaItem>
            </MetaInfo>
          </Form>
        </SectionContent>
      </Section>

      {/* Security Section */}
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
                <Button type="button" onClick={openPasswordModal} disabled={profile?.provider === 'google'}>
                  <Lock size={16} style={{ marginRight: '0.5rem' }} />
                  Change Password
                </Button>
              </div>
              {profile?.provider === 'google' && (
                <HelperText>Password cannot be changed for Google accounts</HelperText>
              )}
            </FormGroup>

            <Divider />

            <FormGroup style={{ marginBottom: '1rem' }}>
              <Label>Active Sessions</Label>
              {sessionsLoading ? (
                <div>
                  <LoadingSkeleton $height="4rem" />
                  <div style={{ marginTop: '0.75rem' }} />
                  <LoadingSkeleton $height="4rem" />
                </div>
              ) : sessionsData?.sessions?.length === 0 ? (
                <p style={{ color: '#71717a', fontSize: '0.875rem' }}>No active sessions</p>
              ) : (
                <div style={{ marginTop: '0.75rem' }}>
                  {sessionsData?.sessions?.map((session) => (
                    <div
                      key={session.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        background: '#fafafa',
                        borderRadius: '8px',
                        marginBottom: '0.5rem',
                        border: '1px solid #f4f4f5'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: '#ffffff',
                          border: '1px solid #e4e4e7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#71717a'
                        }}>
                          <Shield size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#18181b' }}>
                            {session.userAgent || 'Unknown device'}
                            {session.isCurrent && (
                              <span style={{
                                fontSize: '0.625rem',
                                fontWeight: 600,
                                color: '#16a34a',
                                background: '#dcfce7',
                                padding: '0.125rem 0.5rem',
                                borderRadius: '9999px',
                                marginLeft: '0.5rem',
                                textTransform: 'uppercase'
                              }}>
                                Current
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#71717a' }}>
                            {new Date(session.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      {!session.isCurrent && (
                        <Button
                          variant="outline"
                          onClick={() => handleRevokeClick(session.id, false)}
                          disabled={revokeLoading}
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem' }}
                        >
                          Revoke
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </FormGroup>

            {sessionsData?.sessions?.length > 1 && (
              <Button
                variant="ghost"
                onClick={() => handleRevokeClick(null, true)}
                disabled={revokeAllLoading}
                style={{ fontSize: '0.8125rem' }}
              >
                <LogOut size={14} style={{ marginRight: '0.375rem' }} />
                Sign out all other sessions
              </Button>
            )}
          </Form>
        </SectionContent>
      </Section>

      {/* Danger Zone */}
      <DangerZone>
        <DangerHeader>
          <DangerIconWrapper>
            <AlertTriangle size={20} color="#dc2626" />
          </DangerIconWrapper>
          <div>
            <DangerTitle>Delete Account</DangerTitle>
            <DangerDescription>
              Permanently delete your account and all associated data
            </DangerDescription>
          </div>
        </DangerHeader>
        <DangerContent>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              setDeleteConfirm(false);
              setDeletePassword('');
              setShowDeleteModal(true);
            }}
          >
            <Trash2 size={16} style={{ marginRight: '0.5rem' }} />
            Delete Account
          </Button>
        </DangerContent>
      </DangerZone>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
      >
        <Form onSubmit={handlePasswordSubmit}>
          {profile?.provider !== 'google' && (
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
          )}

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
            <Button type="submit" disabled={changePasswordLoading}>
              {changePasswordLoading ? 'Changing...' : 'Change Password'}
            </Button>
          </FormActions>
        </Form>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
      >
        <Form onSubmit={(e) => { e.preventDefault(); setShowDeleteModal(false); setShowDeleteConfirmModal(true); }}>
          <CheckboxWrapper>
            <CheckboxInput
              type="checkbox"
              checked={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.checked)}
              id="deleteConfirm"
            />
            <label htmlFor="deleteConfirm" style={{ cursor: 'pointer' }}>
              <CheckboxText>
                I understand that this will permanently delete my account, all my projects, and all associated data. This action cannot be undone.
              </CheckboxText>
            </label>
          </CheckboxWrapper>

          <ModalFormGroup>
            <ModalLabel htmlFor="deletePassword">
              Enter your password to confirm
              <RequiredMark>*</RequiredMark>
            </ModalLabel>
            <Input
              id="deletePassword"
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={!deleteConfirm}
            />
          </ModalFormGroup>

          <FormActions style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e4e4e7' }}>
            <Button type="button" variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={!deleteConfirm || !deletePassword || deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete My Account'}
            </Button>
          </FormActions>
        </Form>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Account"
        message="Are you absolutely sure? This action cannot be undone and will permanently delete all your data."
        confirmText="Delete Account"
        variant="danger"
        isLoading={deleteLoading}
      />

      {/* Revoke Session Confirmation Modal */}
      <ConfirmModal
        isOpen={showRevokeModal}
        onClose={() => setShowRevokeModal(false)}
        onConfirm={handleRevokeConfirm}
        title={revokeAll ? "Revoke All Sessions" : "Revoke Session"}
        message={revokeAll 
          ? "Are you sure you want to revoke all other sessions? You will be logged out from all devices except this one."
          : "Are you sure you want to revoke this session?"
        }
        confirmText={revokeAll ? "Revoke All" : "Revoke"}
        variant="danger"
        isLoading={revokeLoading || revokeAllLoading}
      />
    </SettingsContainer>
  );
};

export default Settings;
