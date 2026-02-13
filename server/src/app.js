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
const usersRouter = require("./routes/users.routes");
const dashboardRouter = require("./routes/dashboard.routes");

// Middleware
app.use(cors({
  origin: appConfig.CLIENT_URL,
  credentials: true,
}));



// Routes
app.use("/auth", authRoutes);
app.use("/projects", passport.authenticate('jwt', { session: false }), projectRoutes); // Checkout project.routes to see its nested routes
app.use("/users", passport.authenticate('jwt', { session: false }), usersRouter);
app.use("/dashboard", passport.authenticate('jwt', { session: false }), dashboardRouter);

module.exports = app;