import express from "express";
import { config } from "dotenv";

const main = async () => {
  config();
  const server = express();

  server.use(express.json());

  const port = process.env.PORT || 8000;

  server.listen(port, () => console.log(`Server is running in port ${port}`));
};

main();
