const prisma = require("../lib/prisma");
const { cloudinary } = require("../config/cloudinary.config");
const { clerkClient } = require("@clerk/express");

// ==================== CURRENT USER DATA ====================

const getCurrentUserDataController = async (req, res) => {
  try {
    const user = req.user;
    
    return res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      clerkId: user.clerkId,
    });
  } catch (error) {
    console.log("Error getting users:", error);
    return res.status(500).json({ message: "Internal Service Error" });
  }
};

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
        clerkId: true,
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
  const clerkId = req.user.clerkId;
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
    
    // Check email uniqueness (if changed) - Note: email cannot be changed in Clerk
    if (email && email !== req.user.email) {
      return res.status(400).json({ errors: { email: ["Email cannot be changed."] } });
    }
    
    // Update in Clerk first
    if (username) {
      await clerkClient.users.updateUser(clerkId, {
        username,
      });
    }
    
    // Update in database
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(username && { username }),
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
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
  const clerkId = req.user.clerkId;
  
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

    // Update avatar in Clerk
    // Clerk requires a publicly accessible URL for avatar
    await clerkClient.users.updateUser(clerkId, {
      imageUrl: req.file.path,
    });

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
  const clerkId = req.user.clerkId;
  
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

    // Delete avatar in Clerk
    await clerkClient.users.updateUser(clerkId, {
      imageUrl: null,
    });

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

// ==================== ACCOUNT ====================

// DELETE /api/users/me
const deleteAccount = async (req, res) => {
  const userId = req.user.id;
  const clerkId = req.user.clerkId;
  
  try {
    // Delete user from Clerk first
    try {
      await clerkClient.users.deleteUser(clerkId);
    } catch (clerkError) {
      console.log("Clerk Delete User Error:", clerkError);
      // Continue with local deletion even if Clerk fails
      // The webhook might have already handled this
    }
    
    // Use a transaction to delete all related records
    await prisma.$transaction([
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
    
    return res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.log("Delete Account Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getCurrentUserDataController,
  getProfile,
  updateProfile,
  updateAvatar,
  deleteAvatar,
  deleteAccount
};
