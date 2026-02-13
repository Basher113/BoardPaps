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

    // Get status counts grouped by column name (combined across all projects)
    const issuesWithColumns = await prisma.issue.findMany({
      where: {
        assigneeId: userId,
        project: {
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } }
          ]
        }
      },
      include: {
        column: {
          select: { id: true, name: true, position: true }
        }
      }
    });

    // Group by column NAME and combine counts across projects
    // Normalize the key by trimming and converting to lowercase to handle whitespace differences
    const statusCountsMap = {};
    issuesWithColumns.forEach(issue => {
      const name = issue.column.name;
      const normalizedKey = name?.trim().toLowerCase() || '';
      
      if (!statusCountsMap[normalizedKey]) {
        statusCountsMap[normalizedKey] = {
          columnName: name?.trim() || 'Unknown',
          count: 0,
          position: issue.column.position
        };
      }
      statusCountsMap[normalizedKey].count++;
    });

    const formattedStatusCounts = Object.values(statusCountsMap);

    // Sort by column position (using first occurrence for ordering)
    formattedStatusCounts.sort((a, b) => a.position - b.position);

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
