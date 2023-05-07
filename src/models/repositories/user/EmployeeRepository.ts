import { prisma } from "../..";
import { AppError, ErrorMessages } from "../../../errors";
import { FindAllArgs, FindAllReturn, IRepository } from "../../../interfaces";
import {
  excludeFields,
  generateRandomPassword,
  parseArrayOfData,
} from "../../../utils";
import { Address, Employee } from "../../domains";
import { Mail } from "../../domains/Mail";
import {
  AssignmentType,
  EmployeeInputDTO,
  EmployeeOutputDTO,
  GenericStatus,
  IUpdateEmployeeParams,
} from "../../dtos";
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

      const passwordAccessEmail = generateRandomPassword(
        Number(process.env.PASSWORD_LENGTH)
      );

      const mail = new Mail();

      const hashedPassword = await hash(
        passwordAccessEmail || "",
        Number(process.env.BCRYPT_SALT)
      );

      const address = new Address(
        data.address.cep,
        data.address.city,
        data.address.state,
        data.address.district,
        data.address.street,
        data.address.number
      );

      address.validate();

      const employee = new Employee(
        data.name,
        data.cpf,
        data.dataNasc,
        data.phone,
        data.role,
        address.toJSON(),
        data.email,
        hashedPassword
      );

      employee.validate();

      const createdEmployee = await prisma.employee.create({
        data: {
          name: employee.name,
          cpf: employee.cpf,
          dataNasc: employee.dataNasc,
          phone: employee.phone,
          role: employee.role,
          email: employee.email,
          password: employee.password,
          image: employee.image,
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
      ]) as unknown as EmployeeOutputDTO;
    } catch (error) {
      if (error instanceof AppError || error instanceof Error) throw error;

      throw new AppError(ErrorMessages.MSGE05, 404);
    }
  }
  async update(id: string, data: IUpdateEmployeeParams) {
    // try {
    //   const employeeToUpdate = await prisma.employee.findUnique({
    //     where: { id },
    //     include: {
    //       address: true,
    //     },
    //   });
    //   const address = new Address(
    //     employeeToUpdate?.address?.cep!,
    //     employeeToUpdate?.address?.city!,
    //     employeeToUpdate?.address?.state!,
    //     employeeToUpdate?.address?.district!,
    //     employeeToUpdate?.address?.street!,
    //     employeeToUpdate?.address?.number!
    //   );
    //   const employee = new Employee(
    //     employeeToUpdate?.name!,
    //     employeeToUpdate?.cpf!,
    //     employeeToUpdate?.dataNasc?.toString(),
    //     employeeToUpdate?.phone!,
    //     employeeToUpdate?.role as AssignmentType,
    //     address,
    //     employeeToUpdate?.email!,
    //     employeeToUpdate?.password!,
    //     employeeToUpdate?.id,
    //     employeeToUpdate?.status as GenericStatus,
    //     employeeToUpdate?.image as string
    //   );
    //   if (data.name !== undefined) employee.name = data.name;
    //   if (data.cpf !== undefined) employee.cpf = data.cpf;
    //   employee.validate();
    //   if (
    //     employee.email !== employeeToUpdate?.email &&
    //     employee.cpf !== employeeToUpdate?.cpf
    //   ) {
    //     const alreadyExists = await prisma.service.findUnique({
    //       where: { name: data.cpf && data.email },
    //     });
    //     if (alreadyExists) {
    //       throw new AppError(ErrorMessages.MSGE02);
    //     }
    //   }
    //   const updatedEmployee = await prisma.employee.update({
    //     where: { id },
    //     data: {
    //       name: employee.name,
    //       cpf: employee.cpf,
    //       email: employee.email,
    //       phone: employee.phone,
    //       role: employee.role,
    //       status: employee.status,
    //       image: employee.image,
    //       address: {
    //         update: {
    //           cep: employee.address.cep,
    //           city: employee.address.city,
    //           state: employee.address.state,
    //           district: employee.address.district,
    //           street: employee.address.street,
    //           number: employee.address.number,
    //         },
    //       },
    //     },
    //   });
    //   return updatedEmployee as unknown as EmployeeOutputDTO;
    // } catch (error) {
    //   if (error instanceof AppError || error instanceof Error) throw error;
    //   throw new AppError(ErrorMessages.MSGE05, 404);
    // }
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
