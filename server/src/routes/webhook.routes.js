const { Router } = require("express");
const express = require("express");
const webhookController = require("../controllers/webhook.controller");

const webhookRouter = Router();

// Use express.raw() for Clerk webhook (needs raw body for signature verification)
webhookRouter.post("/clerk", express.raw({ type: "application/json" }), webhookController.webhookController);

module.exports = webhookRouter;
