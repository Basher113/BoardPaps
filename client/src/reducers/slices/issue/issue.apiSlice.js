import { apiSlice } from "../../apiSlice";

/**
 * Issue API Slice
 * Contains all issue-related endpoints
 * 
 * Caching Strategy:
 * - Uses optimistic updates for immediate UI feedback
 * - Does NOT invalidate tags after successful optimistic update (prevents double-fetch)
 * - Only invalidates on error to force refresh
 * - Cache updates use server response to replace temp data
 * 
 * Note: Optimistic updates reference 'getProject' endpoint from project.apiSlice
 * This works because all slices inject into the same apiSlice
 */
export const issueApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Create a new issue
     * Uses optimistic update for immediate UI feedback
     * Updates cache with server response after success
     */
    createIssue: builder.mutation({
      query: ({ projectId, ...data }) => ({
        url: `projects/${projectId}/issues`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted({ projectId, columnId, ...data }, { dispatch, queryFulfilled }) {
        // Create temporary issue for optimistic update
        const tempId = `temp-${Date.now()}`;
        
        // Optimistic update - add the issue immediately
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getProject", projectId, (project) => {
            if (!project?.data?.columns) return;
            
            const columns = project.data.columns;
            const column = columns.find(c => c.id === columnId);
            if (column) {
              const newIssue = {
                id: tempId,
                ...data,
                columnId,
                position: column.issues?.length || 0,
                reporter: { id: "current", username: "Current User" },
                assignee: data.assigneeId ? { id: data.assigneeId, username: "Assignee" } : null,
                _count: { comments: 0 }, // Default count for optimistic update
                isOptimistic: true, // Flag for UI to show loading state
              };
              
              if (!column.issues) {
                column.issues = [];
              }
              column.issues.push(newIssue);
            }
          })
        );
        
        try {
          const { data: response } = await queryFulfilled;
          
          // Replace temp issue with real data from server
          dispatch(
            apiSlice.util.updateQueryData("getProject", projectId, (project) => {
              if (!project?.data?.columns) return;
              
              const columns = project.data.columns;
              const column = columns.find(c => c.id === columnId);
              if (column) {
                const tempIndex = column.issues?.findIndex(i => i.id === tempId);
                if (tempIndex !== -1) {
                  // Replace temp issue with server response
                  column.issues[tempIndex] = response.data || response;
                }
              }
            })
          );
        } catch {
          // Rollback on error
          patchResult.undo();
        }
      },
      // NO invalidatesTags - cache is already updated optimistically
      // This prevents double-fetching after create
    }),

    /**
     * Move an issue to a different column or position
     * Uses optimistic update for smooth drag-and-drop experience
     * No server response update needed - move just changes position
     */
    moveIssue: builder.mutation({
      query: ({ projectId, issueId, columnId, newPosition }) => ({
        url: `projects/${projectId}/issues/${issueId}/move`,
        method: "PATCH",
        body: { columnId, newPosition },
      }),
      async onQueryStarted({ projectId, issueId, columnId, newPosition }, { dispatch, queryFulfilled }) {
        // Optimistic update - update the issue immediately
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getProject", projectId, (project) => {
            if (!project?.data?.columns) return;
            
            const columns = project.data.columns;
            // Find the issue in any column
            for (const column of columns) {
              const issueIndex = column.issues?.findIndex(i => i.id === issueId);
              if (issueIndex !== undefined && issueIndex !== -1) {
                const issue = column.issues[issueIndex];
                
                // Remove from old column
                column.issues.splice(issueIndex, 1);
                
                // Add to new column
                const targetColumn = columns.find(c => c.id === columnId);
                if (targetColumn) {
                  // Insert at the correct position
                  const insertIndex = Math.min(newPosition, targetColumn.issues.length);
                  targetColumn.issues.splice(insertIndex, 0, { ...issue, columnId });
                }
                break;
              }
            }
          })
        );
        
        try {
          await queryFulfilled;
          // Success - cache is already updated, no further action needed
        } catch {
          // Rollback on error
          patchResult.undo();
        }
      },
      // NO invalidatesTags - move operation is purely positional
    }),

    /**
     * Update issue properties
     * Uses optimistic update for immediate UI feedback
     * Updates cache with server response after success
     */
    updateIssue: builder.mutation({
      query: ({ projectId, issueId, columnId, newPosition, ...data }) => ({
        url: `projects/${projectId}/issues/${issueId}`,
        method: "PUT",
        body: { ...data, columnId, newPosition },
      }),
      async onQueryStarted({ projectId, issueId, columnId, newPosition, ...data }, { dispatch, queryFulfilled }) {
        // Optimistic update - update the issue immediately
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getProject", projectId, (project) => {
            if (!project?.data?.columns) return;
            
            const columns = project.data.columns;
            // Find the issue in any column
            for (const column of columns) {
              const issueIndex = column.issues?.findIndex(i => i.id === issueId);
              if (issueIndex !== undefined && issueIndex !== -1) {
                const issue = column.issues[issueIndex];
                
                // If moving to a different column
                if (columnId && columnId !== issue.columnId) {
                  // Remove from old column
                  column.issues.splice(issueIndex, 1);
                  
                  // Add to new column
                  const targetColumn = columns.find(c => c.id === columnId);
                  if (targetColumn) {
                    const insertIndex = newPosition !== undefined 
                      ? Math.min(newPosition, targetColumn.issues.length)
                      : targetColumn.issues.length;
                    targetColumn.issues.splice(insertIndex, 0, { ...issue, ...data, columnId });
                  }
                } else {
                  // Just update the issue properties
                  column.issues[issueIndex] = { ...issue, ...data };
                }
                break;
              }
            }
          })
        );
        
        try {
          const { data: response } = await queryFulfilled;
          
          // Update with server response to ensure data consistency
          dispatch(
            apiSlice.util.updateQueryData("getProject", projectId, (project) => {
              if (!project?.data?.columns) return;
              
              const columns = project.data.columns;
              // Find the issue and update with server response
              for (const column of columns) {
                const issueIndex = column.issues?.findIndex(i => i.id === issueId);
                if (issueIndex !== undefined && issueIndex !== -1) {
                  // Merge server response with existing issue data
                  column.issues[issueIndex] = {
                    ...column.issues[issueIndex],
                    ...(response.data || response),
                  };
                  break;
                }
              }
            })
          );
        } catch {
          // Rollback on error
          patchResult.undo();
        }
      },
      // NO invalidatesTags - cache is already updated optimistically
    }),

    /**
     * Delete an issue
     * Uses optimistic update for immediate UI feedback
     */
    deleteIssue: builder.mutation({
      query: ({ projectId, issueId }) => ({
        url: `projects/${projectId}/issues/${issueId}`,
        method: "DELETE",
      }),
      async onQueryStarted({ projectId, issueId }, { dispatch, queryFulfilled }) {
        // Optimistic update - remove the issue immediately
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getProject", projectId, (project) => {
            if (!project?.data?.columns) return;
            
            const columns = project.data.columns;
            // Find and remove the issue from any column
            for (const column of columns) {
              const issueIndex = column.issues?.findIndex(i => i.id === issueId);
              if (issueIndex !== undefined && issueIndex !== -1) {
                column.issues.splice(issueIndex, 1);
                break;
              }
            }
          })
        );
        
        try {
          await queryFulfilled;
          // Success - cache is already updated, no further action needed
        } catch {
          // Rollback on error
          patchResult.undo();
        }
      },
      // NO invalidatesTags - cache is already updated optimistically
    }),
  }),
});

export const {
  useCreateIssueMutation,
  useMoveIssueMutation,
  useUpdateIssueMutation,
  useDeleteIssueMutation,
} = issueApiSlice;
