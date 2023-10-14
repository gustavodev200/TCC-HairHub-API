import { verify } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { AppError, ErrorMessages } from "../errors";
import { AssignmentType, ClientOutputDTO, GenericStatus } from "../models/dtos";
import {
  ClientRepository,
  EmployeeRepository,
} from "../models/repositories/user";

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

    const clientRepository = new ClientRepository();
    const employeeRepository = new EmployeeRepository();

    let user: any = await clientRepository.findById(id);

    if (!user) {
      user = await employeeRepository.findById(id);

      if (!user || user.status === GenericStatus.inactive) {
        throw new AppError(ErrorMessages.MSGE18, 401);
      }
    }

    if (!user || user.status === GenericStatus.inactive) {
      throw new AppError(ErrorMessages.MSGE18, 401);
    }

    req.user = {
      id,
      name: user.name,
      role: user.role as AssignmentType,
    };

    next();
  } catch (e) {
    if (e instanceof Error || (e instanceof AppError && e.statusCode !== 404))
      throw e;

    throw new AppError(ErrorMessages.MSGE18, 401);
  }
}
