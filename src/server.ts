import express from "express";
import { config } from "dotenv";
import { routes } from "./routes";

const main = async () => {
  config();
  const server = express();

  server.use(express.json());

  server.use(routes);

  const port = process.env.PORT || 8000;

  server.listen(port, () => console.log(`App is running 🚀`));
};

main();
