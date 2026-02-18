import { useState, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';

/**
 * Custom hook for managing drag and drop functionality for kanban board issues
 * 
 * @param {Object} options - Hook options
 * @param {string} options.activeProjectId - The active project ID
 * @param {Array} options.columns - Array of column objects
 * @param {Function} options.moveIssue - Function to call when moving an issue
 * @returns {Object} Drag and drop state and handlers
 */
const useDragAndDrop = ({ activeProjectId, columns, moveIssue }) => {
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);

  // Race condition prevention: track pending move operations
  const pendingMovesRef = useRef(Promise.resolve());
  const isDraggingRef = useRef(false);

  /**
   * Queue move operations to prevent race conditions
   * Ensures moves happen sequentially rather than concurrently
   */
  const queueMoveOperation = useCallback((moveFn) => {
    pendingMovesRef.current = pendingMovesRef.current
      .then(() => moveFn())
      .catch(() => {
        // Error handling is done in the move function
      });
  }, []);

  /**
   * Handle drag start event
   * Sets the dragged card and its source column
   * 
   * @param {Object} card - The issue card being dragged
   * @param {string} columnId - The source column ID
   */
  const handleDragStart = useCallback((card, columnId) => {
    if (isDraggingRef.current) return; // Prevent starting new drag while one is in progress
    isDraggingRef.current = true;
    setDraggedCard(card);
    setDraggedFrom(columnId);
  }, []);

  /**
   * Handle drag over event
   * Updates the column being hovered over
   * 
   * @param {React.DragEvent} e - The drag event
   * @param {string} columnId - The column being hovered
   */
  const handleDragOver = useCallback((e, columnId) => {
    e.preventDefault();
    setDraggedOver(columnId);
  }, []);

  /**
   * Handle drop event
   * Moves the issue to the target column
   * 
   * @param {React.DragEvent} e - The drop event
   * @param {string} columnId - The target column ID
   */
  const handleDrop = useCallback((e, columnId) => {
    e.preventDefault();
    
    if (!draggedCard || !draggedFrom || !activeProjectId) return;

    // Calculate new position - append to end of target column
    const targetColumn = columns.find(c => c.id === columnId);
    const newPosition = targetColumn?.issues?.length || 0;

    // Queue the move operation to prevent race conditions
    queueMoveOperation(async () => {
      try {
        await moveIssue({
          projectId: activeProjectId,
          issueId: draggedCard.id,
          columnId,
          newPosition,
        }).unwrap();
      } catch (err) {
        console.error("Failed to move issue:", err);
        toast.error("Failed to move issue. Please try again.");
      }
    });

    // Reset drag state
    setDraggedCard(null);
    setDraggedFrom(null);
    setDraggedOver(null);
    isDraggingRef.current = false;
  }, [draggedCard, draggedFrom, activeProjectId, columns, moveIssue, queueMoveOperation]);

  /**
   * Handle drag end event
   * Resets drag state if drop didn't happen
   */
  const handleDragEnd = useCallback(() => {
    setDraggedCard(null);
    setDraggedFrom(null);
    setDraggedOver(null);
    isDraggingRef.current = false;
  }, []);

  /**
   * Check if a specific card is currently being dragged
   * @param {string} cardId - The card ID to check
   * @returns {boolean}
   */
  const isCardDragging = useCallback((cardId) => {
    return draggedCard?.id === cardId;
  }, [draggedCard]);

  /**
   * Check if a specific column is being dragged over
   * @param {string} columnId - The column ID to check
   * @returns {boolean}
   */
  const isColumnDragOver = useCallback((columnId) => {
    return draggedOver === columnId;
  }, [draggedOver]);

  return {
    // State
    draggedCard,
    draggedFrom,
    draggedOver,
    
    // Handlers
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    
    // Utility functions
    isCardDragging,
    isColumnDragOver,
  };
};

export default useDragAndDrop;
