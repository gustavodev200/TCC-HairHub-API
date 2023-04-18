import cors from "cors";
import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import { routes } from "./routes";
import { AppError } from "./errors/AppError";

const main = async () => {
  config();

  const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  };

  const server = express();
  server.use(cors(corsOptions));
  server.use(express.json({ limit: "50mb" }));
  server.use(express.urlencoded({ limit: "50mb" }));
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

  server.listen(port, () =>
    console.log(
      `\n🚀 Server \x1b[32mstarted\x1b[0m on port \x1b[1m\x1b[36m${process.env.PORT}\x1b[0m`
    )
  );
};

main();
