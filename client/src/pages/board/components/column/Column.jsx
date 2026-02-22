import React, { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
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
 * Displays a column with its header, issue count, and list of issue cards
 * Handles drag and drop interactions for issues internally
 * 
 * @param {Object} props
 * @param {Object} props.column - Column data object
 * @param {string} props.projectKey - Project key for issue numbering
 * @param {Function} props.onIssueMove - Handler for moving issues between columns
 * @param {Function} props.onAddClick - Handler for add button click
 * @param {Function} props.onCardClick - Handler for card click
 */
const Column = ({
  column,
  projectKey,
  onIssueMove,
  onAddClick,
  onCardClick,
}) => {
  const issueCount = column.issues?.length || 0;
  const columnColor = getColumnColor(column.name);

  // ==================== DRAG STATE ====================
  
  const [dragState, setDragState] = useState({
    isDragOver: false,
    draggedCardId: null,
  });

  // ==================== DRAG HANDLERS ====================

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragState(prev => ({ ...prev, isDragOver: true }));
  }, []);

  const handleDragLeave = useCallback((e) => {
    // Only clear drag state if we're actually leaving the column container
    // (not just entering a child element)
    const relatedTarget = e.relatedTarget;
    const currentTarget = e.currentTarget;
    
    // Check if we're still inside the column container
    if (relatedTarget && currentTarget.contains(relatedTarget)) {
      return;
    }
    
    setDragState(prev => ({ ...prev, isDragOver: false }));
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    
    // Always reset drag state on drop
    setDragState({ isDragOver: false, draggedCardId: null });
    
    // Get the dragged issue data from dataTransfer
    const dragData = e.dataTransfer.getData('application/json');
    if (!dragData) return;

    try {
      const { issue } = JSON.parse(dragData);
      
      // Calculate new position - append to end of target column
      const newPosition = column.issues?.length || 0;
      
      // Call the parent's move handler
      onIssueMove?.({
        issue,
        targetColumnId: column.id,
        newPosition,
      });
    } catch (err) {
      console.error('Failed to parse drag data:', err);
    }
  }, [column, onIssueMove]);

  // Handle drag end to ensure state is reset
  const handleColumnDragEnd = useCallback(() => {
    setDragState({ isDragOver: false, draggedCardId: null });
  }, []);

  const handleCardDragStart = useCallback(() => {
    // This is called by IssueCard when drag starts
    // The IssueCard handles the dataTransfer internally
  }, []);

  const handleCardDragEnd = useCallback(() => {
    setDragState(prev => ({ ...prev, draggedCardId: null }));
  }, []);

  // ==================== RENDER ====================

  return (
    <ColumnContainer
      $isDragOver={dragState.isDragOver}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleColumnDragEnd}
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

      <CardList $isDragOver={dragState.isDragOver}>
        {column.issues?.length > 0 ? (
          column.issues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              projectKey={projectKey}
              columnId={column.id}
              onDragStart={handleCardDragStart}
              onDragEnd={handleCardDragEnd}
              onClick={() => onCardClick({...issue, column})}
            />
          ))
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

