import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeView: "board",
  activeProjectId: null,
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
    },
    clearNavigation: (state) => {
      state.activeProjectId = null;
    },
  },
});

export const {
  setActiveView,
  setActiveProject,
  clearNavigation,
} = navigationSlice.actions;

export default navigationSlice.reducer;
