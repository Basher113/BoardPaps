const { Router } = require("express");
const {requireAuth} = require('@clerk/express');

const authControllers = require("../controllers/auth.controller");

const authRouter = Router();

// Protected routes - require authentication
authRouter.get("/me", requireAuth(), authControllers.getCurrentUserDataController);
authRouter.post("/sync", requireAuth(), authControllers.syncUserController);

module.exports = authRouter;
