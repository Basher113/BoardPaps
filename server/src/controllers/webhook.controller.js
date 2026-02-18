const prisma = require("../lib/prisma");
const { verifyWebhook } = require("@clerk/express");
const { logInfo, logWarn, logError } = require("../lib/logger");

// Handle user.created event
const handleUserCreated = async (data) => {
  const { id: clerkId, email_addresses, username, image_url, first_name } = data;

  const user = await prisma.user.create({
    data: {
      clerkId,
      email: email_addresses[0]?.emailAddress,
      username: username || first_name || "User",
      avatar: image_url,
    },
  });

  logInfo("User created via webhook", { userId: user.id });
  return user;
};

// Handle user.updated event
const handleUserUpdated = async (data) => {
  const { id: clerkId, email_addresses, username, image_url, first_name } = data;

  const user = await prisma.user.update({
    where: { clerkId },
    data: {
      email: email_addresses[0]?.emailAddress,
      username: username || first_name || "User",
      avatar: image_url,
    },
  });

  logInfo("User updated via webhook", { userId: user.id });
  return user;
};

// Handle user.deleted event
const handleUserDeleted = async (data) => {
  const { id: clerkId } = data;

  // Check if user exists first
  const existingUser = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!existingUser) {
    logWarn("User not found for deletion", { clerkId });
    return null;
  }

  // Hard delete - remove user from database
  // Note: This will cascade delete related data due to Prisma relations
  await prisma.user.delete({
    where: { clerkId },
  });

  logInfo("User deleted via webhook", { clerkId });
  return { clerkId, deleted: true };
};

// Main webhook handler
const webhookController = async (req, res) => {
  try {
    // Verify webhook using Clerk's built-in verifyWebhook
    const webhookPayload = verifyWebhook(req.headers, req.body);

    const { type, data } = webhookPayload;

    switch (type) {
      case "user.created":
        await handleUserCreated(data);
        break;

      case "user.updated":
        await handleUserUpdated(data);
        break;

      case "user.deleted":
        await handleUserDeleted(data);
        break;

      default:
        logWarn("Unhandled webhook event", { type });
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    logError("Webhook error", error);
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { webhookController };
