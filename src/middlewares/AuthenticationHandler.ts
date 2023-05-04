import { verify } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export interface PayloadInterface {
  id: string;
}

interface CustomRequest extends Request {
  userId?: string;
}

export class AuthenticationHandler {
  async handle(req: CustomRequest, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization;

    if (!authToken) {
      res.status(401).json({
        error: "Acesso não autorizado!",
      });
    }

    const [, token] = authToken!.split(" ");

    try {
      const { id } = verify(
        token,
        `${process.env.JWT_SECRET}`
      ) as PayloadInterface;
      const userId = id;

      req.userId = userId;

      return next();
    } catch (error) {
      return res.status(401).json({
        error: "Acesso não autorizado!",
      });
    }
  }
}

export default new AuthenticationHandler();
