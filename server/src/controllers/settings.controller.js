const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");
const { cloudinary } = require("../config/cloudinary.config");
const { clerkClient } = require("@clerk/express");

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


// DELETE /api/users/me
const deleteAccount = async (req, res) => {
  const { password } = req.body;
  const userId = req.user.id;
  const clerkId = req.user.clerkId;
  
  try {
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    // Check if user has a password set (not OAuth-only)
    // Users with password must verify it before deleting
    if (user.password) {
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }
      
      // Verify password against locally stored hash
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Incorrect password" });
      }
    }
    
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
      // Delete issues reported by this user 
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
  getProfile,
  updateProfile,
  updateAvatar,
  deleteAvatar,

  deleteAccount
};
