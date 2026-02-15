require('dotenv').config()
const express = require("express");
const cors = require("cors");
const appConfig = require("./config/app.config")

const app = express();

// Webhook routes - MUST be before express.json() for raw body signature verification
const webhookRoutes = require("./routes/webhook.routes");
app.use("/webhooks", webhookRoutes);

// Parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// CORS
app.use(cors({
  origin: appConfig.CLIENT_URL,
  credentials: true,
}));

// Add Clerk middleware - verifies tokens and populates req.auth
// then withUser syncs to database and populates req.user
const { clerkMiddleware } = require("@clerk/express");
const { withUser } = require("./middlewares/auth.middleware");
app.use(clerkMiddleware());
app.use(withUser);

// Routes
const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const usersRouter = require("./routes/users.routes");
const dashboardRouter = require("./routes/dashboard.routes");

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/users", usersRouter);
app.use("/dashboard", dashboardRouter);

module.exports = app;
