const express = require("express");
const cors = require("cors");
const keys = require("./config/keys");

const app = express();

const projectRoutes = require("./routes/project.routes");

// Middleware
app.use(cors({
  origin: keys.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());

// parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.use("/projects", projectRoutes);


app.listen(keys.PORT, () => {
  console.log(`Server running on http://localhost:${keys.PORT}`);
});