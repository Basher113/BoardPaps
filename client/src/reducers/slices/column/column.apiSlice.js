import { apiSlice } from "../../apiSlice";

/**
 * Column API Slice
 * Contains all column-related endpoints
 * 
 * Caching Strategy:
 * - Columns are part of project data, mutations invalidate project cache
 * - Uses optimistic updates for immediate UI feedback
 * - Cache retention follows project settings (5 minutes)
 */
export const columnApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Create a new column in a project
     * Uses optimistic update for immediate UI feedback
     */
    createColumn: builder.mutation({
      query: ({ projectId, name }) => ({
        url: `projects/${projectId}/columns`,
        method: "POST",
        body: { name },
      }),
      async onQueryStarted({ projectId, name }, { dispatch, queryFulfilled }) {
        const tempId = `temp-${Date.now()}`;
        
        // Optimistic update - add column immediately
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getProject", projectId, (project) => {
            if (!project?.data?.columns) return;
            
            const newColumn = {
              id: tempId,
              name,
              position: project.data.columns.length,
              issues: [],
              isOptimistic: true,
            };
            
            project.data.columns.push(newColumn);
          })
        );
        
        try {
          const { data: response } = await queryFulfilled;
          
          // Replace temp column with server response
          dispatch(
            apiSlice.util.updateQueryData("getProject", projectId, (project) => {
              if (!project?.data?.columns || !response?.data) return;
              
              const tempIndex = project.data.columns.findIndex(c => c.id === tempId);
              if (tempIndex !== -1) {
                project.data.columns[tempIndex] = response.data;
              }
            })
          );
        } catch {
          patchResult.undo();
        }
      },
      // No invalidatesTags - cache updated optimistically
    }),

    /**
     * Update a column's name
     * Uses optimistic update for immediate UI feedback
     */
    updateColumn: builder.mutation({
      query: ({ projectId, columnId, name }) => ({
        url: `projects/${projectId}/columns/${columnId}`,
        method: "PUT",
        body: { name },
      }),
      async onQueryStarted({ projectId, columnId, name }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getProject", projectId, (project) => {
            if (!project?.data?.columns) return;
            
            const column = project.data.columns.find(c => c.id === columnId);
            if (column) {
              column.name = name;
            }
          })
        );
        
        try {
          await queryFulfilled;
          // Success - cache already updated
        } catch {
          patchResult.undo();
        }
      },
      // No invalidatesTags - cache updated optimistically
    }),

    /**
     * Delete a column from a project
     * Uses optimistic update for immediate UI feedback
     */
    deleteColumn: builder.mutation({
      query: ({ projectId, columnId }) => ({
        url: `projects/${projectId}/columns/${columnId}`,
        method: "DELETE",
      }),
      async onQueryStarted({ projectId, columnId }, { dispatch, queryFulfilled }) {
        // Optimistic update - remove column immediately
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getProject", projectId, (project) => {
            if (!project?.data?.columns) return;
            
            const index = project.data.columns.findIndex(c => c.id === columnId);
            if (index !== -1) {
              project.data.columns.splice(index, 1);
            }
          })
        );
        
        try {
          await queryFulfilled;
          // Success - cache already updated
        } catch {
          patchResult.undo();
        }
      },
      // No invalidatesTags - cache updated optimistically
    }),

    /**
     * Reorder columns within a project
     * Uses optimistic update for smooth drag-and-drop experience
     */
    reorderColumns: builder.mutation({
      query: ({ projectId, columnOrder }) => ({
        url: `projects/${projectId}/columns/reorder`,
        method: "PATCH",
        body: { 
          columnOrders: columnOrder.map((id, index) => ({
            id,
            position: index
          }))
        },
      }),
      async onQueryStarted({ projectId, columnOrder }, { dispatch, queryFulfilled }) {
        // Optimistic update - reorder columns immediately
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getProject", projectId, (project) => {
            if (!project?.data?.columns) return;
            
            // Reorder columns based on new order
            const columnsMap = new Map(
              project.data.columns.map(c => [c.id, c])
            );
            
            project.data.columns = columnOrder
              .map(id => columnsMap.get(id))
              .filter(Boolean);
          })
        );
        
        try {
          await queryFulfilled;
          // Success - cache already updated
        } catch {
          patchResult.undo();
        }
      },
      // No invalidatesTags - cache updated optimistically
    }),

    /**
     * Sync all columns (bulk create/update/delete)
     * Used for workflow settings where multiple changes are made at once
     */
    syncColumns: builder.mutation({
      query: ({ projectId, columns }) => ({
        url: `projects/${projectId}/columns/sync`,
        method: "PUT",
        body: { columns },
      }),
      async onQueryStarted({ projectId, columns }, { dispatch, queryFulfilled }) {
        // Optimistic update for both getProject and getProjectSettings caches
        const patchResults = [];
        
        // Update getProject cache (used by board view)
        patchResults.push(
          dispatch(
            apiSlice.util.updateQueryData("getProject", projectId, (project) => {
              if (!project?.data) return;
              
              project.data.columns = columns.map((col, index) => ({
                ...col,
                id: col.id || `temp-${Date.now()}-${index}`,
                position: index,
                _count: col._count || { issues: 0 },
              }));
            })
          )
        );
        
        // Update getProjectSettings cache (used by settings page)
        patchResults.push(
          dispatch(
            apiSlice.util.updateQueryData("getProjectSettings", projectId, (project) => {
              if (!project?.data) return;
              
              project.data.columns = columns.map((col, index) => ({
                ...col,
                id: col.id || `temp-${Date.now()}-${index}`,
                position: index,
                _count: col._count || { issues: 0 },
              }));
            })
          )
        );
        
        try {
          const { data: response } = await queryFulfilled;
          
          // Replace with server response in both caches
          if (response?.data) {
            dispatch(
              apiSlice.util.updateQueryData("getProject", projectId, (project) => {
                if (!project?.data) return;
                project.data.columns = response.data;
              })
            );
            dispatch(
              apiSlice.util.updateQueryData("getProjectSettings", projectId, (project) => {
                if (!project?.data) return;
                project.data.columns = response.data;
              })
            );
          }
        } catch {
          // Undo all patches on error
          patchResults.forEach((patch) => patch.undo());
        }
      },
      // No invalidatesTags - cache updated optimistically
    }),
  }),
});

export const {
  useCreateColumnMutation,
  useUpdateColumnMutation,
  useDeleteColumnMutation,
  useReorderColumnsMutation,
  useSyncColumnsMutation,
} = columnApiSlice;
