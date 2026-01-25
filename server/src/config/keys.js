const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT || 8000,
  CLIENT_URL: process.env.CLIENT_URL,
  NODE_ENV: process.env.NODE_ENV,
};