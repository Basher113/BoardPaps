const prisma = require("../lib/prisma")


const getBoards = async (req, res)  =>  {
  try {
    const { projectId } = req.params;

    const boards = await prisma.board.findMany({
      where: { projectId },
      include: {
        columns: {
          orderBy: { position: 'asc' },
          include: {
            _count: {
              select: { issues: true }
            }
          }
        },
        _count: {
          select: { issues: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      data: boards
    });
    
  } catch (error) {
    console.error('Error fetching boards:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch boards'
    });
  }
}


const getBoard = async (req, res) => {
  try {
    const { boardId } = req.params;

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        project: {
          include: {
            owner: {
              select: { id: true, email: true, username: true }
            },
            members: {
              include: {
                user: {
                  select: { id: true, email: true, username: true }
                }
              }
            }
          }
        },
        columns: {
          orderBy: { position: 'asc' },
          include: {
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
        }
      }
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        error: 'Board not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: board
    });
  } catch (error) {
    console.error('Error fetching board:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch board'
    });
  }
}

/**
 * Create a new board
 * @route POST /api/projects/:projectId/boards
 */
const createBoard = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name } = req.body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Board name is required'
      });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Board name must be 100 characters or less'
      });
    }

    const board = await prisma.board.create({
      data: {
        name: name.trim(),
        projectId,
        columns: {
          create: [
            { name: 'To Do', position: 0 },
            { name: 'In Progress', position: 1 },
            { name: 'Done', position: 2 }
          ]
        }
      },
      include: {
        columns: {
          orderBy: { position: 'asc' }
        }
      }
    });

    return res.status(201).json({
      success: true,
      data: board
    });
  } catch (error) {
    console.error('Error creating board:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create board'
    });
  }
}

/**
 * Update a board
*/
const updateBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { name } = req.body;

    // Validation // Change THIS LATER TO ZOD VALIDATION!
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Board name is required'
      });
    }

    if (name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Board name must be 100 characters or less'
      });
    }

    // Check if board exists 
    const existingBoard = await prisma.board.findUnique({
      where: { id: boardId },
      });

    if (!existingBoard) {
      return res.status(404).json({
        success: false,
        error: 'Board not found'
      });
    }

    const board = await prisma.board.update({
      where: { id: boardId },
      data: { name: name.trim() },
      include: {
        columns: {
          orderBy: { position: 'asc' }
        }
      }
    });

    return res.status(200).json({
      success: true,
      data: board
    });

  } catch (error) {
    console.error('Error updating board:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update board'
    });
  }
}


const deleteBoard = async (req, res) => {
  try {
    const { boardId } = req.params;

    // Check if board exists
    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        error: 'Board not found'
      });
    }


    console.log(boardId, "BoardID");
    

    // CASCADE ISSUES AND COLUMN WHEN BOARD IS DELETED // CAN ADD "onDelete: Cascade" on prisma model relations
    await prisma.issue.deleteMany({
      where: {boardId}
    });

    await prisma.column.deleteMany({
      where: {boardId}
    })

    // Make sure you pass the middleware projectMemberRequireRole["OWNER"]
    await prisma.board.delete({
      where: { id: boardId }
    });

    return res.status(200).json({
      success: true,
      message: 'Board deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting board:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete board'
    });
  }
}


module.exports = {getBoards, getBoard, createBoard, updateBoard, deleteBoard};