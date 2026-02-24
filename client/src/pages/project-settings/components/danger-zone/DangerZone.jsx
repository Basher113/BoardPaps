import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
  DangerItem,
  DangerItemInfo,
  DangerItemTitle,
  DangerItemDescription,
  Button
} from '../../ProjectSettings.styles';
import Modal from '../../../../components/ui/modal/Modal';
import { 
  useDeleteProjectMutation, 
  useTransferProjectOwnershipMutation 
} from '../../../../reducers/slices/project/project.apiSlice';
import { useLeaveProjectMutation } from '../../../../reducers/slices/member/member.apiSlice';
import { logger } from '../../../../utils/logger';

const DangerZone = ({ project, currentUserId, refetchProject, isOwner }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [transferUserId, setTransferUserId] = useState('');

  const [deleteProject, { isLoading: deleteLoading }] = useDeleteProjectMutation();
  const [transferOwnership, { isLoading: transferLoading }] = useTransferProjectOwnershipMutation();
  const [leaveProject, { isLoading: leaveLoading }] = useLeaveProjectMutation();

  const handleTransferOwnership = async (e) => {
    e.preventDefault();
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
      logger.apiError('Transfer ownership', err);
      toast.error(err.data?.message || 'Failed to transfer ownership');
    }
  };

  const handleDeleteProject = async (e) => {
    e.preventDefault();

    if (deleteConfirm !== project?.name) {
      toast.error('Project name does not match');
      return;
    }

    try {
      await deleteProject(project.id).unwrap();
      toast.success('Project deleted successfully');
      navigate('/projects');
    } catch (err) {
      logger.apiError('Delete project', err);
      toast.error(err.data?.message || 'Failed to delete project');
    }
  };

  const handleLeaveProject = async (e) => {
    e.preventDefault();

    try {
      await leaveProject(project.id).unwrap();
      toast.success('You have left the project');
      navigate('/projects');
    } catch (err) {
      logger.apiError('Leave project', err);
      toast.error(err.data?.message || 'Failed to leave project');
    }
  };

  // Owner view: Transfer ownership and Delete project
  if (isOwner) {
    return (
      <>
        <Section $danger>
          <SectionHeader>
            <SectionTitle $danger>Danger Zone</SectionTitle>
            <SectionDescription>Irreversible actions for this project.</SectionDescription>
          </SectionHeader>
          <SectionContent>
            <DangerItem $first>
              <DangerItemInfo>
                <DangerItemTitle>Transfer Ownership</DangerItemTitle>
                <DangerItemDescription>Transfer this project to another member. You will become an admin after the transfer.</DangerItemDescription>
              </DangerItemInfo>
              <Button $variant="secondary" onClick={() => setShowTransferModal(true)}>
                Transfer
              </Button>
            </DangerItem>
            
            <DangerItem>
              <DangerItemInfo>
                <DangerItemTitle>Delete Project</DangerItemTitle>
                <DangerItemDescription>Permanently delete all project data and settings.</DangerItemDescription>
              </DangerItemInfo>
              <Button $variant="danger" onClick={() => setShowDeleteModal(true)}>
                Delete Project
              </Button>
            </DangerItem>
          </SectionContent>
        </Section>

        {/* Transfer Ownership Modal */}
        <Modal
          isOpen={showTransferModal}
          onClose={() => {
            setShowTransferModal(false);
            setTransferUserId('');
          }}
          title="Transfer Ownership"
        >
          <form onSubmit={handleTransferOwnership}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Select new owner
              </label>
              <select
                value={transferUserId}
                onChange={(e) => setTransferUserId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.875rem',
                  border: '1px solid #e8e8e8',
                  borderRadius: '0.625rem',
                  fontSize: '0.875rem',
                  background: '#fafafa'
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
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button type="button" $variant="secondary" onClick={() => setShowTransferModal(false)}>
                Cancel
              </Button>
              <Button type="submit" $variant="primary" disabled={!transferUserId || transferLoading}>
                {transferLoading ? 'Transferring...' : 'Transfer Ownership'}
              </Button>
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
          <form onSubmit={handleDeleteProject}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Type <strong>{project.name}</strong> to confirm
              </label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="Enter project name"
                style={{
                  width: '100%',
                  padding: '0.75rem 0.875rem',
                  border: '1px solid #e8e8e8',
                  borderRadius: '0.625rem',
                  fontSize: '0.875rem',
                  background: '#fafafa'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button type="button" $variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button type="submit" $variant="danger" disabled={deleteLoading || deleteConfirm !== project.name}>
                {deleteLoading ? 'Deleting...' : 'Delete Project'}
              </Button>
            </div>
          </form>
        </Modal>
      </>
    );
  }

  // Non-owner view: Leave project option
  return (
    <>
      <Section $danger>
        <SectionHeader>
          <SectionTitle $danger>Danger Zone</SectionTitle>
          <SectionDescription>Irreversible actions for this project.</SectionDescription>
        </SectionHeader>
        <SectionContent>
          <DangerItem $first>
            <DangerItemInfo>
              <DangerItemTitle>Leave Project</DangerItemTitle>
              <DangerItemDescription>Remove yourself from this project. You will lose access to all project data.</DangerItemDescription>
            </DangerItemInfo>
            <Button $variant="danger" onClick={() => setShowLeaveModal(true)}>
              Leave Project
            </Button>
          </DangerItem>
        </SectionContent>
      </Section>

      {/* Leave Project Confirmation Modal */}
      <Modal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        title="Leave Project"
      >
        <form onSubmit={handleLeaveProject}>
          <p style={{ fontSize: '0.875rem', color: '#4a4a4a', marginBottom: '1rem' }}>
            Are you sure you want to leave <strong>{project.name}</strong>? You will lose access to all project data and will need to be invited again to rejoin.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button type="button" $variant="secondary" onClick={() => setShowLeaveModal(false)}>
              Cancel
            </Button>
            <Button type="submit" $variant="danger" disabled={leaveLoading}>
              {leaveLoading ? 'Leaving...' : 'Leave Project'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default DangerZone;
