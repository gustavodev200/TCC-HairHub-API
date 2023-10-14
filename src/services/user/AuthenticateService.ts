import { compare } from "bcrypt";
import { AppError, ErrorMessages } from "../../errors";
import { decode, sign } from "jsonwebtoken";
import {
  EmployeeRepository,
  ClientRepository,
} from "../../models/repositories/user";

export class AuthenticationService {
  private employeeRepository = new EmployeeRepository();
  private clientRepository = new ClientRepository();

  async execute(email: string, password: string) {
    let user = await this.clientRepository.findByEmail(email);

    if (!user) {
      user = await this.employeeRepository.findByEmail(email);

      if (!user) {
        throw new AppError(ErrorMessages.MSGE15);
      }
    }

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      throw new AppError(ErrorMessages.MSGE15);
    }

    const token = sign(
      {
        email: user.email,
        role: user.role,
        name: user.name,
      },
      `${process.env.JWT_SECRET}`,
      {
        subject: user.id,

        expiresIn: "60d",
      }
    );

    return token;
  }
}
