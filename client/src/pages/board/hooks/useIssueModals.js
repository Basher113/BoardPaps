import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { openCreateModal } from '../../../reducers/slices/issue/issue.slice';

/**
 * Custom hook for managing modal state in the Board component
 * Handles invite modal, detail modal, and create modal triggers
 * 
 * @returns {Object} Modal state and handlers
 */
const useIssueModals = () => {
  const dispatch = useDispatch();

  // ==================== INVITE MODAL ====================
  
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const openInviteModal = useCallback(() => {
    setIsInviteModalOpen(true);
  }, []);

  const closeInviteModal = useCallback(() => {
    setIsInviteModalOpen(false);
  }, []);

  // ==================== DETAIL MODAL ====================
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailIssue, setDetailIssue] = useState(null);

  const openDetailModal = useCallback((issue) => {
    setDetailIssue(issue);
    setIsDetailModalOpen(true);
  }, []);

  const closeDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setDetailIssue(null);
  }, []);

  // ==================== CREATE MODAL ====================
  
  const openCreateModalWithColumn = useCallback((columnId) => {
    dispatch(openCreateModal(columnId));
  }, [dispatch]);

  return {
    // Invite modal
    isInviteModalOpen,
    openInviteModal,
    closeInviteModal,

    // Detail modal
    isDetailModalOpen,
    detailIssue,
    openDetailModal,
    closeDetailModal,

    // Create modal
    openCreateModalWithColumn,
  };
};

export default useIssueModals;
