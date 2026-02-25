import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '@clerk/clerk-react';
import logger from '../utils/logger';

/**
 * Base API Slice Configuration
 * 
 * This is the base API slice that all other slices inject endpoints into.
 * Uses RTK Query for data fetching, caching, and state management.
 * 
 * Tag Types:
 * - User: User profile and authentication data
 * - Project: Project data (with granular IDs for targeted invalidation)
 * - ProjectMember: Individual project member data
 * - ProjectMembers: List of members for a project
 * - Column: Column data (usually embedded in project)
 * - Issue: Issue data (usually embedded in project columns)
 * - Dashboard: Dashboard statistics and aggregated data
 * - Invitation: User's personal invitations
 * - ProjectInvitation: Invitations for a specific project
 * - Settings: User settings
 * - AuditLog: Project activity logs
 */
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.PROD ? import.meta.env.VITE_SERVER_URL_PROD : import.meta.env.VITE_NGROK_SERVER_URL ? import.meta.env.VITE_NGROK_SERVER_URL : "http://localhost:8000",
  credentials: "include",
  prepareHeaders: async (headers) => {
    // Get the session token from Clerk and add it to the Authorization header
    // This is required for cross-domain requests (Vercel frontend -> Railway backend)
    try {
      const token = await getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    } catch (error) {
      // Token might not be available if user is not signed in
      // Using logger.warn which only logs in development
      logger.warn('Could not get Clerk token:', error);
    }
    return headers;
  },
})

export const apiSlice = createApi({
  baseQuery: baseQuery,
  tagTypes: [
    'User',
    'Project',
    'ProjectMembers',
    'Column',
    'Issue',
    'Dashboard',
    'Invitation',
    'ProjectInvitation',
    'Settings',
    'AuditLog',
  ],
  endpoints: () => ({}),
});
