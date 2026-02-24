const prisma = require("../lib/prisma");
const {logInfo, logError} = require("../lib/logger");

/**
 * Get all columns for a project
 * @route GET /api/projects/:projectId/columns
 */
const getColumns = async (req, res) => {
  try {
    const { projectId } = req.params;

    const columns = await prisma.column.findMany({
      where: { projectId },
      include: {
        _count: {
          select: { issues: true }
        }
      },
      orderBy: { position: 'asc' }
    });

    return res.status(200).json({
      success: true,
      data: columns
    });
  } catch (error) {
    logError('Error fetching columns:', { 
      error: error.message, 
      projectId: req.params.projectId 
    });
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch columns'
    });
  }
};

/**
 * Get a single column by ID
 * @route GET /api/projects/:projectId/columns/:columnId
 */
const getColumn = async (req, res) => {
  try {
    const { columnId, projectId } = req.params;

    const column = await prisma.column.findUnique({
      where: { id: columnId },
      include: {
        project: {
          select: { id: true, name: true }
        },
        issues: {
          orderBy: { position: 'asc' },
          include: {
            reporter: {
              select: { id: true, email: true, username: true }
            },
            assignee: {
              select: { id: true, email: true, username: true }
            }
          }
        }
      }
    });

    if (!column) {
      return res.status(404).json({
        success: false,
        error: 'Column not found'
      });
    }

    // Verify column belongs to the project
    if (column.projectId !== projectId) {
      return res.status(400).json({
        success: false,
        error: 'Column does not belong to this project'
      });
    }

    return res.status(200).json({
      success: true,
      data: column
    });
  } catch (error) {
    logError('Error fetching column:', { 
      error: error.message, 
      columnId: req.params.columnId 
    });
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch column'
    });
  }
};

/**
 * Create a new column
 * @route POST /api/projects/:projectId/columns
 */
const createColumn = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, position, wipLimit, color } = req.body;

    // Get the highest position if not provided
    let columnPosition = position;
    if (columnPosition === undefined) {
      const maxPosition = await prisma.column.findFirst({
        where: { projectId },
        orderBy: { position: 'desc' },
        select: { position: true }
      });
      columnPosition = (maxPosition?.position ?? -1) + 1;
    }

    const column = await prisma.column.create({
      data: {
        name: name.trim(),
        position: columnPosition,
        wipLimit: wipLimit ?? null,
        color: color ?? null,
        projectId
      },
      include: {
        _count: {
          select: { issues: true }
        }
      }
    });

    logInfo('Column created', { 
      columnId: column.id, 
      projectId,
      userId: req.user?.id 
    });

    return res.status(201).json({
      success: true,
      data: column
    });
  } catch (error) {
    logError('Error creating column:', { 
      error: error.message, 
      projectId: req.params.projectId 
    });
    return res.status(500).json({
      success: false,
      error: 'Failed to create column'
    });
  }
};

/**
 * Update a column
 * @route PUT /api/projects/:projectId/columns/:columnId
 */
const updateColumn = async (req, res) => {
  try {
    const { columnId, projectId } = req.params;
    const { name, position, wipLimit, color } = req.body;

    // Check if column exists and belongs to project
    const existingColumn = await prisma.column.findUnique({
      where: { id: columnId }
    });

    if (!existingColumn) {
      return res.status(404).json({
        success: false,
        error: 'Column not found'
      });
    }

    if (existingColumn.projectId !== projectId) {
      return res.status(400).json({
        success: false,
        error: 'Column does not belong to this project'
      });
    }

    // Build update data
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (position !== undefined) updateData.position = position;
    if (wipLimit !== undefined) updateData.wipLimit = wipLimit;
    if (color !== undefined) updateData.color = color;

    const column = await prisma.column.update({
      where: { id: columnId },
      data: updateData,
      include: {
        _count: {
          select: { issues: true }
        }
      }
    });

    logInfo('Column updated', { 
      columnId, 
      projectId,
      userId: req.user?.id,
      changes: Object.keys(updateData)
    });

    return res.status(200).json({
      success: true,
      data: column
    });
  } catch (error) {
    logError('Error updating column:', { 
      error: error.message, 
      columnId: req.params.columnId 
    });
    return res.status(500).json({
      success: false,
      error: 'Failed to update column'
    });
  }
};

/**
 * Reorder columns
 * @route PATCH /api/projects/:projectId/columns/reorder
 */
const reorderColumns = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { columnOrders } = req.body;

    // Verify all columns belong to the project
    const columnIds = columnOrders.map(c => c.id);
    const existingColumns = await prisma.column.findMany({
      where: { 
        id: { in: columnIds },
        projectId 
      }
    });

    if (existingColumns.length !== columnIds.length) {
      return res.status(400).json({
        success: false,
        error: 'Some columns do not exist or do not belong to this project'
      });
    }

    // Update positions in a transaction
    await prisma.$transaction(
      columnOrders.map(({ id, position }) =>
        prisma.column.update({
          where: { id },
          data: { position }
        })
      )
    );

    // Fetch updated columns
    const columns = await prisma.column.findMany({
      where: { projectId },
      include: {
        _count: {
          select: { issues: true }
        }
      },
      orderBy: { position: 'asc' }
    });

    logInfo('Columns reordered', { 
      projectId,
      userId: req.user?.id,
      columnCount: columnOrders.length
    });

    return res.status(200).json({
      success: true,
      data: columns
    });
  } catch (error) {
    logError('Error reordering columns:', { 
      error: error.message, 
      projectId: req.params.projectId 
    });
    return res.status(500).json({
      success: false,
      error: 'Failed to reorder columns'
    });
  }
};

