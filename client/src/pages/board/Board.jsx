import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import {
  BoardContainer,
  Column,
  ColumnHeader,
  ColumnTitle,
  Count,
  CardList,
  AddButton,
  ColumnHeaderLeft,
} from "./Board.styles";
import Header from "./components/header/Header";
import IssueCard from "./components/issue-card/IssueCard";
import ConfirmModal from "../../components/ui/confirm-modal/ConfirmModal";
import InviteModal from "./components/invite-modal/InviteModal";
import Modal from "../../components/ui/modal/Modal";
import IssueForm from "./components/form/IssueForm";
import { selectActiveProjectId } from "../../reducers/slices/navigation/navigation.selector";
import { 
  useGetProjectQuery, 
  useDeleteIssueMutation,
  useMoveIssueMutation,
  useCreateIssueMutation,
  useUpdateIssueMutation 
} from "../../reducers/slices/project/project.apiSlice";
import { 
  closeDeleteModal, 
  closeEditModal,
  selectIsDeleteModalOpen, 
  selectDeleteIssueId,
  openCreateModal,
  closeCreateModal,
  selectIsCreateModalOpen,
  selectCreateColumnId,
  selectIsEditModalOpen,
  selectSelectedIssueId
} from "../../reducers/slices/issue/issue.slice";
import { useGetCurrentUserQuery } from "../../reducers/slices/user/user.slice";

const Board = () => {
  const dispatch = useDispatch();
  const activeProjectId = useSelector(selectActiveProjectId);
  const isDeleteModalOpen = useSelector(selectIsDeleteModalOpen);
  const deleteIssueId = useSelector(selectDeleteIssueId);
  
  const { data: projectData, isLoading, isError, error } = useGetProjectQuery(activeProjectId, {
    skip: !activeProjectId,
  });
  const project = projectData?.data;

  const [deleteIssue] = useDeleteIssueMutation();
  const [moveIssue] = useMoveIssueMutation();
  const [createIssue] = useCreateIssueMutation();
  const [updateIssue] = useUpdateIssueMutation();

  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Create issue modal state from Redux
  const isCreateModalOpen = useSelector(selectIsCreateModalOpen);
  const createColumnId = useSelector(selectCreateColumnId);

  // Edit issue modal state from Redux
  const isEditModalOpen = useSelector(selectIsEditModalOpen);
  const selectedIssueId = useSelector(selectSelectedIssueId);

  // Find the selected issue from project data
  const selectedIssue = React.useMemo(() => {
    if (!selectedIssueId || !project?.columns) return null;
    for (const column of project.columns) {
      const issue = column.issues?.find(i => i.id === selectedIssueId);
      if (issue) return issue;
    }
    return null;
  }, [selectedIssueId, project]);

  const columns = project?.columns || [];
  const projectKey = project?.key || "PROJ";

  // Find current user's role in the project
  const { data: currentUserData } = useGetCurrentUserQuery();
  const currentUser = currentUserData; // /auth/me returns user directly, not wrapped in data
  const currentUserMembership = project?.members?.find(
    (m) => m.user?.id === currentUser?.id
  );
  const currentUserRole = currentUserMembership?.role || null;
  const canInvite = currentUserRole === "OWNER" || currentUserRole === "ADMIN";

  // Debug logging for invite button visibility
  console.log("=== Invite Button Debug ===");
  console.log("Current User:", currentUser);
  console.log("Current User ID:", currentUser?.id);
  console.log("Project Members:", project?.members);
  console.log("Current User Membership:", currentUserMembership);
  console.log("Current User Role:", currentUserRole);
  console.log("Can Invite:", canInvite);
  console.log("=========================");




  const handleDragStart = (card, columnId) => {
    setDraggedCard(card);
    setDraggedFrom(columnId);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    setDraggedOver(columnId);
  };

  const handleDrop = async (e, columnId) => {
    e.preventDefault();
    if (!draggedCard || !draggedFrom || !activeProjectId) return;

    // Calculate new position - append to end of target column
    const targetColumn = columns.find(c => c.id === columnId);
    const newPosition = targetColumn?.issues?.length || 0;

    // Optimistic update handled by RTK Query
    try {
      await moveIssue({
        projectId: activeProjectId,
        issueId: draggedCard.id,
        columnId,
        newPosition,
      });
    } catch (err) {
      console.error("Failed to move issue:", err);
    }
    

    setDraggedCard(null);
    setDraggedFrom(null);
    setDraggedOver(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteIssueId || !activeProjectId) return;
    
    try {
      await deleteIssue({ projectId: activeProjectId, issueId: deleteIssueId });
      dispatch(closeDeleteModal());
    } catch (err) {
      console.error("Failed to delete issue:", err);
    }
  };

  const handleDeleteCancel = () => {
    dispatch(closeDeleteModal());
  };

  if (isLoading) {
    return (
      <>
        <Header boardName="Loading..." projectName="" />
        <BoardContainer>
          <div style={{ padding: "20px", textAlign: "center" }}>Loading project data...</div>
        </BoardContainer>
      </>
    );
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

  return (
    <>
      <Header
        boardName={project.name || "Project Board"}
        projectName={project.name || ""}
        onInvite={() => setIsInviteModalOpen(true)}
        canInvite={canInvite}
        projectMembers={project?.members}
      />
      <BoardContainer>
        {columns.map((column) => (
          <Column key={column.id}>
            <ColumnHeader>
                <ColumnHeaderLeft>
                  <ColumnTitle>{column.name}</ColumnTitle>
                  <Count>{column.issues?.length || 0}</Count>
                </ColumnHeaderLeft>
                
              <AddButton 
                onClick={() => dispatch(openCreateModal(column.id))}
                aria-label={`Add issue to ${column.name}`}
                title={`Add issue to ${column.name}`}
              >
                <Plus size={16} />
              </AddButton>
            </ColumnHeader>

            <CardList
              isDraggingOver={draggedOver === column.id}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {column.issues?.map((card) => (
                <IssueCard 
                  key={card.id}
                  issue={card}
                  projectKey={projectKey}
                  columnId={column.id}
                  isDragging={draggedCard?.id === card.id}
                  onDragStart={() => handleDragStart(card, column.id)}
                />
              ))}
            </CardList>
          </Column>
        ))}
      </BoardContainer>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Issue"
        message="Are you sure you want to delete this issue? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Invite Modal */}
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        projectId={activeProjectId}
      />

      {/* Create Issue Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => dispatch(closeCreateModal())}
        title="Create Issue"
      >
        <IssueForm
          columnId={createColumnId}
          currentUserId={currentUser?.id}
          projectMembers={project?.members || []}
          onSubmit={async (formData) => {
            try {
              await createIssue({
                projectId: activeProjectId,
                ...formData
              });
              dispatch(closeCreateModal());
            } catch (err) {
              console.error("Failed to create issue:", err);
            }
          }}
          onCancel={() => dispatch(closeCreateModal())}
        />
      </Modal>

      {/* Edit Issue Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => dispatch(closeEditModal())}
        title="Edit Issue"
      >
        {selectedIssue && (
          <IssueForm
            issue={selectedIssue}
            currentUserId={currentUser?.id}
            projectMembers={project?.members || []}
            onSubmit={async (formData) => {
              try {
                await updateIssue({
                  projectId: activeProjectId,
                  issueId: selectedIssue.id,
                  ...formData
                });
                dispatch(closeEditModal());
              } catch (err) {
                console.error("Failed to update issue:", err);
              }
            }}
            onCancel={() => dispatch(closeEditModal())}
          />
        )}
      </Modal>
    </>
  );
};

export default Board;
