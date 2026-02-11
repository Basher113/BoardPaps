import { apiSlice } from "../../apiSlice";

export const settingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Profile
    getUserProfile: builder.query({
      query: () => "users/me/profile",
      providesTags: ["Settings"],
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: "users/me/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
    
    // Avatar
    uploadUserAvatar: builder.mutation({
      query: (formData) => ({
        url: "users/me/avatar",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Settings", "User"],
    }),
    deleteUserAvatar: builder.mutation({
      query: () => ({
        url: "users/me/avatar",
        method: "DELETE",
      }),
      invalidatesTags: ["Settings", "User"],
    }),
    
    // Security
    changePassword: builder.mutation({
      query: (data) => ({
        url: "users/me/change-password",
        method: "PUT",
        body: data,
      }),
    }),
    getSessions: builder.query({
      query: () => "users/me/sessions",
      providesTags: ["Sessions"],
    }),
    revokeSession: builder.mutation({
      query: (sessionId) => ({
        url: `users/me/sessions/${sessionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sessions"],
    }),
    revokeAllSessions: builder.mutation({
      query: () => ({
        url: "users/me/sessions",
        method: "DELETE",
      }),
      invalidatesTags: ["Sessions"],
    }),
    deleteAccount: builder.mutation({
      query: (data) => ({
        url: "users/me",
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUploadUserAvatarMutation,
  useDeleteUserAvatarMutation,
  useChangePasswordMutation,
  useGetSessionsQuery,
  useRevokeSessionMutation,
  useRevokeAllSessionsMutation,
  useDeleteAccountMutation,
} = settingsApiSlice;
