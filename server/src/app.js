const express = require("express");
const cors = require("cors");
const keys = require("./config/keys");

const app = express();

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
  origin: keys.CLIENT_URL,
  credentials: true,
}));


// parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/projects/:projectId/members", projectMemberRoutes);

app.listen(keys.PORT, () => {
  console.log(`Server running on http://localhost:${keys.PORT}`);
});