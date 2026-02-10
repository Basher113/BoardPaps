const prisma = require("../lib/prisma");

/**
 * Get all issues assigned to the logged-in user across all projects
 * Also returns status counts for quick overview
 * @route GET /api/dashboard/issues
 */
const getUserIssues = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, projectId, limit = 50, offset = 0 } = req.query;

    // Build filter for issues
    const where = {
      assigneeId: userId,
      project: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } }
        ]
      }
    };

    // Filter by specific column (status)
    if (status) {
      where.columnId = status;
    }

    // Filter by specific project
    if (projectId) {
      where.projectId = projectId;
    }

    // Fetch issues with pagination
    const issues = await prisma.issue.findMany({
      where,
      include: {
        project: {
          select: { id: true, name: true, key: true }
        },
        column: {
          select: { id: true, name: true, position: true }
        },
        assignee: {
          select: { id: true, email: true, username: true }
        },
        reporter: {
          select: { id: true, email: true, username: true }
        }
      },
      orderBy: [
        { column: { position: 'asc' } },
        { updatedAt: 'desc' }
      ],
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    // Get total count for pagination
    const totalCount = await prisma.issue.count({ where });

    // Get status counts grouped by column
    const statusCounts = await prisma.issue.groupBy({
      by: ['columnId'],
      where: {
        assigneeId: userId,
        project: {
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } }
          ]
        }
      },
      _count: true
    });

    // Get all columns with their positions for proper ordering
    const columns = await prisma.column.findMany({
      where: {
        project: {
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } }
          ]
        }
      },
      select: { id: true, name: true, position: true, projectId: true },
      orderBy: { position: 'asc' }
    });

    // Format status counts with column names
    const formattedStatusCounts = statusCounts.map(count => {
      const column = columns.find(c => c.id === count.columnId);
      return {
        columnId: count.columnId,
        columnName: column?.name || 'Unknown',
        count: count._count
      };
    });

    // Sort by column position
    formattedStatusCounts.sort((a, b) => {
      const colA = columns.find(c => c.id === a.columnId);
      const colB = columns.find(c => c.id === b.columnId);
      return (colA?.position || 0) - (colB?.position || 0);
    });

    return res.status(200).json({
      success: true,
      data: {
        issues,
        statusCounts: formattedStatusCounts,
        total: totalCount,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard issues:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard issues'
    });
  }
};

module.exports = {
  getUserIssues
};
