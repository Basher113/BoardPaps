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
  Divider,
  Button,
  ModalFormGroup,
  ModalLabel
} from '../../ProjectSettings.styles';
import Modal from '../../../../components/ui/modal/Modal';
import { Trash2, UserCog, ArrowRight } from 'lucide-react';
import { 
  useDeleteProjectMutation, 
  useTransferProjectOwnershipMutation 
} from '../../../../reducers/slices/project/project.apiSlice';

const DangerZone = ({ project, currentUserId, refetchProject }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [transferUserId, setTransferUserId] = useState('');

  const [deleteProject, { isLoading: deleteLoading }] = useDeleteProjectMutation();
  const [transferOwnership, { isLoading: transferLoading }] = useTransferProjectOwnershipMutation();

  const handleTransferOwnership = async () => {
    if (!transferUserId) return;

    try {
      await transferOwnership({ 
        projectId: project.id, 
        newOwnerId: transferUserId 
      }).unwrap();
      toast.success('Project ownership transferred successfully');
      setShowTransferModal(false);
      setTransferUserId('');
      refetchProject();
    } catch (err) {
      console.error('Failed to transfer ownership:', err);
      toast.error(err.data?.message || 'Failed to transfer ownership');
    }
  };

  const handleDeleteProject = async () => {
    if (deleteConfirm !== project?.name) {
      toast.error('Project name does not match');
      return;
    }

    try {
      await deleteProject(project.id).unwrap();
      toast.success('Project deleted successfully');
      navigate('/app/projects');
    } catch (err) {
      console.error('Failed to delete project:', err);
      toast.error(err.data?.message || 'Failed to delete project');
    }
  };

  return (
    <>
      {/* Transfer Ownership */}
      <DangerZoneWrapper>
        <DangerHeader>
          <DangerIconWrapper>
            <UserCog size={20} color="#f59e0b" />
          </DangerIconWrapper>
          <div>
            <DangerTitle>Transfer Ownership</DangerTitle>
            <DangerDescription>
              Transfer this project to another member. You will become an admin after the transfer.
            </DangerDescription>
          </div>
        </DangerHeader>
        <DangerContent>
          <Button type="button" onClick={() => setShowTransferModal(true)}>
            <ArrowRight size={16} style={{ marginRight: '0.5rem' }} />
            Transfer Ownership
          </Button>
        </DangerContent>
      </DangerZoneWrapper>

      <Divider />

      {/* Delete Project */}
      <DangerZoneWrapper>
        <DangerHeader>
          <DangerIconWrapper>
            <Trash2 size={20} color="#dc2626" />
          </DangerIconWrapper>
          <div>
            <DangerTitle>Delete Project</DangerTitle>
            <DangerDescription>
              Permanently delete this project and all associated data. This action cannot be undone.
            </DangerDescription>
          </div>
        </DangerHeader>
        <DangerContent>
          <Button
            type="button"
            variant="destructive"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 size={16} style={{ marginRight: '0.5rem' }} />
            Delete Project
          </Button>
        </DangerContent>
      </DangerZoneWrapper>

      {/* Transfer Ownership Modal */}
      <Modal
        isOpen={showTransferModal}
        onClose={() => {
          setShowTransferModal(false);
          setTransferUserId('');
        }}
        title="Transfer Ownership"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleTransferOwnership(); }}>
          <ModalFormGroup>
            <ModalLabel>Select new owner</ModalLabel>
            <select
              value={transferUserId}
              onChange={(e) => setTransferUserId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                background: '#fff'
              }}
            >
              <option value="">Select a member</option>
              {project.members
                ?.filter(m => m.user.id !== currentUserId)
                .map((member) => (
                  <option key={member.id} value={member.user.id}>
                    {member.user.username} ({member.user.email})
                  </option>
                ))}
            </select>
          </ModalFormGroup>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => setShowTransferModal(false)}
              style={{
                padding: '0.625rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                background: '#fff',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!transferUserId || transferLoading}
              style={{
                padding: '0.625rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: '0.375rem',
                border: '1px solid #6366f1',
                background: !transferUserId ? '#a5b4fc' : '#6366f1',
                color: '#fff',
                cursor: !transferUserId ? 'not-allowed' : 'pointer'
              }}
            >
              {transferLoading ? 'Transferring...' : 'Transfer Ownership'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteConfirm('');
        }}
        title="Delete Project"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleDeleteProject(); }}>
          <ModalFormGroup>
            <ModalLabel>
              Type <strong>{project.name}</strong> to confirm
            </ModalLabel>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Enter project name"
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}
            />
          </ModalFormGroup>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              style={{
                padding: '0.625rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: '0.375rem',
                border: '1px solid #d1d5db',
                background: '#fff',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={deleteLoading || deleteConfirm !== project.name}
              style={{
                padding: '0.625rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: '0.375rem',
                border: '1px solid #dc2626',
                background: deleteConfirm === project.name ? '#dc2626' : '#fca5a5',
                color: '#fff',
                cursor: deleteConfirm === project.name ? 'pointer' : 'not-allowed'
              }}
            >
              {deleteLoading ? 'Deleting...' : 'Delete Project'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default DangerZone;
