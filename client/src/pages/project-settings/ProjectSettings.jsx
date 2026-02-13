import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  SettingsContainer,
  SettingsHeader,
  SettingsTitle,
  SettingsSubtitle,
  TabsContainer,
  Tab,
  TabContent,
  LoadingSkeleton
} from './ProjectSettings.styles';
import Modal from '../../components/ui/modal/Modal';
import ConfirmModal from '../../components/ui/confirm-modal/ConfirmModal';
import {
  useGetProjectSettingsQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useTransferProjectOwnershipMutation,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation
} from '../../reducers/slices/project/project.apiSlice';
import { useGetCurrentUserQuery } from '../../reducers/slices/user/user.slice';
import { setActiveView } from '../../reducers/slices/navigation/navigation.slice';

// Sub-components
import GeneralSettings, { GeneralSettingsEditModal } from './components/general/GeneralSettings';
import MembersList from './components/members/MembersList';
import InvitationsList from './components/invitations/InvitationsList';
import DangerZone from './components/danger-zone/DangerZone';

const ProjectSettings = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Set active view on mount
  useEffect(() => {
    dispatch(setActiveView('project-settings'));
  }, [dispatch]);

  // Tab state
  const [activeTab, setActiveTab] = useState('general');

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [transferUserId, setTransferUserId] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');

  // Get current user
  const { data: currentUserData } = useGetCurrentUserQuery();
  const currentUser = currentUserData;
  const currentUserId = currentUser?.id;

  // Queries
  const { data: project, isLoading: projectLoading, refetch: refetchProject } = useGetProjectSettingsQuery(projectId);
  const [updateProject, { isLoading: updateLoading }] = useUpdateProjectMutation();
  const [deleteProject, { isLoading: deleteLoading }] = useDeleteProjectMutation();
  const [transferOwnership, { isLoading: transferLoading }] = useTransferProjectOwnershipMutation();
  const [updateMemberRole, { isLoading: roleLoading }] = useUpdateMemberRoleMutation();
  const [removeMember, { isLoading: removeLoading }] = useRemoveMemberMutation();

  // Determine if user is owner
  const isOwner = project?.owner?.id === currentUserId || 
    project?.members?.some(m => m.user.id === currentUserId && m.role === 'OWNER');
  
  // Determine if user can manage settings
  const canManageSettings = project?.members?.some(m => 
    m.user.id === currentUserId && (m.role === 'OWNER' || m.role === 'ADMIN')
  );

  const handleEditSave = async (formData) => {
    try {
      await updateProject({
        projectId,
        ...formData
      }).unwrap();
      toast.success('Project updated successfully');
      setShowEditModal(false);
      refetchProject();
    } catch (err) {
      console.error('Failed to update project:', err);
      throw err; // Re-throw to be caught by modal
    }
  };
  const handleRoleChange = async (memberId, newRole) => {

    try {
      await updateMemberRole({ projectId, memberId, role: newRole }).unwrap();
      toast.success('Member role updated successfully');
      refetchProject();
    } catch (err) {
      console.error('Failed to update role:', err);
      toast.error(err.data?.message || 'Failed to update member role');
    }
  };

  const handleRemoveMember = async () => {
    if (!selectedMember) return;

    try {
      await removeMember({ projectId, memberId: selectedMember.id }).unwrap();
      toast.success('Member removed successfully');
      setShowRemoveModal(false);
      setSelectedMember(null);
      refetchProject();
    } catch (err) {
      console.error('Failed to remove member:', err);
      toast.error(err.data?.message || 'Failed to remove member');
    }
  };

  const handleTransferOwnership = async () => {
    if (!transferUserId) return;

    try {
      await transferOwnership({ projectId, newOwnerId: transferUserId }).unwrap();
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
      await deleteProject(projectId).unwrap();
      toast.success('Project deleted successfully');
      navigate('/app/projects');
    } catch (err) {
      console.error('Failed to delete project:', err);
      toast.error(err.data?.message || 'Failed to delete project');
    }
  };

  const openRemoveModal = (member) => {
    setSelectedMember(member);
    setShowRemoveModal(true);
  };

  const handleResendInvitation = () => {
    toast.info('Resend invitation feature coming soon');
  };

  const handleCancelInvitation = () => {
    toast.info('Cancel invitation feature coming soon');
  };

  if (projectLoading) {
    return (
      <SettingsContainer>
        <SettingsHeader>
          <SettingsTitle>Project Settings</SettingsTitle>
          <SettingsSubtitle>Loading...</SettingsSubtitle>
        </SettingsHeader>
        <LoadingSkeleton $height="3rem" />
        <div style={{ marginTop: '1.5rem' }} />
        <LoadingSkeleton $height="3rem" />
      </SettingsContainer>
    );
  }

  if (!project) {
    return (
      <SettingsContainer>
        <SettingsHeader>
          <SettingsTitle>Project Settings</SettingsTitle>
          <SettingsSubtitle>Project not found</SettingsSubtitle>
        </SettingsHeader>
      </SettingsContainer>
    );
  }

  return (
    <SettingsContainer>
      <SettingsHeader>
        <SettingsTitle>{project.name} Settings</SettingsTitle>
        <SettingsSubtitle>Manage your project settings and members</SettingsSubtitle>
      </SettingsHeader>

      <TabsContainer>
        <Tab $active={activeTab === 'general'} onClick={() => setActiveTab('general')}>
          General
        </Tab>
        <Tab $active={activeTab === 'members'} onClick={() => setActiveTab('members')}>
          Members ({project.members?.length || 0})
        </Tab>
        <Tab $active={activeTab === 'invitations'} onClick={() => setActiveTab('invitations')}>
          Invitations ({project.invitations?.length || 0})
        </Tab>
        {isOwner && (
          <Tab $active={activeTab === 'danger'} onClick={() => setActiveTab('danger')}>
            Danger Zone
          </Tab>
        )}
      </TabsContainer>

      <TabContent>
        {activeTab === 'general' && (
          <GeneralSettings
            project={project}
            canManageSettings={canManageSettings}
            onEdit={() => setShowEditModal(true)}
          />
        )}

        {activeTab === 'members' && (
          <MembersList
            project={project}
            currentUserId={currentUserId}
            canManageSettings={canManageSettings}
            roleLoading={roleLoading}
            removeLoading={removeLoading}
            onRoleChange={handleRoleChange}
            onRemoveMember={openRemoveModal}
          />
        )}

        {activeTab === 'invitations' && (
          <InvitationsList
            project={project}
            onResend={handleResendInvitation}
            onCancel={handleCancelInvitation}
          />
        )}

        {activeTab === 'danger' && isOwner && (
          <DangerZone
            onTransfer={() => setShowTransferModal(true)}
            onDelete={() => setShowDeleteModal(true)}
          />
        )}
      </TabContent>

      {/* Edit Project Modal */}
      <GeneralSettingsEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        project={project}
        onSave={handleEditSave}
        isLoading={updateLoading}
      />

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
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Type <strong>{project.name}</strong> to confirm
            </label>
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
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
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
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Select new owner
            </label>
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
                .filter(m => m.user.id !== currentUserId)
                .map((member) => (
                  <option key={member.id} value={member.user.id}>
                    {member.user.username} ({member.user.email})
                  </option>
                ))}
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
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

      {/* Remove Member Confirmation Modal */}
      <ConfirmModal
        isOpen={showRemoveModal}
        onClose={() => {
          setShowRemoveModal(false);
          setSelectedMember(null);
        }}
        onConfirm={handleRemoveMember}
        title="Remove Member"
        message={`Are you sure you want to remove ${selectedMember?.user?.username} from this project?`}
        confirmText="Remove"
        cancelText="Cancel"
        variant="danger"
        isLoading={removeLoading}
      />
    </SettingsContainer>
  );
};

export default ProjectSettings;
