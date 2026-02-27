import { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { GripVertical, Plus, X, Check } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  SectionCard,
  SectionHeader,
  SectionTitle,
  SectionDesc,
  FormGroup,
  FormLabel,
  ColumnList,
  ColumnItem,
  DragHandle,
  ColumnNameInput,
  ColumnBadge,
  ActionButton,
  AddColumnButton,
  NewColumnForm,
  NewColumnInput,
  FormButton,
  EmptyState,
  HelperText,
} from "./WorkflowSettings.styles";
import ConfirmModal from "../../../../components/ui/confirm-modal/ConfirmModal";
import {
  useSyncColumnsMutation,
} from "../../../../reducers/slices/column/column.apiSlice";

// Helper function to get unique key for column
const getColumnKey = (column) => column.id || column.tempId;

// SortableColumn component wrapping each column for dnd-kit
const SortableColumn = ({ 
  column, 
  canManageSettings, 
  getIssueCountBadge, 
  editingColumnId, 
  editingColumnName, 
  setEditingColumnId, 
  setEditingColumnName, 
  handleUpdateColumn, 
  cancelEditing, 
  handleDeleteColumn 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: getColumnKey(column), disabled: !canManageSettings });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <ColumnItem
      ref={setNodeRef}
      style={style}
      $isDragging={isDragging}
      $canEdit={canManageSettings}
    >
      <DragHandle $disabled={!canManageSettings} {...attributes} {...listeners}>
        <GripVertical size={18} />
      </DragHandle>

      {editingColumnId === getColumnKey(column) ? (
        <>
          <NewColumnInput
            value={editingColumnName}
            onChange={(e) => setEditingColumnName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleUpdateColumn(getColumnKey(column));
              if (e.key === "Escape") cancelEditing();
            }}
            autoFocus
          />
          <FormButton $primary onClick={() => handleUpdateColumn(getColumnKey(column))}>
            <Check size={14} />
          </FormButton>
          <FormButton onClick={cancelEditing}>
            <X size={14} />
          </FormButton>
        </>
      ) : (
        <>
          <ColumnNameInput
            value={column.name}
            readOnly
            onClick={() => {
              if (canManageSettings) {
                setEditingColumnId(getColumnKey(column));
                setEditingColumnName(column.name);
              }
            }}
            title={canManageSettings ? "Click to edit" : ""}
          />
          <ColumnBadge>{getIssueCountBadge(column)}</ColumnBadge>
          {canManageSettings && (
            <ActionButton
              onClick={() => handleDeleteColumn(column)}
              title="Delete column"
            >
              <X size={16} />
            </ActionButton>
          )}
        </>
      )}
    </ColumnItem>
  );
};

// DragOverlayColumn for visual feedback while dragging
const DragOverlayColumn = ({ column, getIssueCountBadge }) => {
  if (!column) return null;
  
  return (
    <ColumnItem
      $isDragging={true}
      $canEdit={true}
      style={{
        opacity: 0.8,
        boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
      }}
    >
      <DragHandle $disabled={false}>
        <GripVertical size={18} />
      </DragHandle>
      <ColumnNameInput value={column.name} readOnly />
      <ColumnBadge>{getIssueCountBadge(column)}</ColumnBadge>
    </ColumnItem>
  );
};

