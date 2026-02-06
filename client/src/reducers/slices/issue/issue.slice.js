import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedIssueId: null,
  isEditModalOpen: false,
  isCreateModalOpen: false,
  isDeleteModalOpen: false,
  deleteIssueId: null,
  createColumnId: null,
};

const issueSlice = createSlice({
  name: 'issue',
  initialState,
  reducers: {
    openEditModal: (state, action) => {
      state.selectedIssueId = action.payload;
      state.isEditModalOpen = true;
    },
    closeEditModal: (state) => {
      state.selectedIssueId = null;
      state.isEditModalOpen = false;
    },
    openCreateModal: (state, action) => {
      state.createColumnId = action.payload;
      state.isCreateModalOpen = true;
    },
    closeCreateModal: (state) => {
      state.createColumnId = null;
      state.isCreateModalOpen = false;
    },
    openDeleteModal: (state, action) => {
      state.deleteIssueId = action.payload;
      state.isDeleteModalOpen = true;
    },
    closeDeleteModal: (state) => {
      state.deleteIssueId = null;
      state.isDeleteModalOpen = false;
    },
  },
});

export const { 
  openEditModal, 
  closeEditModal,
  openCreateModal,
  closeCreateModal,
  openDeleteModal,
  closeDeleteModal,
} = issueSlice.actions;

export const selectSelectedIssueId = (state) => state.issue.selectedIssueId;
export const selectIsEditModalOpen = (state) => state.issue.isEditModalOpen;
export const selectIsCreateModalOpen = (state) => state.issue.isCreateModalOpen;
export const selectCreateColumnId = (state) => state.issue.createColumnId;
export const selectIsDeleteModalOpen = (state) => state.issue.isDeleteModalOpen;
export const selectDeleteIssueId = (state) => state.issue.deleteIssueId;

export default issueSlice.reducer;
