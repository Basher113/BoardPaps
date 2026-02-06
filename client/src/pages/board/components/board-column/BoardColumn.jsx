import { useDispatch } from 'react-redux';
import { Plus } from 'lucide-react';
import {
  ColumnContainer,
  ColumnHeader,
  ColumnHeaderLeft,
  ColumnTitle,
  IssueCount,
  AddButton,
  IssuesContainer,
  EmptyColumnMessage
} from './BoardColumn.styles';
import IssueCard from '../issue-card/IssueCard';
import { openCreateModal } from '../../../../reducers/slices/issue/issue.slice';

const BoardColumn = ({ 
  column, 
  issues, 
  projectKey,
  draggedIssueId,
  onDragStart,
  onDragOverColumn,
  onDragOverIssue,
  onDragLeave,
  onDropOnColumn,
  onDropOnIssue
}) => {
  const dispatch = useDispatch();
  
  // Filter issues for this column and sort by position
  const columnIssues = issues
    .filter(issue => issue.columnId === column.id)
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  // Check if this column is being dragged over
  const isDropTarget = draggedIssueId !== null && draggedIssueId !== undefined;

  const handleAddIssue = () => {
    dispatch(openCreateModal(column.id));
  };

  return (
    <ColumnContainer
      $isOver={isDropTarget}
      onDragOver={(e) => onDragOverColumn?.(e, column.id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDropOnColumn?.(e, column.id)}
    >
      <ColumnHeader>
        <ColumnHeaderLeft>
          <ColumnTitle>{column.name}</ColumnTitle>
          <IssueCount>{columnIssues.length}</IssueCount>
        </ColumnHeaderLeft>
        <AddButton 
          onClick={handleAddIssue}
          aria-label={`Add issue to ${column.name}`}
          title={`Add issue to ${column.name}`}
        >
          <Plus size={16} />
        </AddButton>
      </ColumnHeader>
      <IssuesContainer>
        {columnIssues.length === 0 ? (
          <EmptyColumnMessage>
            No issues yet. Click + to add one.
          </EmptyColumnMessage>
        ) : (
          columnIssues.map(issue => (
            <IssueCard 
              key={issue.id} 
              issue={issue} 
              projectKey={projectKey}
              columnId={column.id}
              isDragging={draggedIssueId === issue.id}
              onDragStart={onDragStart}
              onDragOverIssue={onDragOverIssue}
              onDropOnIssue={onDropOnIssue}
            />
          ))
        )}
      </IssuesContainer>
    </ColumnContainer>
  );
};

export default BoardColumn;
