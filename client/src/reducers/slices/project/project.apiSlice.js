import { apiSlice } from "../../apiSlice";

export const projectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyProjects: builder.query({
      query: () => "projects",
      providesTags: ["Project"],
    }),
    getProjectBoards: builder.query({
      query: (projectId) => `projects/${projectId}/boards`,
      providesTags: (result, error, projectId) => [
        { type: "Board", id: projectId },
      ],
    }),
    getRecentBoard: builder.query({
      query: () => "boards/recent",
      providesTags: (result) => 
        result ? [{ type: "Board", id: "RECENT" }] : ["Board"],
    }),
    visitProject: builder.mutation({
      query: (projectId) => ({
        url: `projects/${projectId}/visit`,
        method: "PATCH",
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useGetMyProjectsQuery,
  useGetProjectBoardsQuery,
  useGetRecentBoardQuery,
  useVisitProjectMutation,
} = projectApiSlice;
