import React from 'react';
import { Plus } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import {
  ColumnContainer,
  ColumnHeader,
  ColumnHeaderLeft,
  ColumnDot,
  ColumnTitle,
  IssueCount,
  AddButton,
  CardList,
  EmptyState,
} from './Column.styles';
import IssueCard from '../issue-card/IssueCard';

// Column dot colors based on column name
const getColumnColor = (columnName) => {
  const normalized = columnName?.toLowerCase() || '';
  if (normalized.includes('in progress') || normalized.includes('doing')) {
    return '#18181b';
  }
  if (normalized.includes('review') || normalized.includes('testing')) {
    return '#71717a';
  }
  if (normalized.includes('done') || normalized.includes('complete')) {
    return '#d4d4d8';
  }
  return '#a1a1aa';
};

/**
 * Column component for Kanban board
 * Uses dnd-kit's useDroppable for drop target functionality
 * 
 * @param {Object} props
 * @param {Object} props.column - Column data object
 * @param {Function} props.onAddClick - Handler for add button click
 * @param {Function} props.onCardClick - Handler for card click
 */
const Column = ({
  column,
  onAddClick,
  onCardClick,
}) => {
  const issueCount = column.issues?.length || 0;
  const columnColor = getColumnColor(column.name);

  // ==================== DND-KIT DROPPABLE ====================
  
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  // ==================== RENDER ====================

  return (
    <ColumnContainer
      ref={setNodeRef}
      $isDragOver={isOver}
    >
      <ColumnHeader>
        <ColumnHeaderLeft>
          <ColumnDot $color={columnColor} />
          <ColumnTitle>{column.name}</ColumnTitle>
          <IssueCount>{issueCount}</IssueCount>
        </ColumnHeaderLeft>
        
        <AddButton
          onClick={() => onAddClick(column.id)}
          aria-label={`Add issue to ${column.name}`}
          title={`Add issue to ${column.name}`}
        >
          <Plus size={18} />
        </AddButton>
      </ColumnHeader>

      <CardList $isDragOver={isOver}>
        {column.issues?.length > 0 ? (
          <SortableContext 
            items={column.issues.map(i => i.id)}
            strategy={verticalListSortingStrategy}
          >
            {column.issues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onClick={() => onCardClick({...issue, column})}
              />
            ))}
          </SortableContext>
        ) : (
          <EmptyState>
            No issues in this column
            <br />
            <small>Drag issues here or click + to add</small>
          </EmptyState>
        )}
      </CardList>
    </ColumnContainer>
  );
};

export default Column;
