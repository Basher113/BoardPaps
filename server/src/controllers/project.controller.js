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
      },
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
    });

    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

const updateProject = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, key } = req.body;
      const project = await prisma.project.update({
        where: { id },
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
      const { id } = req.params;
      await prisma.project.delete({
        where: { id }
      });
      res.json({message: "Success Delete"});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

module.exports = {createProject, getMyProjects, updateProject, deleteProject}