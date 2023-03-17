import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import { routes } from "./routes";
import { AppError } from "./errors/AppError";

const main = async () => {
  config();
  const server = express();

  server.use(express.json());

  server.use(routes);

  server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        status: "error",
        message: err.message,
      });
    }

    return res.status(500).json({
      status: "error",
      message: `Problema interno no Servidor - ${err.message}`,
    });
  });

  const port = process.env.PORT || 8000;

  server.listen(port, () => console.log(`App is running 🚀`));
};

main();
