import { createSelector } from '@reduxjs/toolkit';

export const selectNavigation = (state) => state.navigation;

export const selectActiveView = createSelector(
  [selectNavigation],
  (navigation) => navigation.activeView
);

export const selectActiveProjectId = createSelector(
  [selectNavigation],
  (navigation) => navigation.activeProjectId
);

export const selectActiveBoardId = createSelector(
  [selectNavigation],
  (navigation) => navigation.activeBoardId
);

export const selectActiveProjectAndBoard = createSelector(
  [selectNavigation],
  (navigation) => ({
    projectId: navigation.activeProjectId,
    boardId: navigation.activeBoardId,
  })
);
