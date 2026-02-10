import { apiSlice } from "../../apiSlice";

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardIssues: builder.query({
      query: (params) => ({
        url: "dashboard/issues",
        method: "GET",
        params
      }),
      providesTags: ["DashboardIssues"],
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to fetch dashboard issues");
      }
    }),
  }),
});

export const { useGetDashboardIssuesQuery } = dashboardApiSlice;
