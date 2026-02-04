import { apiSlice } from "../../apiSlice";

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCurrentUser: builder.query({
      query: () => "auth/me",
      providesTags: ["User"],
    }),

    registerUser: builder.mutation({
      query: (credentials) => ({
        url: "auth/register",
        method: "POST",
        body: credentials
      })
    }),

    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials
      }),
      invalidatesTags: ["User"],
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: "auth/logout",
        method: "POST"
      }),
      invalidatesTags: ["User"],
    }),
  })
})

export const {useGetCurrentUserQuery, useRegisterUserMutation, useLoginUserMutation, useLogoutUserMutation} = userApiSlice;