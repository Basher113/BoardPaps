const prisma = require("../lib/prisma");

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
    console.error('Error fetching columns:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch columns'
    });
  }
};

const getColumn = async (req, res) => {
  try {
    const { columnId } = req.params;

    const column = await prisma.column.findUnique({
      where: { id: columnId },
      include: {
        project: true,
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

    return res.status(200).json({
      success: true,
      data: column
    });
  } catch (error) {
    console.error('Error fetching column:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch column'
    });
  }
};

module.exports = {getColumns, getColumn};