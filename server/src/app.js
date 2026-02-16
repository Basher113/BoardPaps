require('dotenv').config()
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const appConfig = require("./config/app.config")
const { globalApiLimiter } = require("./middlewares/rateLimiter.middleware");

const app = express();

// Webhook routes - MUST be before express.json() for raw body signature verification
const webhookRoutes = require("./routes/webhook.routes");
app.use("/webhooks", webhookRoutes);

// For security headers - HELMET
app.use(helmet());

// Parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));



// CORS
app.use(cors({
  origin: appConfig.CLIENT_URL,
  credentials: true,
}));

// CLERK
const { clerkMiddleware } = require("@clerk/express");
const { withUser } = require("./middlewares/auth.middleware");
app.use(clerkMiddleware());
app.use(withUser);

// Global rate limiter 
app.use(globalApiLimiter);

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
