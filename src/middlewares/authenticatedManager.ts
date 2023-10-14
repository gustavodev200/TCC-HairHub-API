import { NextFunction, Request, Response } from "express";
import { AppError, ErrorMessages } from "../errors";
import { AssignmentType } from "../models/dtos";

export async function authenticatedManager(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { role } = req.user;

  if (
    role !== AssignmentType.ADMIN &&
    role !== AssignmentType.EMPLOYEE &&
    role !== AssignmentType.CLIENT &&
    role !== AssignmentType.ATTENDANT
  ) {
    throw new AppError(ErrorMessages.MSGE18, 403);
  }

  next();
}
