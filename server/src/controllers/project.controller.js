const prisma = require("../lib/prisma");

const createProject = async (req, res) => {
  try {
    const { name, key } = req.body;
    const ownerId = req.user.id;

    const project = await prisma.project.create({
      data: {
        name,
        key,
        ownerId,
        members: {
          create: { userId: ownerId, role: "OWNER" },
        },
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

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create project" });
  }
};

const getMyProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        _count: {
          select: {
            columns: true
          }
        }
      },
      orderBy: { lastVisitedAt: 'desc' },
    });

    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

const getProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: {
          select: { id: true, email: true, username: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, email: true, username: true, avatar: true }
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
                  select: { id: true, email: true, username: true, avatar: true }
                },
                assignee: {
                  select: { id: true, email: true, username: true, avatar: true }
                }
              }
            },
            _count: {
              select: { issues: true }
            }
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch project'
    });
  }
};

const updateProject = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { name, key } = req.body;

      if (!name || !key) {
        return res.status(400).json({ message: "Name and key are required" });
      }

      const project = await prisma.project.update({
        where: { id: projectId },
        data: { name, key },
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        }
      });
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const deleteProject = async (req, res) => {
    try {
      const { projectId } = req.params;
      await prisma.project.delete({
        where: { id: projectId }
      });
      res.json({message: "Success Delete"});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const visitProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    await prisma.project.update({
      where: { id: projectId },
      data: { lastVisitedAt: new Date() }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update last visited" });
  }
}

module.exports = {createProject, getMyProjects, getProject, updateProject, deleteProject, visitProject}