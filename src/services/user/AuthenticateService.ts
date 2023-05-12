import { compare } from "bcrypt";
import { AppError, ErrorMessages } from "../../errors";
import { prisma } from "../../models";
import { UserInterface } from "../../models/dtos";
import { sign } from "jsonwebtoken";

export interface TokenInterface {
  token: string;
}

export class AuthenticateService {
  async execute({ email, password }: UserInterface): Promise<TokenInterface> {
    const employee = await prisma.employee.findUnique({
      where: {
        email,
      },
    });

    if (!employee) {
      throw new AppError(ErrorMessages.MSGE15);
    }

    const verifyPassword = await compare(password, employee.password);

    if (!verifyPassword) {
      throw new AppError(ErrorMessages.MSGE15);
    }

    const token = sign({ id: employee.id }, `${process.env.JWT_SECRET}`, {
      subject: employee.id,
      expiresIn: "7d",
    });

    return { token };
  }
}
