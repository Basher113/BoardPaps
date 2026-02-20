import { apiSlice } from "../../apiSlice";

/**
 * Member API Slice
 * Contains all project member-related endpoints
 * 
 * Caching Strategy:
 * - Members are project-specific, use project-scoped tags
 * - Cache retention: 5 minutes (members don't change frequently)
 * - Mutations invalidate project cache (members are embedded in project)
 */
export const memberApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get all members of a project
     * Note: This data is also available in getProject response
     * Consider using getProject instead to avoid duplicate data
     */
    getProjectMembers: builder.query({
      query: (projectId) => `projects/${projectId}/members`,
      providesTags: (result, error, projectId) => [
        { type: "ProjectMembers", id: projectId },
      ],
      keepUnusedDataFor: 300, // 5 minutes
    }),

    /**
     * Update a member's role in a project
     * Only OWNER or ADMIN can update roles
     */
    updateMemberRole: builder.mutation({
      query: ({ projectId, memberId, role }) => ({
        url: `projects/${projectId}/members/${memberId}`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: 'Project', id: projectId },
        { type: "ProjectMembers", id: projectId },
      ],
    }),

    /**
     * Remove a member from a project
     * Only OWNER or ADMIN can remove members
     */
    removeMember: builder.mutation({
      query: ({ projectId, memberId }) => ({
        url: `projects/${projectId}/members/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: 'Project', id: projectId },
        { type: "ProjectMembers", id: projectId },
      ],
    }),

    /**
     * Leave a project (remove self as member)
     * Invalidates all project-related caches
     */
    leaveProject: builder.mutation({
      query: (projectId) => ({
        url: `projects/${projectId}/members/me`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, projectId) => [
        { type: 'Project', id: projectId },
        { type: 'Project', id: 'LIST' },
        { type: "ProjectMembers", id: projectId },
      ],
    }),
  }),
});

export const {
  useGetProjectMembersQuery,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
  useLeaveProjectMutation,
} = memberApiSlice;
