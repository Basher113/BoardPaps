import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { BoardContainer } from "./Board.styles";
import Header from "./components/header/Header";
import Column from "./components/column/Column";
import IssueCard from "./components/issue-card/IssueCard";
import IssueDetailModal from "./components/issue-detail/IssueDetailModal";
import ConfirmModal from "../../components/ui/confirm-modal/ConfirmModal";
import InviteDrawer from "./components/invite-modal/InviteDrawer";
import IssueDrawer from "./components/form/IssueDrawer";
import BoardSkeleton from "./components/skeleton/BoardSkeleton";
import useIssueMutations from "./hooks/useIssueMutations";
import useIssueModals from "./hooks/useIssueModals";
import { selectActiveProjectId } from "../../reducers/slices/navigation/navigation.selector";
import { 
  useGetProjectQuery, 
} from "../../reducers/slices/project/project.apiSlice";
import { useMoveIssueMutation } from "../../reducers/slices/issue/issue.apiSlice";
import { logger } from "../../utils/logger";
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
 * Main Kanban board view with dnd-kit drag and drop
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

  // ==================== DND-KIT SETUP ====================

  // Track active issue for DragOverlay
  const [activeIssue, setActiveIssue] = useState(null);

  // Configure sensors for different input methods
  const sensors = useSensors(
    // Mouse/pointer sensor - requires movement before drag starts
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    // Touch sensor - optimized for mobile
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // 200ms hold before drag starts
        tolerance: 8, // Allow 8px movement during hold
      },
    }),
    // Keyboard sensor for accessibility
    useSensor(KeyboardSensor)
  );

  // Flatten all issues for lookup
  const allIssues = useMemo(() => {
    return columns?.flatMap(column => column.issues || []) || [];
  }, [columns]);

  // Create issue map for quick lookup
  const issueMap = useMemo(() => {
    const map = new Map();
    allIssues.forEach(issue => {
      map.set(issue.id, issue);
    });
    return map;
  }, [allIssues]);

  // Find which column an issue belongs to
  const findColumnByIssueId = useCallback((issueId) => {
    if (!columns) return null;
    for (const column of columns) {
      const issue = column.issues?.find(i => i.id === issueId);
      if (issue) return column.id;
    }
    return null;
  }, [columns]);

  // Handle drag start
  const handleDragStart = useCallback((event) => {
    const { active } = event;
    const issue = issueMap.get(active.id);
    if (issue) {
      setActiveIssue(issue);
    }
  }, [issueMap]);

  // Handle drag end
  const handleDragEnd = useCallback(async (event) => {
    const { active, over } = event;
    
    // Reset active issue
    setActiveIssue(null);

    // If no drop target, cancel
    if (!over) return;

    const issueId = active.id;
    const overId = over.id;

    // Find the source column
    const sourceColumnId = findColumnByIssueId(issueId);
    
    // Determine if overId is a column or an issue
    let targetColumnId;
    let newPosition = 0;
    
    // Check if overId is a column ID
    const targetColumn = columns?.find(c => c.id === overId);
    
    if (targetColumn) {
      // Dropped on a column
      targetColumnId = overId;
      newPosition = targetColumn.issues?.length || 0;
    } else {
      // Dropped on an issue - find the column that contains this issue
      targetColumnId = findColumnByIssueId(overId);
      if (!targetColumnId) return;
      
      // Find the target column to get position
      const column = columns?.find(c => c.id === targetColumnId);
      const overIssueIndex = column?.issues?.findIndex(i => i.id === overId) ?? 0;
      newPosition = Math.max(0, overIssueIndex);
    }
    
    // If dropped in same column at same position, no action needed
    if (sourceColumnId === targetColumnId) {
      // Check if position actually changed
      const sourceColumn = columns?.find(c => c.id === sourceColumnId);
      const currentIssueIndex = sourceColumn?.issues?.findIndex(i => i.id === issueId) ?? -1;
      if (currentIssueIndex === newPosition || newPosition === sourceColumn?.issues?.length) {
        return; // Same position, no need to move
      }
    }

    // Find the issue data
    const issue = issueMap.get(issueId);
    if (!issue) return;

    // Call the move API
    try {
      await moveIssue({
        projectId: activeProjectId,
        issueId: issue.id,
        columnId: targetColumnId,
        newPosition,
      }).unwrap();
    } catch (err) {
      logger.apiError("Move issue", err);
      toast.error(err?.data?.message || "Failed to move issue. Please try again.");
    }
  }, [columns, issueMap, findColumnByIssueId, moveIssue, activeProjectId]);

  // ==================== CUSTOM HOOKS ====================
  
  const mutations = useIssueMutations({ selectedIssue });
  const modals = useIssueModals();

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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
            onAddClick={modals.openCreateModalWithColumn}
            onCardClick={modals.openDetailModal}
          />
        ))}
      </BoardContainer>

      {/* DragOverlay shows a visual copy while dragging */}
      <DragOverlay>
        {activeIssue ? (
          <IssueCard
            issue={activeIssue}
            isDragging
          />
        ) : null}
      </DragOverlay>

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

      {/* Invite Drawer */}
      <InviteDrawer
        isOpen={modals.isInviteModalOpen}
        onClose={modals.closeInviteModal}
        projectId={activeProjectId}
        projectName={project?.name}
      />

      {/* Create Issue Drawer */}
      <IssueDrawer
        isOpen={isCreateModalOpen}
        columnId={createColumnId}
        currentUserId={currentUser?.id}
        projectMembers={project?.members || []}
        projectKey={project?.key}
        onSubmit={mutations.handleCreateIssue}
        onClose={mutations.handleCloseCreateModal}
      />

      {/* Edit Issue Drawer */}
      <IssueDrawer
        isOpen={isEditModalOpen}
        issue={selectedIssue}
        currentUserId={currentUser?.id}
        projectMembers={project?.members || []}
        projectKey={project?.key}
        onSubmit={mutations.handleUpdateIssue}
        onClose={mutations.handleCloseEditModal}
      />

      {/* Issue Detail Modal */}
      <IssueDetailModal
        isOpen={modals.isDetailModalOpen}
        onClose={modals.closeDetailModal}
        issue={modals.detailIssue}
        projectId={activeProjectId}
      />
    </DndContext>
  );
};

export default Board;
