const prisma = require("../lib/prisma");
const { clerkMiddleware } = require("@clerk/express");

// Custom middleware that syncs Clerk user to database and populates req.user
const withUser = async (req, res, next) => {
  // Let clerkMiddleware run first to populate req.auth
  // This is handled by app.use(clerkMiddleware()) before this middleware
  
  try {
    // Get Clerk auth - clerkMiddleware populates req.auth as a function in newer versions
    let auth;
    if (typeof req.auth === 'function') {
      auth = req.auth();
    } else if (req.auth && typeof req.auth === 'object') {
      auth = req.auth;
    } else {
      return next();
    }
    
    // If still no userId, skip
    if (!auth || !auth.userId) {
      return next();
    }

    const clerkId = auth.userId;

    // Find or create user in database (lazy sync)
    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    // If user doesn't exist in database, create them
    if (!user) {
      const { clerkClient } = require("@clerk/express");
      const clerkUser = await clerkClient.users.getUser(clerkId);
      user = await prisma.user.create({
        data: {
          clerkId,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          username: clerkUser.username || clerkUser.displayName,
          avatar: clerkUser.imageUrl,
        },
      });
    }

    // Populate req.user with database user
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in withUser middleware:", error);
    // Continue even if there's an error - let the controller handle auth
    next();
  }
};

module.exports = { clerkMiddleware, withUser };