/**
 * Delete a column
 * @route DELETE /api/projects/:projectId/columns/:columnId
 */
const deleteColumn = async (req, res) => {
  try {
    const { columnId, projectId } = req.params;

    // Check if column exists and belongs to project
    const column = await prisma.column.findUnique({
      where: { id: columnId },
      include: {
        _count: {
          select: { issues: true }
        }
      }
    });

    if (!column) {
      return res.status(404).json({
        success: false,
        error: 'Column not found'
      });
    }

    if (column.projectId !== projectId) {
      return res.status(400).json({
        success: false,
        error: 'Column does not belong to this project'
      });
    }

    // Check if column has issues
    if (column._count.issues > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete column with ${column._count.issues} issue(s). Move or delete the issues first.`
      });
    }

    // Delete the column
    await prisma.column.delete({
      where: { id: columnId }
    });

    // Reorder remaining columns to fill the gap
    const remainingColumns = await prisma.column.findMany({
      where: { projectId },
      orderBy: { position: 'asc' }
    });

    await prisma.$transaction(
      remainingColumns.map((col, index) =>
        prisma.column.update({
          where: { id: col.id },
          data: { position: index }
        })
      )
    );

    logInfo('Column deleted', { 
      columnId, 
      projectId,
      userId: req.user?.id
    });

    return res.status(200).json({
      success: true,
      message: 'Column deleted successfully'
    });
  } catch (error) {
    logError('Error deleting column:', { 
      error: error.message, 
      columnId: req.params.columnId 
    });
    return res.status(500).json({
      success: false,
      error: 'Failed to delete column'
    });
  }
};

/**
 * Sync all columns (bulk create/update/delete)
 * @route PUT /api/projects/:projectId/columns/sync
 */
const syncColumns = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { columns } = req.body;

    if (!Array.isArray(columns)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid columns payload'
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Get existing DB columns with issue counts
      const existingColumns = await tx.column.findMany({
        where: { projectId },
        include: {
          _count: {
            select: { issues: true }
          }
        }
      });

      const existingMap = new Map(existingColumns.map(c => [c.id, c]));

      // Collect incoming IDs (only valid UUIDs)
      const incomingIds = new Set(
        columns.filter(c => c.id && existingMap.has(c.id)).map(c => c.id)
      );

      // DELETE removed columns
      const toDelete = existingColumns.filter(c => !incomingIds.has(c.id));

      for (const col of toDelete) {
        // Check if column has issues before deleting
        if (col._count.issues > 0) {
          throw new Error(`Cannot delete column "${col.name}" - it contains ${col._count.issues} issue(s). Move or delete them first.`);
        }
        await tx.column.delete({
          where: { id: col.id }
        });
      }

      // Use negative positions temporarily to avoid unique constraint violations
      const tempPositionOffset = -1000000;

      // UPDATE existing columns with temporary positions first
      const existingUpdates = columns.filter(c => c.id && existingMap.has(c.id));

      for (let i = 0; i < existingUpdates.length; i++) {
        const col = existingUpdates[i];
        await tx.column.update({
          where: { id: col.id },
          data: {
            name: col.name?.trim() || existingMap.get(col.id).name,
            position: tempPositionOffset + i,
          },
        });
      }

      // CREATE new columns with temporary positions
      const newColumns = columns.filter(c => !c.id || !existingMap.has(c.id));
      const createdColumns = [];

      for (let i = 0; i < newColumns.length; i++) {
        const col = newColumns[i];
        const created = await tx.column.create({
          data: {
            name: col.name?.trim() || 'Untitled',
            position: tempPositionOffset - 1000 - i,
            projectId,
          },
        });
        createdColumns.push({ tempId: col.tempId, id: created.id });
      }

      // FINAL POSITION UPDATE - set correct positions for all columns
      for (const col of columns) {
        let id = col.id;

        // Find the real ID for newly created columns
        if (!id || !existingMap.has(id)) {
          const created = createdColumns.find(c => c.tempId === col.tempId);
          if (created) id = created.id;
        }

        if (!id) continue;

        await tx.column.update({
          where: { id },
          data: { position: col.position },
        });
      }

      // Return updated columns
      return await tx.column.findMany({
        where: { projectId },
        orderBy: { position: 'asc' },
        include: {
          _count: {
            select: { issues: true }
          }
        }
      });
    });

    logInfo('Columns synced', {
      projectId,
      userId: req.user?.id,
      columnCount: result.length
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logError('Error syncing columns:', {
      error: error.message,
      projectId: req.params.projectId
    });

    // Check for specific error messages
    if (error.message.includes('Cannot delete column')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to sync columns'
    });
  }
};

module.exports = {
  getColumns,
  getColumn,
  createColumn,
  updateColumn,
  reorderColumns,
  deleteColumn,
  syncColumns
};
