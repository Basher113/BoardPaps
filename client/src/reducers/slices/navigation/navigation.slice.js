import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeView: "board",
  activeProjectId: null,
  activeBoardId: null,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setActiveView: (state, action) => {
      state.activeView = action.payload;
    },
    setActiveProject: (state, action) => {
      state.activeProjectId = action.payload.projectId;
      state.activeBoardId = action.payload.boardId || null;
    },
    setActiveBoard: (state, action) => {
      state.activeBoardId = action.payload;
    },
    clearNavigation: (state) => {
      state.activeProjectId = null;
      state.activeBoardId = null;
    },
  },
});

export const {
  setActiveView,
  setActiveProject,
  setActiveBoard,
  clearNavigation,
} = navigationSlice.actions;

export default navigationSlice.reducer;
