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
    // Project Settings
    getProjectSettings: builder.query({
      query: (projectId) => `projects/${projectId}/settings`,
      providesTags: (result, error, projectId) => [
        { type: "Project", id: projectId },
        "ProjectMembers"
      ],
    }),
    updateProject: builder.mutation({
      query: ({ projectId, ...data }) => ({
        url: `projects/${projectId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Project", id: projectId }
      ],
    }),
    deleteProject: builder.mutation({
      query: (projectId) => ({
        url: `projects/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),
    transferProjectOwnership: builder.mutation({
      query: ({ projectId, newOwnerId }) => ({
        url: `projects/${projectId}/transfer`,
        method: "PUT",
        body: { newOwnerId },
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Project", id: projectId },
        "ProjectMembers"
      ],
    }),
    // Member Management
    getProjectMembers: builder.query({
      query: (projectId) => `projects/${projectId}/members`,
      providesTags: ["ProjectMembers"],
    }),
    updateMemberRole: builder.mutation({
      query: ({ projectId, memberId, role }) => ({
        url: `projects/${projectId}/members/${memberId}`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Project", id: projectId },
        "ProjectMembers"
      ],
    }),
    removeMember: builder.mutation({
      query: ({ projectId, memberId }) => ({
        url: `projects/${projectId}/members/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Project", id: projectId },
        "ProjectMembers"
      ],
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
            if (!project?.data?.columns) return;
            
            const columns = project.data.columns;
            const column = columns.find(c => c.id === columnId);
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
    }),
    moveIssue: builder.mutation({
      query: ({ projectId, issueId, columnId, newPosition }) => ({
        url: `projects/${projectId}/issues/${issueId}/move`,
        method: "PATCH",
        body: { columnId, newPosition },
      }),
      async onQueryStarted({ projectId, issueId, columnId, newPosition }, { dispatch, queryFulfilled }) {
        // Optimistic update - update the issue immediately
        const patchResult = dispatch(
          projectApiSlice.util.updateQueryData("getProject", projectId, (project) => {
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
        } catch {
          // Rollback on error
          patchResult.undo();
        }
      },
    }),
    updateIssue: builder.mutation({
      query: ({ projectId, issueId, columnId, newPosition, ...data }) => ({
        url: `projects/${projectId}/issues/${issueId}`,
        method: "PUT",
        body: { ...data, columnId, newPosition },
      }),
      async onQueryStarted({ projectId, issueId, columnId, newPosition, ...data }, { dispatch, queryFulfilled }) {
        // Optimistic update - update the issue immediately
        const patchResult = dispatch(
          projectApiSlice.util.updateQueryData("getProject", projectId, (project) => {
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
      async onQueryStarted({ projectId, issueId }, { dispatch, queryFulfilled }) {
        // Optimistic update - remove the issue immediately
        const patchResult = dispatch(
          projectApiSlice.util.updateQueryData("getProject", projectId, (project) => {
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
        } catch {
          // Rollback on error
          patchResult.undo();
        }
      },
      invalidatesTags: ["Project"],
    }),
    // Audit Logs
    getProjectAuditLogs: builder.query({
      query: ({ projectId, limit = 50, offset = 0, action, userId }) => {
        const params = new URLSearchParams();
        params.append('limit', limit);
        params.append('offset', offset);
        if (action) params.append('action', action);
        if (userId) params.append('userId', userId);
        
        return `projects/${projectId}/audit-logs?${params.toString()}`;
      },
      providesTags: (result, error, { projectId }) => [
        { type: 'AuditLog', id: projectId }
      ],
    }),
    // Column operations
    getColumns: builder.query({
      query: (projectId) => `projects/${projectId}/columns`,
      providesTags: (result, error, projectId) => [
        { type: 'Column', id: projectId }
      ],
    }),
    getColumn: builder.query({
      query: ({ projectId, columnId }) => `projects/${projectId}/columns/${columnId}`,
      providesTags: (result, error, { columnId }) => [
        { type: 'Column', id: columnId }
      ],
    }),
    createColumn: builder.mutation({
      query: ({ projectId, ...data }) => ({
        url: `projects/${projectId}/columns`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: 'Column', id: projectId },
        { type: "Project", id: projectId }
      ],
    }),
    updateColumn: builder.mutation({
      query: ({ projectId, columnId, ...data }) => ({
        url: `projects/${projectId}/columns/${columnId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { projectId, columnId }) => [
        { type: 'Column', id: columnId },
        { type: 'Column', id: projectId },
        { type: "Project", id: projectId }
      ],
    }),
    reorderColumns: builder.mutation({
      query: ({ projectId, columnOrders }) => ({
        url: `projects/${projectId}/columns/reorder`,
        method: "PATCH",
        body: { columnOrders },
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: 'Column', id: projectId },
        { type: "Project", id: projectId }
      ],
    }),
    deleteColumn: builder.mutation({
      query: ({ projectId, columnId }) => ({
        url: `projects/${projectId}/columns/${columnId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId, columnId }) => [
        { type: 'Column', id: columnId },
        { type: 'Column', id: projectId },
        { type: "Project", id: projectId }
      ],
    }),
  }),
});

export const {
  useGetMyProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectSettingsQuery,
  useUpdateProjectMutation,
  useTransferProjectOwnershipMutation,
  useGetProjectMembersQuery,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
  useCreateIssueMutation,
  useMoveIssueMutation,
  useUpdateIssueMutation,
  useDeleteIssueMutation,
  useGetProjectAuditLogsQuery,
  useGetColumnsQuery,
  useGetColumnQuery,
  useCreateColumnMutation,
  useUpdateColumnMutation,
  useReorderColumnsMutation,
  useDeleteColumnMutation,
} = projectApiSlice;
