import { apiSlice } from "../../apiSlice";

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCurrentUser: builder.query({
      query: () => "users/me",
      providesTags: ["User"],
    }),
  }),
});

export const { useGetCurrentUserQuery } = userApiSlice;
