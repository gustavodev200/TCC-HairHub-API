import { sign } from "jsonwebtoken";
import { prisma } from "../..";
import { AppError, ErrorMessages } from "../../../errors";
import { FindAllArgs, FindAllReturn, IRepository } from "../../../interfaces";
import { User } from "../../domains";
import { EmployeeInputDTO, EmployeeOutputDTO } from "../../dtos";
import { hash } from "bcrypt";

export class EmployeeRepository implements IRepository {
  async create(data: EmployeeInputDTO): Promise<EmployeeOutputDTO> {
    const existingEmployeeByName = await prisma.service.findUnique({
      where: {
        name: data.name,
      },
    });

    const existingEmployeeByEmail = await prisma.service.findUnique({
      where: {
        name: data.email,
      },
    });

    if (existingEmployeeByName && existingEmployeeByEmail) {
      throw new AppError(ErrorMessages.MSGE02);
    }

    const hashedPassword = await hash(data.password || "", 8);

    const employee = new User(
      data.name,
      data.cpf,
      data.dataNasc,
      data.phone,
      data.roles,
      data.address,
      data.email,
      hashedPassword
    );

    employee.validate();

    const createdEmployee = await prisma.employee.create({
      data: {
        name: employee.name,
        cpf: employee.cpf,
        dataNasc: new Date(employee.dataNasc),
        phone: employee.phone,
        roles: {
          create: employee.roles,
        },
        address: {
          create: employee.address,
        },
        email: employee.email,
        password: employee.password,
        image: employee.image,
      },
      include: {
        roles: true,
        address: true,
        user_token: true,
      },
    });

    const token = sign(
      { id: createdEmployee.id },
      `${process.env.JWT_SECRET}`,
      {
        subject: createdEmployee.id,
        expiresIn: `${process.env.JWT_EXPIRES_IN}`,
      }
    );

    const refreshToken = sign(
      { id: createdEmployee.id },
      `${process.env.JWT_SECRET}`,
      { expiresIn: `${process.env.REFRESH_TOKEN_EXPIRES_IN}` }
    );

    const userToken = await prisma.userToken.create({
      data: {
        refresh_token: refreshToken,
        employee: {
          connect: { id: createdEmployee.id },
        },
        expires_date: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // adiciona uma data de expiração de 30 dias
      },
    });

    return {
      id: createdEmployee.id,
      name: createdEmployee.name,
      cpf: createdEmployee.cpf,
      dataNasc: createdEmployee.dataNasc,
      phone: createdEmployee.phone,
      roles: createdEmployee.roles,
      address: createdEmployee.address,
      email: createdEmployee.email,
      token,
      refresh_token: userToken.refresh_token,
    } as unknown as EmployeeOutputDTO;
  }
  async update(id: string, data: unknown): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  async findAll(args?: FindAllArgs | undefined): Promise<FindAllReturn> {
    throw new Error("Method not implemented.");
  }
}
