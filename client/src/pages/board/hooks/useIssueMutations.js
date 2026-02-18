import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  useDeleteIssueMutation,
  useCreateIssueMutation,
  useUpdateIssueMutation,
} from '../../../reducers/slices/project/project.apiSlice';
import {
  closeDeleteModal,
  closeEditModal,
  closeCreateModal,
  selectDeleteIssueId,
} from '../../../reducers/slices/issue/issue.slice';
import { selectActiveProjectId } from '../../../reducers/slices/navigation/navigation.selector';

/**
 * Custom hook for handling issue CRUD mutations
 * Encapsulates all issue create, update, delete logic
 * 
 * @param {Object} options
 * @param {Object} options.selectedIssue - The currently selected issue for editing
 * @returns {Object} Mutation handlers and state
 */
const useIssueMutations = ({ selectedIssue } = {}) => {
  const dispatch = useDispatch();
  const activeProjectId = useSelector(selectActiveProjectId);
  const deleteIssueId = useSelector(selectDeleteIssueId);

  // Mutations
  const [deleteIssue] = useDeleteIssueMutation();
  const [createIssue] = useCreateIssueMutation();
  const [updateIssue] = useUpdateIssueMutation();

  /**
   * Delete the currently selected issue
   */
  const handleDeleteIssue = useCallback(async () => {
    if (!deleteIssueId || !activeProjectId) return;

    try {
      await deleteIssue({
        projectId: activeProjectId,
        issueId: deleteIssueId,
      }).unwrap();
      toast.success('Issue deleted successfully');
      dispatch(closeDeleteModal());
    } catch (err) {
      console.error('Failed to delete issue:', err);
      toast.error('Failed to delete issue');
    }
  }, [deleteIssueId, activeProjectId, deleteIssue, dispatch]);

  /**
   * Create a new issue
   * @param {Object} formData - Issue form data
   */
  const handleCreateIssue = useCallback(async (formData) => {
    if (!activeProjectId) return;

    try {
      await createIssue({
        projectId: activeProjectId,
        ...formData,
      }).unwrap();
      toast.success('Issue created successfully');
      dispatch(closeCreateModal());
    } catch (err) {
      console.error('Failed to create issue:', err);
      toast.error('Failed to create issue');
    }
  }, [activeProjectId, createIssue, dispatch]);

  /**
   * Update an existing issue
   * @param {Object} formData - Issue form data
   */
  const handleUpdateIssue = useCallback(async (formData) => {
    if (!selectedIssue || !activeProjectId) return;

    try {
      await updateIssue({
        projectId: activeProjectId,
        issueId: selectedIssue.id,
        ...formData,
      }).unwrap();
      toast.success('Issue updated successfully');
      dispatch(closeEditModal());
    } catch (err) {
      console.error('Failed to update issue:', err);
      toast.error('Failed to update issue');
    }
  }, [selectedIssue, activeProjectId, updateIssue, dispatch]);

  /**
   * Close the delete modal
   */
  const handleCloseDeleteModal = useCallback(() => {
    dispatch(closeDeleteModal());
  }, [dispatch]);

  /**
   * Close the create modal
   */
  const handleCloseCreateModal = useCallback(() => {
    dispatch(closeCreateModal());
  }, [dispatch]);

  /**
   * Close the edit modal
   */
  const handleCloseEditModal = useCallback(() => {
    dispatch(closeEditModal());
  }, [dispatch]);

  return {
    // Handlers
    handleDeleteIssue,
    handleCreateIssue,
    handleUpdateIssue,
    handleCloseDeleteModal,
    handleCloseCreateModal,
    handleCloseEditModal,
  };
};

export default useIssueMutations;
