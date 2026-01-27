const app = require("./app");
const appConfig = require("./config/app.config");

app.listen(appConfig.PORT, () => {
  console.log(`Server running on http://localhost:${appConfig.PORT}`);
});