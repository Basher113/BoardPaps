const { error } = require("node:console");
const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");
const { cloudinary } = require("../config/cloudinary.config");

// ==================== PROFILE ====================

// GET /api/users/me/profile
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        provider: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    
    return res.json(user);
  } catch (error) {
    console.log("Get Profile Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /api/users/me/profile
const updateProfile = async (req, res) => {
  const { username, email } = req.body;
  
  try {
    // Check username uniqueness (if changed)
    if (username) {
      const existingUsername = await prisma.user.findFirst({
        where: { username, NOT: { id: req.user.id } }
      });
      if (existingUsername) {
        return res.status(400).json({ errors: { username: ["Username already taken"] } });
      }
    }
    
    // Check email uniqueness (if changed)
    if (email) {
      const existingEmail = await prisma.user.findFirst({
        where: { email, NOT: { id: req.user.id } }
      });
      if (existingEmail) {
        return res.status(400).json({ errors: { email: ["Email already in use"] } });
      }
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(username && { username }),
        ...(email && { email }),
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        provider: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    
    return res.json(updatedUser);
  } catch (error) {
    console.log("Update Profile Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ==================== AVATAR ====================

// PUT /api/users/me/avatar
const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Delete old avatar from Cloudinary if exists
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { avatar: true }
    });

    if (currentUser.avatar) {
      try {
        const publicId = currentUser.avatar.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`avatars/${publicId}`);
      } catch (err) {
        console.log("Error deleting old avatar:", err);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar: req.file.path },
      select: { id: true, avatar: true, username: true, email: true }
    });

    return res.json(updatedUser);
  } catch (error) {
    console.log("Update Avatar Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /api/users/me/avatar
const deleteAvatar = async (req, res) => {
  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { avatar: true }
    });

    if (currentUser.avatar) {
      try {
        const publicId = currentUser.avatar.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`avatars/${publicId}`);
      } catch (err) {
        console.log("Error deleting avatar from Cloudinary:", err);
      }
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar: null }
    });

    return res.json({ message: "Avatar deleted successfully" });
  } catch (error) {
    console.log("Delete Avatar Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ==================== PREFERENCES ====================

// GET /api/users/me/preferences
const getPreferences = async (req, res) => {
  try {
    let prefs = await prisma.userPreferences.findUnique({
      where: { userId: req.user.id }
    });
    
    if (!prefs) {
      // Create default preferences if they don't exist
      prefs = await prisma.userPreferences.create({
        data: { userId: req.user.id }
      });
    }
    
    return res.json(prefs);
  } catch (error) {
    console.log("Get Preferences Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /api/users/me/preferences
const updatePreferences = async (req, res) => {
  const { 
    defaultLandingPage, 
    defaultIssueView,
    notifyIssueAssigned,
    notifyStatusChanged,
    notifyMentioned 
  } = req.body;
  
  try {
    const prefs = await prisma.userPreferences.upsert({
      where: { userId: req.user.id },
      update: {
        ...(defaultLandingPage && { defaultLandingPage }),
        ...(defaultIssueView && { defaultIssueView }),
        ...(notifyIssueAssigned !== undefined && { notifyIssueAssigned }),
        ...(notifyStatusChanged !== undefined && { notifyStatusChanged }),
        ...(notifyMentioned !== undefined && { notifyMentioned }),
      },
      create: {
        userId: req.user.id,
        defaultLandingPage: defaultLandingPage || "dashboard",
        defaultIssueView: defaultIssueView || "compact",
        notifyIssueAssigned: notifyIssueAssigned ?? true,
        notifyStatusChanged: notifyStatusChanged ?? true,
        notifyMentioned: notifyMentioned ?? true,
      }
    });
    
    return res.json(prefs);
  } catch (error) {
    console.log("Update Preferences Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ==================== SECURITY ====================

// PUT /api/users/me/password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  console.log(req.body);
  console.log("RUNNING!")
  try {
    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    
    // Skip password check for OAuth users
    if (user.provider !== "local") {
      return res.status(400).json({ 
        message: "Cannot change password for OAuth accounts" 
      });
    }
    
    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error:"Current password is incorrect" });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });
    
    return res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.log("Change Password Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/users/me/sessions
const getSessions = async (req, res) => {
  try {
    const sessions = await prisma.refreshToken.findMany({
      where: { 
        userId: req.user.id,
        revoked: false,
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to 50 most recent sessions
    });
    
    return res.json({ sessions });
  } catch (error) {
    console.log("Get Sessions Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /api/users/me/sessions/:sessionId
const revokeSession = async (req, res) => {
  const { sessionId } = req.params;
  
  try {
    await prisma.refreshToken.update({
      where: { 
        id: sessionId,
        userId: req.user.id // Ensure user can only revoke their own sessions
      },
      data: { revoked: true }
    });
    
    return res.json({ message: "Session revoked successfully" });
  } catch (error) {
    console.log("Revoke Session Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /api/users/me/sessions
const revokeAllSessions = async (req, res) => {
  try {
    await prisma.refreshToken.updateMany({
      where: { userId: req.user.id },
      data: { revoked: true }
    });
    
    // Also clear the current refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
    });
    
    return res.json({ message: "All sessions revoked successfully" });
  } catch (error) {
    console.log("Revoke All Sessions Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /api/users/me
const deleteAccount = async (req, res) => {
  const { password } = req.body;
  const userId = req.user.id;
  
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }
  
  try {
    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    // Skip password check for OAuth users
    if (user.provider !== "local") {
      return res.status(400).json({ message: "Cannot delete password for OAuth accounts" });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    
    // Use a transaction to delete all related records
    await prisma.$transaction([
      // Delete all refresh tokens
      prisma.refreshToken.deleteMany({
        where: { userId }
      }),

      // Delete invitations sent by this user
      prisma.invitation.deleteMany({
        where: { invitedById: userId }
      }),
      // Delete issues reported by this user (will cascade through comments if any)
      prisma.issue.deleteMany({
        where: { reporterId: userId }
      }),
      // Delete issues assigned to this user (set assignee to null)
      prisma.issue.updateMany({
        where: { assigneeId: userId },
        data: { assigneeId: null }
      }),
      // Delete project memberships
      prisma.projectMember.deleteMany({
        where: { userId }
      }),
      // Delete projects owned by this user (will cascade to columns, issues, invitations, members)
      prisma.project.deleteMany({
        where: { ownerId: userId }
      }),
      
      // Finally, delete the user
      prisma.user.delete({
        where: { id: userId }
      })
    ]);
    
    // Clear cookies
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
    });
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
    });
    
    return res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.log("Delete Account Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateAvatar,
  deleteAvatar,
  getPreferences,
  updatePreferences,
  changePassword,
  getSessions,
  revokeSession,
  revokeAllSessions,
  deleteAccount
};
