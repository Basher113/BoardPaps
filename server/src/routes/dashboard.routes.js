const { Router } = require("express");
const dashboardRouter = Router();

const dashboardController = require("../controllers/dashboard.controller");
const {requireAuth} = require('@clerk/express');

/**
 * @route GET /api/dashboard/issues
 * @desc Get all issues assigned to the logged-in user across all projects
 * @access Private (requires authentication)
 */
dashboardRouter.get("/issues", requireAuth(), dashboardController.getUserIssues);

module.exports = dashboardRouter;
