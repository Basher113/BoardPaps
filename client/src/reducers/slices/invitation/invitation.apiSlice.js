import { apiSlice } from "../../apiSlice";

/**
 * Invitation API Slice
 * Contains all invitation-related endpoints
 * 
 * Caching Strategy:
 * - Invitations are time-sensitive, short cache retention (30 seconds)
 * - Uses granular tags for targeted invalidation
 * - Refetch on mount to ensure fresh invitation status
 * - Accept invitation invalidates both Invitation and Project caches
 */
export const invitationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get current user's pending invitations
     * Short cache time - invitations are time-sensitive
     */
    getMyInvitations: builder.query({
      query: () => "users/me/invitations",
      providesTags: (result) => [
        { type: "Invitation", id: "LIST" },
        ...(result?.data || result || []).map(({ id }) => ({ type: "Invitation", id })),
      ],
      keepUnusedDataFor: 30, // 30 seconds - invitations are time-sensitive
      refetchOnMountOrArgChange: true, // Always refetch when component mounts
    }),

    /**
     * Get count of pending invitations for current user
     * Used for notification badges - needs to be fresh
     */
    getMyInvitationsCount: builder.query({
      query: () => "users/me/invitations/count",
      providesTags: [{ type: "Invitation", id: "COUNT" }],
      keepUnusedDataFor: 30, // 30 seconds
      refetchOnMountOrArgChange: true, // Always refetch for accurate count
    }),

    /**
     * Get pending invitations for a project (admin/owner only)
     * Used in project settings - moderate cache time
     */
    getProjectInvitations: builder.query({
      query: (projectId) => `projects/${projectId}/invitations`,
      providesTags: (result, error, projectId) => [
        { type: "ProjectInvitation", id: projectId },
        ...(result?.data || result || []).map(({ id }) => ({ type: "ProjectInvitation", id })),
      ],
      keepUnusedDataFor: 60, // 1 minute
    }),

    /**
     * Send an invitation to a project (admin/owner only)
     * Invalidates project-specific invitation cache
     */
    sendInvitation: builder.mutation({
      query: ({ projectId, email, role, message }) => ({
        url: `projects/${projectId}/invitations`,
        method: "POST",
        body: { email, role, message },
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "ProjectInvitation", id: projectId },
      ],
    }),

    /**
     * Resend an invitation (reset expiration and send new email)
     * Invalidates the specific invitation to update expiration time
     */
    resendInvitation: builder.mutation({
      query: ({ projectId, invitationId }) => ({
        url: `projects/${projectId}/invitations/${invitationId}/resend`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { projectId, invitationId }) => [
        { type: "ProjectInvitation", id: projectId },
        { type: "Invitation", id: invitationId },
      ],
    }),

    /**
     * Accept an invitation
     * Invalidates both Invitation and Project caches
     * User gains access to a new project
     */
    acceptInvitation: builder.mutation({
      query: (invitationId) => ({
        url: `users/me/invitations/${invitationId}/accept`,
        method: "POST",
      }),
      invalidatesTags: (result, error, invitationId) => [
        { type: "Invitation", id: "LIST" },
        { type: "Invitation", id: "COUNT" },
        { type: "Invitation", id: invitationId },
        { type: "Project", id: "LIST" }, // New project available
      ],
    }),

    /**
     * Decline an invitation
     * Invalidates invitation cache to remove declined invitation
     */
    declineInvitation: builder.mutation({
      query: (invitationId) => ({
        url: `users/me/invitations/${invitationId}/decline`,
        method: "POST",
      }),
      invalidatesTags: (result, error, invitationId) => [
        { type: "Invitation", id: "LIST" },
        { type: "Invitation", id: "COUNT" },
        { type: "Invitation", id: invitationId },
      ],
    }),

    /**
     * Cancel/revoke an invitation (admin/owner only)
     * Invalidates project invitation cache
     */
    cancelInvitation: builder.mutation({
      query: ({ projectId, invitationId }) => ({
        url: `projects/${projectId}/invitations/${invitationId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId, invitationId }) => [
        { type: "ProjectInvitation", id: projectId },
        { type: "Invitation", id: invitationId },
      ],
    }),
  }),
});

export const {
  useGetMyInvitationsQuery,
  useGetMyInvitationsCountQuery,
  useGetProjectInvitationsQuery,
  useSendInvitationMutation,
  useResendInvitationMutation,
  useAcceptInvitationMutation,
  useDeclineInvitationMutation,
  useCancelInvitationMutation,
} = invitationApiSlice;
