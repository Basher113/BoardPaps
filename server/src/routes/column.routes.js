const {Router} = require("express");
const columnController = require("../controllers/column.controllers");
const columnRouter = Router({mergeParams: true});

const {requireProjectMember} = require("../middlewares/projectMember.middleware");

columnRouter.get(
  "/",
  requireProjectMember,
  columnController.getColumns
);


module.exports = columnRouter;
