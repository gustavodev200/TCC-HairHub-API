import { prisma } from "../..";
import { AppError, ErrorMessages } from "../../../errors";
import { FindAllArgs, FindAllReturn, IRepository } from "../../../interfaces";
import {
  excludeFields,
  generateRandomPassword,
  parseArrayOfData,
} from "../../../utils";
import { User } from "../../domains";
import { Mail } from "../../domains/Mail";
import { EmployeeInputDTO, EmployeeOutputDTO } from "../../dtos";
import { hash } from "bcrypt";

export class EmployeeRepository implements IRepository {
  async create(data: EmployeeInputDTO) {
    try {
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

      const passwordAccessEmail = generateRandomPassword(8);

      const mail = new Mail();

      const hashedPassword = await hash(passwordAccessEmail || "", 8);

      const employee = new User(
        data.name,
        data.cpf,
        data.dataNasc,
        data.phone,
        data.role,
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
          role: employee.role,
          address: {
            create: {
              cep: employee.address.cep,
              city: employee.address.city,
              state: employee.address.state,
              district: employee.address.district,
              street: employee.address.street,
              number: employee.address.number,
            },
          },
          email: employee.email,
          password: employee.password,
          image: employee.image,
        },
        include: {
          address: true,
        },
      });

      await mail.sendMail(
        data.email,
        "Dados de Acesso a Plataforma Hair Hub BarberShop",
        `
        <h2>Bem-vindo(a) à Hair Hub BarberShop!</h2>
        <p>Seu cadastro foi realizado com sucesso.</p>
        <p>Segue abaixo os dados de acesso:</p>
        <p><strong>Usuário:</strong> ${employee.email}</p>
        <p><strong>Senha:</strong> ${passwordAccessEmail}</p>
        <p>Para acessar o sistema, por favor acesse <a href="https://minhaempresa.com.br">https://minhaempresa.com.br</a>.</p>
        <p>Obrigado!</p>
      `
      );

      return excludeFields(createdEmployee, [
        "password",
        "created_at",
        "updated_at",
      ]) as EmployeeOutputDTO;
    } catch (error) {
      if (error instanceof AppError || error instanceof Error) throw error;

      throw new AppError(ErrorMessages.MSGE05, 404);
    }
  }
  async update(id: string, data: unknown): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  async findAll(args?: FindAllArgs | undefined): Promise<FindAllReturn> {
    const where = {
      OR: args?.searchTerm
        ? [
            {
              name: {
                contains: args?.searchTerm,
              },
            },
          ]
        : undefined,
      status: {
        equals: args?.filterByStatus,
      },
    };

    const totalItems = await prisma.employee.count({ where });

    const data = await prisma.employee.findMany({
      where,
      include: {
        address: true,
      },
      skip: args?.skip,
      take: args?.take,

      orderBy: {
        status: "asc",
      },
    });

    return {
      data: parseArrayOfData(data, ["password"]),
      totalItems,
    };
  }
}
