import app from "./src/app.js";
import { config } from "./config/config.js";
import { connectTODB } from "./config/database.js";

connectTODB();

const startServer = () => {
  app.listen(config.port, () => {
    console.log(`Server running on PORT ${config.port}`);
  });
};

startServer();
