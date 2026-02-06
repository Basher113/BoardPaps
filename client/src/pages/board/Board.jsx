import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import { selectActiveProjectId } from "../../reducers/slices/navigation/navigation.selector";
import { 
  useGetProjectQuery, 
  useDeleteIssueMutation,
  useMoveIssueMutation 
} from "../../reducers/slices/project/project.apiSlice";
import { 
  closeDeleteModal, 
  selectIsDeleteModalOpen, 
  selectDeleteIssueId 
} from "../../reducers/slices/issue/issue.slice";

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

  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);

  const columns = project?.columns || [];
  const projectKey = project?.key || "PROJ";




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

    // Calculate new position
    const targetColumn = columns.find(c => c.id === columnId);
    const newPosition = targetColumn?.issues?.findIndex(i => i.id === draggedCard.id) ?? 0;

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
    if (!deleteIssueId) return;
    
    try {
      await deleteIssue(deleteIssueId);
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
                onClick={() => {
                  // For simple add, we can use the inline form or dispatch openCreateModal
                  // For now, let's use a simple approach
                }}
                aria-label={`Add issue to ${column.title}`}
                title={`Add issue to ${column.title}`}
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
    </>
  );
};

export default Board;
