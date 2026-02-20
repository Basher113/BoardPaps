import { apiSlice } from "../../apiSlice";

/**
 * Dashboard API Slice
 * Contains dashboard-related endpoints
 * 
 * Caching Strategy:
 * - Dashboard shows aggregated data across projects
 * - Moderate cache retention (2 minutes) - data should be fresh but not constantly refetched
 * - Refetch on mount after 30 seconds to ensure data isn't stale
 * - Consider polling for real-time updates in future
 */
export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get dashboard issues (aggregated across all user's projects)
     * Supports filtering by project, status, assignee, etc.
     */
    getDashboardIssues: builder.query({
      query: (params) => ({
        url: "dashboard/issues",
        method: "GET",
        params
      }),
      providesTags: (result, error, params) => [
        { type: "Dashboard", id: "ISSUES" },
        // Create specific tags based on filter params for targeted invalidation
        { type: "Dashboard", id: params?.project || "ALL" },
      ],
      transformResponse: (response) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.error || "Failed to fetch dashboard issues");
      },
      keepUnusedDataFor: 120, // 2 minutes - dashboard data doesn't need to be real-time
      refetchOnMountOrArgChange: 30, // Refetch if mounted after 30 seconds
    }),

    /**
     * Get dashboard statistics (issue counts by status, project, etc.)
     * Useful for summary cards and charts
     */
    getDashboardStats: builder.query({
      query: () => ({
        url: "dashboard/stats",
        method: "GET",
      }),
      providesTags: [{ type: "Dashboard", id: "STATS" }],
      keepUnusedDataFor: 120, // 2 minutes
      refetchOnMountOrArgChange: 30,
    }),

    /**
     * Get recent activity across all projects
     * Used for activity feed on dashboard
     */
    getRecentActivity: builder.query({
      query: (limit = 10) => ({
        url: "dashboard/activity",
        method: "GET",
        params: { limit },
      }),
      providesTags: [{ type: "Dashboard", id: "ACTIVITY" }],
      keepUnusedDataFor: 60, // 1 minute - activity should be relatively fresh
      refetchOnMountOrArgChange: true, // Always refetch activity on mount
    }),
  }),
});

export const { 
  useGetDashboardIssuesQuery,
  useGetDashboardStatsQuery,
  useGetRecentActivityQuery,
} = dashboardApiSlice;