const WorkflowSettings = ({ project, canManageSettings }) => {
  const [draftColumns, setDraftColumns] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [editingColumnId, setEditingColumnId] = useState(null);
  const [editingColumnName, setEditingColumnName] = useState("");
  const [activeColumnId, setActiveColumnId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, column: null });
  const [discardModal, setDiscardModal] = useState(false);

  const [syncColumns, { isLoading: isSaving }] = useSyncColumnsMutation();

  // Use draft columns if there are changes, otherwise use project columns directly
  const projectColumns = project?.columns || [];
  
  // Initialize draft columns from project columns
  const columns = hasChanges ? draftColumns : projectColumns;

  // ==================== DND-KIT SETUP ====================

  // Configure sensors for different input methods (mouse, touch, keyboard)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // 200ms hold before drag starts (mobile-friendly)
        tolerance: 8, // Allow 8px movement during hold
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Track active column for DragOverlay
  const activeColumn = columns.find(c => getColumnKey(c) === activeColumnId);

  // Warn user about unsaved changes when leaving
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  const getIssueCount = (column) => {
    if (column._count?.issues !== undefined) return column._count.issues;
    return column.issues?.length || 0;
  };

  const getIssueCountBadge = (column) => {
    const count = getIssueCount(column);
    return count > 0 ? `${count} issue${count !== 1 ? "s" : ""}` : "Empty";
  };

  const handleCreateColumn = () => {
    if (!newColumnName.trim()) {
      toast.error("Column name is required");
      return;
    }

    const newColumn = {
      tempId: `temp-${Date.now()}`,
      name: newColumnName.trim(),
      position: columns.length,
      isNew: true,
    };

    // Initialize draft with current columns plus new column
    const newDraftColumns = hasChanges ? [...draftColumns, newColumn] : [...projectColumns, newColumn];
    setDraftColumns(newDraftColumns);
    setNewColumnName("");
    setIsAddingColumn(false);
    setHasChanges(true);
  };

  const handleUpdateColumn = (columnId) => {
    if (!editingColumnName.trim()) {
      toast.error("Column name is required");
      return;
    }

    // Initialize draft if needed
    const currentColumns = hasChanges ? draftColumns : projectColumns;
    
    const updatedColumns = currentColumns.map((c) =>
      (c.id === columnId || c.tempId === columnId) 
        ? { ...c, name: editingColumnName.trim() } 
        : c
    );

    setDraftColumns(updatedColumns);
    setEditingColumnId(null);
    setEditingColumnName("");
    setHasChanges(true);
  };

  const cancelEditing = () => {
    setEditingColumnId(null);
    setEditingColumnName("");
  };

  const handleDeleteColumn = (column) => {
    const issueCount = getIssueCount(column);
    if (issueCount > 0) {
      toast.error(
        `Cannot delete "${column.name}" - it contains ${issueCount} issue(s). Move or delete them first.`
      );
      return;
    }
    setDeleteModal({ isOpen: true, column });
  };

  const confirmDeleteColumn = () => {
    const columnId = deleteModal.column?.id || deleteModal.column?.tempId;
    
    // Initialize draft if needed
    const currentColumns = hasChanges ? draftColumns : projectColumns;
    const filteredColumns = currentColumns.filter((c) => (c.id || c.tempId) !== columnId);
    
    setDraftColumns(filteredColumns);
    setDeleteModal({ isOpen: false, column: null });
    setHasChanges(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, column: null });
  };

  // ==================== DND-KIT HANDLERS ====================

  // Handle drag start
  const handleDragStart = useCallback((event) => {
    const { active } = event;
    setActiveColumnId(active.id);
  }, []);

  // Handle drag end - reorder columns
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    
    setActiveColumnId(null);

    // If no drop target, cancel
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // If dropped on same position, no action needed
    if (activeId === overId) return;

    // Initialize draft if needed
    const currentColumns = hasChanges ? draftColumns : projectColumns;
    
    const newOrder = [...currentColumns];
    const draggedIndex = newOrder.findIndex(c => getColumnKey(c) === activeId);
    const targetIndex = newOrder.findIndex(c => getColumnKey(c) === overId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [draggedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);

    const updated = newOrder.map((col, index) => ({
      ...col,
      position: index,
    }));

    setDraftColumns(updated);
    setHasChanges(true);
  }, [draftColumns, hasChanges, projectColumns]);

  const handleSaveChanges = async () => {
    const payload = draftColumns.map((c, index) => ({
      id: c.isNew ? undefined : c.id,
      tempId: c.isNew ? c.tempId : undefined,
      name: c.name,
      position: index,
    }));

    // Optimistically reset local state immediately
    setHasChanges(false);
    setDraftColumns([]);

    try {
      await syncColumns({
        projectId: project.id,
        columns: payload,
      }).unwrap();

      toast.success("Workflow updated successfully");
    } catch (err) {
      // Restore local state on error
      setHasChanges(true);
      setDraftColumns(payload.map((c, i) => ({
        ...c,
        id: c.id || `temp-${Date.now()}-${i}`,
        isNew: !c.id,
      })));
      toast.error(err?.data?.error || err?.data?.message || "Failed to save changes");
    }
  };

  const handleDiscardChanges = () => {
    setDraftColumns([]);
    setHasChanges(false);
    setDiscardModal(false);
    setIsAddingColumn(false);
    setNewColumnName("");
    setEditingColumnId(null);
    setEditingColumnName("");
  };

  // Get column IDs for SortableContext
  const columnIds = useMemo(() => columns.map(c => getColumnKey(c)), [columns]);

  return (
    <SectionCard>
      <SectionHeader>
        <SectionTitle>Workflow & Board</SectionTitle>
        <SectionDesc>Drag to reorder columns. Click Save when done.</SectionDesc>
      </SectionHeader>

      <FormGroup>
        <FormLabel>Board Columns</FormLabel>

        {columns.length === 0 ? (
          <EmptyState>No columns yet. Add your first column to get started.</EmptyState>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveColumnId(null)}
          >
            <SortableContext 
              items={columnIds} 
              strategy={verticalListSortingStrategy}
            >
              <ColumnList>
                {columns.map((column) => (
                  <SortableColumn
                    key={getColumnKey(column)}
                    column={column}
                    canManageSettings={canManageSettings}
                    getIssueCountBadge={getIssueCountBadge}
                    editingColumnId={editingColumnId}
                    editingColumnName={editingColumnName}
                    setEditingColumnId={setEditingColumnId}
                    setEditingColumnName={setEditingColumnName}
                    handleUpdateColumn={handleUpdateColumn}
                    cancelEditing={cancelEditing}
                    handleDeleteColumn={handleDeleteColumn}
                  />
                ))}
              </ColumnList>
            </SortableContext>

            <DragOverlay>
              <DragOverlayColumn 
                column={activeColumn} 
                getIssueCountBadge={getIssueCountBadge}
              />
            </DragOverlay>
          </DndContext>
        )}

        {canManageSettings && (
          <>
            {isAddingColumn ? (
              <NewColumnForm>
                <NewColumnInput
                  placeholder="Column name..."
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateColumn();
                    if (e.key === "Escape") {
                      setIsAddingColumn(false);
                      setNewColumnName("");
                    }
                  }}
                  autoFocus
                />
                <FormButton $primary onClick={handleCreateColumn} disabled={!newColumnName.trim()}>
                  <Check size={14} />
                </FormButton>
                <FormButton
                  onClick={() => {
                    setIsAddingColumn(false);
                    setNewColumnName("");
                  }}
                >
                  <X size={14} />
                </FormButton>
              </NewColumnForm>
            ) : (
              <AddColumnButton onClick={() => setIsAddingColumn(true)}>
                <Plus size={16} /> Add Column
              </AddColumnButton>
            )}
          </>
        )}

        {hasChanges && (
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <FormButton $primary onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </FormButton>
            <FormButton onClick={() => setDiscardModal(true)} disabled={isSaving}>
              Discard
            </FormButton>
          </div>
        )}

        <HelperText>Changes are saved only when you click Save.</HelperText>
      </FormGroup>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteColumn}
        title="Delete Column"
        message={`Are you sure you want to delete the column "${deleteModal.column?.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isSaving}
      />

      <ConfirmModal
        isOpen={discardModal}
        onClose={() => setDiscardModal(false)}
        onConfirm={handleDiscardChanges}
        title="Discard Changes"
        message="Are you sure you want to discard all unsaved changes? This cannot be undone."
        confirmText="Discard"
        cancelText="Cancel"
        variant="danger"
      />
    </SectionCard>
  );
};

export default WorkflowSettings;
