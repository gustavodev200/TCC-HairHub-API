import { prisma } from "../..";
import { AppError, ErrorMessages } from "../../../errors";
import { FindAllArgs, FindAllReturn, IRepository } from "../../../interfaces";
import { User } from "../../domains";
import { EmployeeInputDTO, EmployeeOutputDTO } from "../../dtos";

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

    const employee = new User(
      data.name,
      data.cpf,
      data.dataNasc,
      data.phone,
      data.roles,
      data.address,
      data.email,
      data.password
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
