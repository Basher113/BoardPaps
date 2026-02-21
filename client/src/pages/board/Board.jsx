import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BoardContainer } from "./Board.styles";
import Header from "./components/header/Header";
import Column from "./components/column/Column";
import IssueDetailModal from "./components/issue-detail/IssueDetailModal";
import ConfirmModal from "../../components/ui/confirm-modal/ConfirmModal";
import InviteModal from "./components/invite-modal/InviteModal";
import Modal from "../../components/ui/modal/Modal";
import IssueForm from "./components/form/IssueForm";
import BoardSkeleton from "./components/skeleton/BoardSkeleton";
import useIssueMutations from "./hooks/useIssueMutations";
import useIssueModals from "./hooks/useIssueModals";
import { selectActiveProjectId } from "../../reducers/slices/navigation/navigation.selector";
import { 
  useGetProjectQuery, 
} from "../../reducers/slices/project/project.apiSlice";
import { useMoveIssueMutation } from "../../reducers/slices/issue/issue.apiSlice";
import { 
  selectIsDeleteModalOpen,
  selectIsCreateModalOpen,
  selectCreateColumnId,
  selectIsEditModalOpen,
  selectSelectedIssueId
} from "../../reducers/slices/issue/issue.slice";
import { useGetCurrentUserQuery } from "../../reducers/slices/user/user.slice";
import { setActiveView } from "../../reducers/slices/navigation/navigation.slice";

/**
 * Board Component
 * Main Kanban board view - now minimal, delegating to hooks and child components
 */
const Board = () => {
  const dispatch = useDispatch();
  
  // ==================== REDUX STATE ====================
  
  const activeProjectId = useSelector(selectActiveProjectId);
  const isDeleteModalOpen = useSelector(selectIsDeleteModalOpen);
  const isCreateModalOpen = useSelector(selectIsCreateModalOpen);
  const createColumnId = useSelector(selectCreateColumnId);
  const isEditModalOpen = useSelector(selectIsEditModalOpen);
  const selectedIssueId = useSelector(selectSelectedIssueId);

  // ==================== EFFECTS ====================
  
  useEffect(() => {
    dispatch(setActiveView('board'));
  }, [dispatch]);

  // ==================== API QUERIES ====================
  
  const { 
    data: projectData, 
    isLoading, 
    isError, 
    error 
  } = useGetProjectQuery(activeProjectId, {
    skip: !activeProjectId,
  });
  
  const project = projectData?.data;
  const { data: currentUserData } = useGetCurrentUserQuery();

  // ==================== MUTATIONS ====================
  
  const [moveIssue] = useMoveIssueMutation();

  // ==================== DERIVED STATE ====================
  
  const columns = useMemo(() => project?.columns || [], [project]);
  const projectKey = project?.key || "PROJ";
  
  const currentUser = currentUserData;
  const currentUserMembership = project?.members?.find(
    (m) => m.user?.id === currentUser?.id
  );
  const currentUserRole = currentUserMembership?.role || null;
  const canInvite = currentUserRole === "OWNER" || currentUserRole === "ADMIN";

  // Find the selected issue from project data
  const selectedIssue = useMemo(() => {
    if (!selectedIssueId || !columns) return null;
    for (const column of columns) {
      const issue = column.issues?.find(i => i.id === selectedIssueId);
      if (issue) return issue;
    }
    return null;
  }, [selectedIssueId, columns]);

  // ==================== CUSTOM HOOKS ====================
  
  const mutations = useIssueMutations({ selectedIssue });
  const modals = useIssueModals();

  // ==================== ISSUE MOVE HANDLER ====================

  const handleIssueMove = async ({ issue, targetColumnId, newPosition }) => {
    if (!activeProjectId) return;

    try {
      await moveIssue({
        projectId: activeProjectId,
        issueId: issue.id,
        columnId: targetColumnId,
        newPosition,
      }).unwrap();
    } catch (err) {
      console.error("Failed to move issue:", err);
    }
  };

  // ==================== RENDER STATES ====================

  if (isLoading) {
    return <BoardSkeleton columnCount={4} cardsPerColumn={3} />;
  }

  if (isError) {
    return (
      <>
        <Header boardName="Error" projectName="" />
        <BoardContainer>
          <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
            Error loading project: {error?.message || "Unknown error"}
          </div>
        </BoardContainer>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Header boardName="No Project Selected" projectName="" />
        <BoardContainer>
          <div style={{ padding: "20px", textAlign: "center" }}>
            Please select a project from the sidebar.
          </div>
        </BoardContainer>
      </>
    );
  }

  // ==================== MAIN RENDER ====================

  return (
    <>
      <Header
        boardName={project.name || "Project Board"}
        projectName={project.name || ""}
        projectId={activeProjectId}
        onInvite={modals.openInviteModal}
        canInvite={canInvite}
        projectMembers={project?.members}
      />
      
      <BoardContainer>
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            projectKey={projectKey}
            onIssueMove={handleIssueMove}
            onAddClick={modals.openCreateModalWithColumn}
            onCardClick={modals.openDetailModal}
          />
        ))}
      </BoardContainer>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={mutations.handleCloseDeleteModal}
        onConfirm={mutations.handleDeleteIssue}
        title="Delete Issue"
        message="Are you sure you want to delete this issue? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Invite Modal */}
      <InviteModal
        isOpen={modals.isInviteModalOpen}
        onClose={modals.closeInviteModal}
        projectId={activeProjectId}
      />

      {/* Create Issue Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={mutations.handleCloseCreateModal}
        title="Create Issue"
      >
        <IssueForm
          columnId={createColumnId}
          currentUserId={currentUser?.id}
          projectMembers={project?.members || []}
          onSubmit={mutations.handleCreateIssue}
          onCancel={mutations.handleCloseCreateModal}
        />
      </Modal>

      {/* Edit Issue Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={mutations.handleCloseEditModal}
        title="Edit Issue"
      >
        {selectedIssue && (
          <IssueForm
            issue={selectedIssue}
            currentUserId={currentUser?.id}
            projectMembers={project?.members || []}
            onSubmit={mutations.handleUpdateIssue}
            onCancel={mutations.handleCloseEditModal}
          />
        )}
      </Modal>

      {/* Issue Detail Modal */}
      <IssueDetailModal
        isOpen={modals.isDetailModalOpen}
        onClose={modals.closeDetailModal}
        issue={modals.detailIssue}
      />
    </>
  );
};

export default Board;
