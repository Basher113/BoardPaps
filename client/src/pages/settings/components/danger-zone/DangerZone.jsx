import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  DangerZone as DangerZoneWrapper,
  DangerHeader,
  DangerIconWrapper,
  DangerTitle,
  DangerDescription,
  DangerContent,
  Button,
  Form,
  FormActions,
  RequiredMark,
  Input,
  ModalFormGroup,
  ModalLabel,
  CheckboxWrapper,
  CheckboxInput,
  CheckboxText,
  HelperText
} from '../../Settings.styles';
import Modal from '../../../../components/ui/modal/Modal';
import ConfirmModal from '../../../../components/ui/confirm-modal/ConfirmModal';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useDeleteAccountMutation } from '../../../../reducers/slices/settings/settings.apiSlice';
import { apiSlice } from '../../../../reducers/apiSlice';

const DangerZoneSection = ({ hasPassword }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const [deleteAccount, { isLoading: deleteLoading }] = useDeleteAccountMutation();

  const handleDeleteConfirm = async () => {
    setShowDeleteConfirmModal(false);
    try {
      // For users without password (OAuth-only), don't send password
      const payload = hasPassword 
        ? { password: deletePassword } 
        : {};
      
      await deleteAccount(payload).unwrap();
      toast.success("Your account has been deleted successfully");
      apiSlice.util.resetApiState();
      navigate('/');
    } catch (err) {
      console.error('Failed to delete account:', err);
      toast.error(err.data?.message || 'Failed to delete account. Please check your password.');
    }
  };

  const openDeleteModal = () => {
    setDeleteConfirm(false);
    setDeletePassword('');
    setShowDeleteModal(true);
  };

  // Determine if the delete button should be enabled
  // If user has password, require both checkbox and password
  // If user doesn't have password (OAuth-only), just require checkbox
  const canSubmitDelete = hasPassword 
    ? deleteConfirm && deletePassword 
    : deleteConfirm;

  return (
    <>
      <DangerZoneWrapper>
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
            onClick={openDeleteModal}
          >
            <Trash2 size={16} style={{ marginRight: '0.5rem' }} />
            Delete Account
          </Button>
        </DangerContent>
      </DangerZoneWrapper>

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

          {/* Only show password field for users with password */}
          {hasPassword && (
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
          )}

          {/* Show helper text for OAuth-only users */}
          {!hasPassword && deleteConfirm && (
            <HelperText style={{ marginTop: '0.5rem' }}>
              Your account will be deleted without password confirmation since you signed in with an OAuth provider.
            </HelperText>
          )}

          <FormActions style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e4e4e7' }}>
            <Button type="button" variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={!canSubmitDelete || deleteLoading}
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
    </>
  );
};

export default DangerZoneSection;
