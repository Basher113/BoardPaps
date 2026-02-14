const prisma = require("../lib/prisma");
const { clerkClient } = require("@clerk/express");

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

// Sync user profile from Clerk (optional, for manual sync)
const syncUserController = async (req, res) => {
  try {
    const auth = typeof req.auth === 'function' ? req.auth() : req.auth;
    const { userId } = auth;
    const clerkUser = await clerkClient.users.getUser(userId);
    
    const user = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        email: clerkUser.emailAddresses[0]?.emailAddress,
        username: clerkUser.username || clerkUser.firstName || "User",
        avatar: clerkUser.imageUrl,
      },
    });
    
    return res.json(user);
  } catch (error) {
    console.log("Error syncing user:", error);
    return res.status(500).json({ message: "Internal Service Error" });
  }
};

module.exports = { getCurrentUserDataController, syncUserController };
