import { verify } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { AppError, ErrorMessages } from "../errors";
import { AssignmentType, GenericStatus } from "../models/dtos";
import { EmployeeRepository } from "../models/repositories/user";

interface Payload {
  sub: string;
}

export async function authenticationHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError(ErrorMessages.MSGE18, 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub: id } = verify(
      token,
      process.env.JWT_SECRET as string
    ) as Payload;

    const employeeRepository = new EmployeeRepository();

    const employee = await employeeRepository.findById(id);

    if (employee.status === GenericStatus.inactive) {
      throw new AppError(ErrorMessages.MSGE18, 401);
    }

    req.user = {
      id,
      role: employee.role as AssignmentType,
    };

    next();
  } catch (e) {
    if (e instanceof Error || (e instanceof AppError && e.statusCode !== 404))
      throw e;

    throw new AppError(ErrorMessages.MSGE18, 401);
  }
}
