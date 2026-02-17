const prisma = require("../lib/prisma");
const logger = require("../lib/logger");

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
    logger.error('Error fetching columns:', { 
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
    logger.error('Error fetching column:', { 
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

    logger.info('Column created', { 
      columnId: column.id, 
      projectId,
      userId: req.user?.id 
    });

    return res.status(201).json({
      success: true,
      data: column
    });
  } catch (error) {
    logger.error('Error creating column:', { 
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

    logger.info('Column updated', { 
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
    logger.error('Error updating column:', { 
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

    logger.info('Columns reordered', { 
      projectId,
      userId: req.user?.id,
      columnCount: columnOrders.length
    });

    return res.status(200).json({
      success: true,
      data: columns
    });
  } catch (error) {
    logger.error('Error reordering columns:', { 
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

    logger.info('Column deleted', { 
      columnId, 
      projectId,
      userId: req.user?.id
    });

    return res.status(200).json({
      success: true,
      message: 'Column deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting column:', { 
      error: error.message, 
      columnId: req.params.columnId 
    });
    return res.status(500).json({
      success: false,
      error: 'Failed to delete column'
    });
  }
};

module.exports = {
  getColumns,
  getColumn,
  createColumn,
  updateColumn,
  reorderColumns,
  deleteColumn
};
