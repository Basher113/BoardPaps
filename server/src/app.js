require('dotenv').config()
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const appConfig = require("./config/app.config")


const app = express();

// parser
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));



// Passport Section
const passport = require("passport");
const {configPassportJwt} = require("./services/passport.service");
configPassportJwt(passport); // Use the configured jwt strategy
app.use(passport.initialize()); // enable passport

const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const projectMemberRoutes = require("./routes/project-member.routes");


// Middleware
app.use(cors({
  origin: appConfig.CLIENT_URL,
  credentials: true,
}));



// Routes
app.use("/auth", authRoutes);
app.use("/projects", passport.authenticate('jwt', { session: false }), projectRoutes);
app.use("/projects/:projectId/members", passport.authenticate('jwt', { session: false }), projectMemberRoutes);

module.exports = app;