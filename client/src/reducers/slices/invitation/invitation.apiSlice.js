import { apiSlice } from "../../apiSlice";

export const invitationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get current user's pending invitations
    getMyInvitations: builder.query({
      query: () => "users/me/invitations",
      providesTags: ["Invitation"],
    }),

    // Get count of pending invitations for current user
    getMyInvitationsCount: builder.query({
      query: () => "users/me/invitations/count",
      providesTags: ["Invitation"],
    }),

    // Get pending invitations for a project (admin/owner only)
    getProjectInvitations: builder.query({
      query: (projectId) => `projects/${projectId}/invitations`,
      providesTags: ["Invitation"],
    }),

    // Send an invitation to a project (admin/owner only)
    sendInvitation: builder.mutation({
      query: ({ projectId, email, role }) => ({
        url: `projects/${projectId}/invitations`,
        method: "POST",
        body: { email, role },
      }),
      invalidatesTags: ["Invitation"],
    }),

    // Accept an invitation
    acceptInvitation: builder.mutation({
      query: (invitationId) => ({
        url: `users/me/invitations/${invitationId}/accept`,
        method: "POST",
      }),
      invalidatesTags: ["Invitation", "Project"],
    }),

    // Decline an invitation
    declineInvitation: builder.mutation({
      query: (invitationId) => ({
        url: `users/me/invitations/${invitationId}/decline`,
        method: "POST",
      }),
      invalidatesTags: ["Invitation"],
    }),

    // Cancel/revoke an invitation (admin/owner only)
    cancelInvitation: builder.mutation({
      query: ({ projectId, invitationId }) => ({
        url: `projects/${projectId}/invitations/${invitationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Invitation"],
    }),
  }),
});

export const {
  useGetMyInvitationsQuery,
  useGetMyInvitationsCountQuery,
  useGetProjectInvitationsQuery,
  useSendInvitationMutation,
  useAcceptInvitationMutation,
  useDeclineInvitationMutation,
  useCancelInvitationMutation,
} = invitationApiSlice;
