const { Router } = require("express");
const issueRouter = Router({ mergeParams: true });

const { requireProjectMember } = require("../middlewares/projectMember.middleware");
const { validateBody, validateParams, validateQuery } = require("../middlewares/validation.middleware");

const { 
  createIssueSchema,
  updateIssueSchema,
  moveIssueSchema,
  getIssuesQuerySchema
} = require("../validations/issue.schema");

const issueController = require("../controllers/issue.controller");

issueRouter.get("/",
  requireProjectMember,
  validateParams(getIssuesQuerySchema),
  validateQuery(getIssuesQuerySchema),
  issueController.getIssues
);

issueRouter.get("/:issueId",
  requireProjectMember,
  issueController.getIssue
);

issueRouter.post("/",
  requireProjectMember,
  validateBody(createIssueSchema),
  issueController.createIssue
);

issueRouter.put("/:issueId",
  requireProjectMember,
  validateBody(updateIssueSchema),
  issueController.updateIssue
);

issueRouter.patch("/:issueId/move",
  requireProjectMember,
  validateBody(moveIssueSchema),
  issueController.moveIssue
);

issueRouter.delete("/:issueId",
  requireProjectMember,
  issueController.deleteIssue
);

module.exports = issueRouter;