import { apiSlice } from "../../apiSlice";

/**
 * Project API Slice
 * Contains core project-related endpoints
 * 
 * Caching Strategy:
 * - Project list uses granular tags for individual projects
 * - Single project uses entity-specific tag
 * - Cache retention: 5 minutes for project data (user works on it for extended periods)
 * 
 * Related slices:
 * - issue.apiSlice.js - Issue CRUD operations
 * - member.apiSlice.js - Member management
 * - column.apiSlice.js - Column management
 * - invitation.apiSlice.js - Invitation management
 */
export const projectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==================== PROJECT QUERIES ====================
    
    /**
     * Get all projects the current user is a member of
     * Uses granular tags to prevent over-invalidation
     */
    getMyProjects: builder.query({
      query: () => "projects",
      providesTags: (result) => 
        result?.data 
          ? [
              { type: 'Project', id: 'LIST' },
              ...result.data.map(({ id }) => ({ type: 'Project', id })),
            ]
          : [{ type: 'Project', id: 'LIST' }],
      keepUnusedDataFor: 300, // 5 minutes
    }),
    
    /**
     * Get a single project with all its data (columns, issues, members)
     * Primary data source for board view
     */
    getProject: builder.query({
      query: (projectId) => `projects/${projectId}`,
      providesTags: (result, error, projectId) => [
        { type: 'Project', id: projectId },
        { type: 'Project', id: 'LIST' },
      ],
      keepUnusedDataFor: 300, // 5 minutes - user works on project for extended periods
    }),

    /**
     * Get project settings (for settings page)
     * Longer cache since settings rarely change
     */
    getProjectSettings: builder.query({
      query: (projectId) => `projects/${projectId}/settings`,
      providesTags: (result, error, projectId) => [
        { type: "Project", id: projectId },
        { type: "ProjectMembers", id: projectId },
      ],
      keepUnusedDataFor: 600, // 10 minutes - settings rarely change
    }),

    // ==================== PROJECT MUTATIONS ====================
    
    /**
     * Create a new project
     * Invalidates list but not individual projects
     */
    createProject: builder.mutation({
      query: (data) => ({
        url: "projects",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: 'Project', id: 'LIST' }],
    }),
    
    /**
     * Update project properties
     * Only invalidates the specific project
     */
    updateProject: builder.mutation({
      query: ({ projectId, ...data }) => ({
        url: `projects/${projectId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: 'Project', id: projectId },
      ],
    }),
    
    /**
     * Delete a project
     * Invalidates both the specific project and the list
     */
    deleteProject: builder.mutation({
      query: (projectId) => ({
        url: `projects/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, projectId) => [
        { type: 'Project', id: projectId },
        { type: 'Project', id: 'LIST' },
      ],
    }),
    
    /**
     * Transfer project ownership to another member
     * Invalidates project and members
     */
    transferProjectOwnership: builder.mutation({
      query: ({ projectId, newOwnerId }) => ({
        url: `projects/${projectId}/transfer`,
        method: "PUT",
        body: { newOwnerId },
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: 'Project', id: projectId },
        { type: "ProjectMembers", id: projectId },
      ],
    }),

    /**
     * Mark project as visited (updates lastVisitedAt)
     * No cache invalidation needed - just updates timestamp
     */
    visitProject: builder.mutation({
      query: (projectId) => ({
        url: `projects/${projectId}/visit`,
        method: "PATCH",
      }),
    }),

    // ==================== AUDIT LOGS ====================
    
    /**
     * Get audit logs for a project
     * Short cache since logs can be updated frequently
     */
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
      keepUnusedDataFor: 120, // 2 minutes
    }),
  }),
});

export const {
  useGetMyProjectsQuery,
  useGetProjectQuery,
  useGetProjectSettingsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useTransferProjectOwnershipMutation,
  useVisitProjectMutation,
  useGetProjectAuditLogsQuery,
} = projectApiSlice;
