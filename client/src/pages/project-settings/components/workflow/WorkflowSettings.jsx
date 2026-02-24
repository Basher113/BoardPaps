import { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { GripVertical, Plus, X, Check } from "lucide-react";
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

const WorkflowSettings = ({ project, canManageSettings }) => {
  const [draftColumns, setDraftColumns] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [editingColumnId, setEditingColumnId] = useState(null);
  const [editingColumnName, setEditingColumnName] = useState("");
  const [draggedColumnId, setDraggedColumnId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, column: null });
  const [discardModal, setDiscardModal] = useState(false);

  const [syncColumns, { isLoading: isSaving }] = useSyncColumnsMutation();

  // Use draft columns if there are changes, otherwise use project columns directly
  const projectColumns = project?.columns || [];
  
  // Initialize draft columns from project columns
  const columns = hasChanges ? draftColumns : projectColumns;

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

  const handleDragStart = useCallback((e, columnId) => {
    if (!canManageSettings) return;
    setDraggedColumnId(columnId);
    e.dataTransfer.effectAllowed = "move";
  }, [canManageSettings]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedColumnId(null);
  }, []);

  const handleDrop = useCallback((e, targetColumnId) => {
    e.preventDefault();

    if (!draggedColumnId || draggedColumnId === targetColumnId) {
      setDraggedColumnId(null);
      return;
    }

    // Initialize draft if needed
    const currentColumns = hasChanges ? draftColumns : projectColumns;
    
    const newOrder = [...currentColumns];
    const draggedIndex = newOrder.findIndex(c => (c.id || c.tempId) === draggedColumnId);
    const targetIndex = newOrder.findIndex(c => (c.id || c.tempId) === targetColumnId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedColumnId(null);
      return;
    }

    const [draggedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);

    const updated = newOrder.map((col, index) => ({
      ...col,
      position: index,
    }));

    setDraftColumns(updated);
    setHasChanges(true);
    setDraggedColumnId(null);
  }, [draftColumns, draggedColumnId, hasChanges, projectColumns]);

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

  const getColumnKey = (column) => column.id || column.tempId;

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
          <ColumnList>
            {columns.map((column) => (
              <ColumnItem
                key={getColumnKey(column)}
                $isDragging={draggedColumnId === getColumnKey(column)}
                $canEdit={canManageSettings}
                draggable={canManageSettings}
                onDragStart={(e) => handleDragStart(e, getColumnKey(column))}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, getColumnKey(column))}
                onDragEnd={handleDragEnd}
              >
                <DragHandle $disabled={!canManageSettings}>
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
            ))}
          </ColumnList>
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