import { apiSlice } from "../../apiSlice";

export const projectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyProjects: builder.query({
      query: () => "projects",
      providesTags: ["Project"],
    }),
    getProject: builder.query({
      query: (projectId) => `projects/${projectId}`,
      providesTags: ["Project"],
    }),
    createProject: builder.mutation({
      query: (data) => ({
        url: "projects",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Project"],
    }),
    deleteProject: builder.mutation({
      query: (projectId) => ({
        url: `projects/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),
    createIssue: builder.mutation({
      query: ({ projectId, ...data }) => ({
        url: `projects/${projectId}/issues`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted({ projectId, columnId, ...data }, { dispatch, queryFulfilled }) {
        // Optimistic update - add the issue immediately
        const patchResult = dispatch(
          projectApiSlice.util.updateQueryData("getProject", projectId, (project) => {
            if (!project?.columns) return;
            
            const column = project.columns.find(c => c.id === columnId);
            if (column) {
              const newIssue = {
                id: `temp-${Date.now()}`,
                ...data,
                columnId,
                position: column.issues?.length || 0,
                reporter: { id: "current", username: "Current User" },
                assignee: data.assigneeId ? { id: data.assigneeId, username: "Assignee" } : null,
              };
              
              if (!column.issues) {
                column.issues = [];
              }
              column.issues.push(newIssue);
            }
          })
        );
        
        try {
          await queryFulfilled;
        } catch {
          // Rollback on error
          patchResult.undo();
        }
      },
      invalidatesTags: ["Project"],
    }),
    moveIssue: builder.mutation({
      query: ({ projectId, issueId, columnId, newPosition }) => ({
        url: `projects/${projectId}/issues/${issueId}/move`,
        method: "PATCH",
        body: { columnId, newPosition },
      }),
      async onQueryStarted({ issueId, columnId, newPosition }, { dispatch, queryFulfilled }) {
        // Optimistic update - update the issue immediately
        const patchResult = dispatch(
          projectApiSlice.util.updateQueryData("getProject", undefined, (project) => {
            if (!project?.columns) return;
            
            // Find the issue in any column
            for (const column of project.columns) {
              const issueIndex = column.issues?.findIndex(i => i.id === issueId);
              if (issueIndex !== undefined && issueIndex !== -1) {
                const issue = column.issues[issueIndex];
                
                // Remove from old column
                column.issues.splice(issueIndex, 1);
                
                // Add to new column
                const targetColumn = project.columns.find(c => c.id === columnId);
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
        } catch {
          // Rollback on error
          patchResult.undo();
        }
      },
      invalidatesTags: ["Project"],
    }),
    updateIssue: builder.mutation({
      query: ({ projectId, issueId, columnId, newPosition, ...data }) => ({
        url: `projects/${projectId}/issues/${issueId}`,
        method: "PUT",
        body: { ...data, columnId, newPosition },
      }),
      async onQueryStarted({ issueId, columnId, newPosition, ...data }, { dispatch, queryFulfilled }) {
        // Optimistic update - update the issue immediately
        const patchResult = dispatch(
          projectApiSlice.util.updateQueryData("getProject", undefined, (project) => {
            if (!project?.columns) return;
            
            // Find the issue in any column
            for (const column of project.columns) {
              const issueIndex = column.issues?.findIndex(i => i.id === issueId);
              if (issueIndex !== undefined && issueIndex !== -1) {
                const issue = column.issues[issueIndex];
                
                // If moving to a different column
                if (columnId && columnId !== issue.columnId) {
                  // Remove from old column
                  column.issues.splice(issueIndex, 1);
                  
                  // Add to new column
                  const targetColumn = project.columns.find(c => c.id === columnId);
                  if (targetColumn) {
                    const insertIndex = newPosition !== undefined 
                      ? Math.min(newPosition, targetColumn.issues.length)
                      : targetColumn.issues.length;
                    targetColumn.issues.splice(insertIndex, 0, { ...issue, columnId });
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
          await queryFulfilled;
        } catch {
          // Rollback on error
          patchResult.undo();
        }
      },
      invalidatesTags: ["Project"],
    }),
    deleteIssue: builder.mutation({
      query: ({ projectId, issueId }) => ({
        url: `projects/${projectId}/issues/${issueId}`,
        method: "DELETE",
      }),
      async onQueryStarted(issueId, { dispatch, queryFulfilled }) {
        // Optimistic update - remove the issue immediately
        const patchResult = dispatch(
          projectApiSlice.util.updateQueryData("getProject", undefined, (project) => {
            if (!project?.columns) return;
            
            // Find and remove the issue from any column
            for (const column of project.columns) {
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
        } catch {
          // Rollback on error
          patchResult.undo();
        }
      },
      invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useGetMyProjectsQuery,
  useGetProjectQuery,
  useVisitProjectMutation,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useCreateIssueMutation,
  useMoveIssueMutation,
  useUpdateIssueMutation,
  useDeleteIssueMutation,
} = projectApiSlice;
