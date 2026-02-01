import { Plus } from 'lucide-react';
import {
  ColumnContainer,
  ColumnHeader,
  ColumnHeaderLeft,
  ColumnTitle,
  IssueCount,
  AddButton,
  IssuesContainer
} from './BoardColumn.styles';
import IssueCard from '../issue-card/IssueCard';

const BoardColumn = ({ 
  column, 
  issues, 
  onDragOver, 
  onDrop, 
  onDragStart, 
  onDragEnd, 
  onAddIssue, 
  onEdit, 
  onDelete, 
  currentUserId,
  projectKey 
}) => {
  const columnIssues = issues.filter(issue => issue.columnId === column.id);
  
  return (
    <ColumnContainer
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, column.id)}
    >
      <ColumnHeader>
        <ColumnHeaderLeft>
          <ColumnTitle>{column.name}</ColumnTitle>
          <IssueCount>{columnIssues.length}</IssueCount>
        </ColumnHeaderLeft>
        <AddButton onClick={() => onAddIssue(column.id)}>
          <Plus size={16} />
        </AddButton>
      </ColumnHeader>
      <IssuesContainer>
        {columnIssues.map(issue => (
          <IssueCard 
            key={issue.id} 
            issue={issue} 
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onEdit={onEdit}
            onDelete={onDelete}
            currentUserId={currentUserId}
            projectKey={projectKey}
          />
        ))}
      </IssuesContainer>
    </ColumnContainer>
  );
};

export default BoardColumn;