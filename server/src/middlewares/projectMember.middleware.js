const requireProjectMember = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projectId =
      req.params.projectId || req.body.projectId;

    if (!projectId) {
      return res.status(400).json({
        message: "Project ID is required",
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
        message: "Forbidden",
      });
    }

    // 💡 Attach for later use (VERY useful)
    req.projectMember = member;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Project membership check failed",
    });
  }
};

const requireProjectRole = (roles) => {
  // It restricts certain actions to specific project roles (OWNER, ADMIN, etc).
  return (req, res, next) => {
    if (!roles.includes(req.projectMember.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

module.exports = {requireProjectMember, requireProjectRole};