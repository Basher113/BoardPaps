const {Router} = require("express");

const authControllers = require("../controllers/auth.controller");
const authRouter = Router();

const passport = require("passport");

authRouter.post("/register", authControllers.registerController);
authRouter.post("/login", authControllers.loginController);
authRouter.post("/logout", authControllers.logoutController);
authRouter.post("/refreshToken", authControllers.refreshTokenController);
authRouter.get("/me", passport.authenticate("jwt", {session: false}), authControllers.getCurrentUserDataController);


module.exports = authRouter