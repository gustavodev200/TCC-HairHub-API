import { sign } from "jsonwebtoken";
import { prisma } from "../..";
import { AppError, ErrorMessages } from "../../../errors";
import { FindAllArgs, FindAllReturn, IRepository } from "../../../interfaces";
import { User } from "../../domains";
import { EmployeeInputDTO, EmployeeOutputDTO } from "../../dtos";
import { hash } from "bcrypt";

export class EmployeeRepository implements IRepository {
  async create(data: EmployeeInputDTO): Promise<EmployeeOutputDTO> {
    const existingEmployeeByCpf = await prisma.employee.findUnique({
      where: {
        cpf: data.cpf,
      },
    });

    const existingEmployeeByEmail = await prisma.employee.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingEmployeeByCpf && existingEmployeeByEmail) {
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
      },
    });

    return createdEmployee as EmployeeOutputDTO;
  }
  async update(id: string, data: unknown): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  async findAll(args?: FindAllArgs | undefined): Promise<FindAllReturn> {
    throw new Error("Method not implemented.");
  }
}
