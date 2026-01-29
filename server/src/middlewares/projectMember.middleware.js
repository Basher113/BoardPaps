const prisma = require("../lib/prisma");

const requireProjectMember = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;

    if (!projectId) {
      return res.status(400).json({
        message: "Project ID is required",
      });
    }

    // Verify a project exist
    const project = await prisma.project.findFirst({
      where: {id: projectId,}
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or access denied'
      });
    }

    const member = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    if (!member) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    // 💡 Attach for later use (VERY useful)
    req.projectMember = member;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Project membership check failed",
    });
  }
};

const requireProjectRole = (roles) => {
  // It restricts certain actions to specific project roles (OWNER, ADMIN, etc).
  return (req, res, next) => {
    if (!roles.includes(req.projectMember.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    next();
  };
};

module.exports = {requireProjectMember, requireProjectRole};