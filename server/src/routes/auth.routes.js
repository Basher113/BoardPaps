const {Router} = require("express");

const authControllers = require("../controllers/auth.controller");
const authRouter = Router();

authRouter.post("/register", authControllers.registerController);
authRouter.post("/login", authControllers.loginController);
authRouter.post("/logout", authControllers.logoutController);
authRouter.post("/refreshToken", authControllers.refreshTokenController);

module.exports = authRouter