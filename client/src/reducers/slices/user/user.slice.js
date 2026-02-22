import { apiSlice } from "../../apiSlice";

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCurrentUser: builder.query({
      query: () => "users/me",
      providesTags: ["User"],
      keepUnusedDataFor: 60 * 15, // 15 minutes
    }),
    
  }),
});

export const { useGetCurrentUserQuery } = userApiSlice;
