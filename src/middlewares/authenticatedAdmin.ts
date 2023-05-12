import { NextFunction, Request, Response } from "express";
import { AppError, ErrorMessages } from "../errors";
import { AssignmentType } from "../models/dtos";

export async function authenticatedAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { role } = req.body.user;

  if (role === AssignmentType.ADMIN) {
    throw new AppError(ErrorMessages.MSGE18, 401);
  }

  next();
}
