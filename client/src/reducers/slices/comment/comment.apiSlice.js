import { apiSlice } from "../../apiSlice";

/**
 * Comment API Slice
 * Contains all comment-related endpoints for issue comments
 * 
 * API Endpoints:
 * - GET /api/projects/:projectId/issues/:issueId/comments - Get all comments
 * - POST /api/projects/:projectId/issues/:issueId/comments - Create comment
 * - DELETE /api/projects/:projectId/issues/:issueId/comments/:commentId - Delete comment
 * 
 * Caching Strategy:
 * - Comments are cached per issue
 * - Uses optimistic updates for create/delete operations
 * - Provides immediate UI feedback with rollback on error
 */
export const commentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get all comments for an issue with pagination
     * Uses cache with 1-minute keepUnusedData
     */
    getComments: builder.query({
      query: ({ projectId, issueId, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'asc' }) => ({
        url: `projects/${projectId}/issues/${issueId}/comments`,
        params: { page, limit, sortBy, sortOrder },
      }),
      // Only keep data in cache for 1 minute since comments can change frequently
      keepUnusedDataFor: 60,
      // Provide tags for cache invalidation
      providesTags: (result, error, { issueId }) => [
        { type: 'Comment', id: issueId },
        { type: 'Comment', id: 'LIST' },
      ],
    }),

    /**
     * Create a new comment on an issue
     * Uses optimistic update for immediate UI feedback
     */
    createComment: builder.mutation({
      query: ({ projectId, issueId, content }) => ({
        url: `projects/${projectId}/issues/${issueId}/comments`,
        method: 'POST',
        body: { content },
      }),
      async onQueryStarted({ projectId, issueId, content }, { dispatch, queryFulfilled }) {
        // Create temporary comment for optimistic update
        const tempId = `temp-${Date.now()}`;
        const tempComment = {
          id: tempId,
          content,
          createdAt: new Date().toISOString(),
          author: {
            id: 'current-user',
            username: 'You',
          },
          isOptimistic: true,
        };

        // Optimistic update - add comment immediately to cache
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getComments', { projectId, issueId }, (cached) => {
            if (!cached?.data) return;
            // Add temp comment to the end of the list
            cached.data.push(tempComment);
            // Update pagination total
            if (cached.pagination) {
              cached.pagination.total += 1;
            }
          })
        );

        try {
          const { data: response } = await queryFulfilled;
          
          // Replace temp comment with server response
          dispatch(
            apiSlice.util.updateQueryData('getComments', { projectId, issueId }, (cached) => {
              if (!cached?.data) return;
              const tempIndex = cached.data.findIndex(c => c.id === tempId);
              if (tempIndex !== -1) {
                // Replace temp comment with server response
                cached.data[tempIndex] = response.data || response;
              }
            })
          );
        } catch {
          // Rollback on error
          patchResult.undo();
        }
      },
      // Invalidate comments list to ensure fresh data
      invalidatesTags: (result, error, { issueId }) => [
        { type: 'Comment', id: issueId },
      ],
    }),

    /**
     * Delete a comment
     * Uses optimistic update for immediate UI feedback
     */
    deleteComment: builder.mutation({
      query: ({ projectId, issueId, commentId }) => ({
        url: `projects/${projectId}/issues/${issueId}/comments/${commentId}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ projectId, issueId, commentId }, { dispatch, queryFulfilled }) {
        // Optimistic update - remove comment immediately from cache
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getComments', { projectId, issueId }, (cached) => {
            if (!cached?.data) return;
            const index = cached.data.findIndex(c => c.id === commentId);
            if (index !== -1) {
              cached.data.splice(index, 1);
              // Update pagination total
              if (cached.pagination) {
                cached.pagination.total -= 1;
              }
            }
          })
        );

        try {
          await queryFulfilled;
          // Success - cache is already updated
        } catch {
          // Rollback on error
          patchResult.undo();
        }
      },
      // Invalidate comments list to ensure fresh data
      invalidatesTags: (result, error, { issueId }) => [
        { type: 'Comment', id: issueId },
      ],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} = commentApiSlice;
