const {Router} = require("express");

const boardRouter = Router({ mergeParams: true });

const {requireProjectMember, requireProjectRole} = require("../middlewares/projectMember.middleware");
const BoardController = require("../controllers/board.controller");

boardRouter.get("/",
  requireProjectMember,
  BoardController.getBoards);

boardRouter.get("/:boardId",
  requireProjectMember,
  BoardController.getBoard);

// Recent board route - must be after /:boardId to avoid conflicts
boardRouter.get("/recent",
  requireProjectMember,
  BoardController.getRecentBoard);

boardRouter.post("/",
  requireProjectMember,
  BoardController.createBoard);


boardRouter.put("/:boardId",
  requireProjectMember,
  BoardController.updateBoard);


boardRouter.patch("/:boardId",
  requireProjectMember,
  BoardController.updateBoard);

boardRouter.delete("/:boardId",
  requireProjectMember,
  requireProjectRole(["OWNER"]),
  BoardController.deleteBoard);

module.exports = boardRouter;