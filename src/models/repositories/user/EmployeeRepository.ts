import { prisma } from "../..";
import bcrypt from "bcrypt";
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
import { newPasswordEmailTemplate } from "../../../utils/firstAccessPassword";
import { firstAccessEmailTemplate } from "../../../utils/newPassword";

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
        firstAccessEmailTemplate(
          employee.name,
          employee.email,
          passwordAccessEmail
        )
      );

      const dataToReturn = {
        ...excludeFields(createdEmployee, [
          "created_at",
          "updated_at",
          "password",
          "address_id",
        ]),

        address: excludeFields(createdEmployee.address, [
          "created_at",
          "updated_at",
        ]),
      };

      return dataToReturn as unknown as EmployeeOutputDTO;
    } catch (error) {
      if (error instanceof AppError || error instanceof Error) throw error;

      throw new AppError(ErrorMessages.MSGE05, 404);
    }
  }
  async update(id: string, data: IUpdateEmployeeParams) {
    try {
      const employeeToUpdate = await prisma.employee.findUnique({
        where: { id },
        include: {
          address: true,
        },
      });

      if (!employeeToUpdate) {
        throw new AppError(ErrorMessages.MSGE05, 404);
      }
      const address = new Address(
        employeeToUpdate.address.cep,
        employeeToUpdate.address.city,
        employeeToUpdate.address.state,
        employeeToUpdate.address.district,
        employeeToUpdate.address.street,
        employeeToUpdate.address.number!,
        employeeToUpdate.address.id
      );

      if (data.address) {
        address.setAll(data.address);
        address.validate();
      }

      const employee = new Employee(
        employeeToUpdate.name,
        employeeToUpdate.cpf,
        employeeToUpdate.dataNasc.toISOString(),
        employeeToUpdate.phone,
        employeeToUpdate.role as AssignmentType,
        address.toJSON(),
        employeeToUpdate.email,
        employeeToUpdate.password,
        employeeToUpdate.id,
        employeeToUpdate.status as GenericStatus
      );

      if (data.name !== undefined) employee.name = data.name;
      if (data.cpf !== undefined) employee.cpf = data.cpf;
      if (data.dataNasc !== undefined) employee.dataNasc = data.dataNasc;
      if (data.phone !== undefined) employee.phone = data.phone;
      if (data.role !== undefined) employee.role = data.role;
      if (data.email !== undefined) employee.email = data.email;
      if (data.password !== undefined) employee.password = data.password;
      if (data.status !== undefined) employee.status = data.status;

      employee.validate();

      if (
        employee.email !== employeeToUpdate.email ||
        employee.cpf !== employeeToUpdate.cpf
      ) {
        const existingEmployee = await prisma.employee.findFirst({
          where: { OR: [{ cpf: employee.cpf }, { email: employee.email }] },
        });

        if (existingEmployee) {
          throw new AppError(ErrorMessages.MSGE02);
        }
      }

      let hashPassword: string = employeeToUpdate.password;

      if (employee.password !== employeeToUpdate.password) {
        hashPassword = await bcrypt.hash(
          employee.password,
          Number(process.env.BCRYPT_SALT)
        );
      }

      const updatedEmployee = await prisma.employee.update({
        where: { id },
        data: {
          name: employee.name,
          cpf: employee.cpf,
          email: employee.email,
          phone: employee.phone,
          role: employee.role,
          status: employee.status,
          image: employee.image,
          password: hashPassword,
          address: {
            update: {
              ...address.toJSON(),
            },
          },
        },
        include: {
          address: true,
        },
      });

      if (data.password) {
        const mail = new Mail();

        await mail.sendMail(
          employee.email,
          "Novos dados de acesso a plataforma Hair Hub BarberShop",
          newPasswordEmailTemplate(
            employee.name,
            employee.email,
            employee.password
          )
        );
      }

      const dataToReturn = {
        ...excludeFields(updatedEmployee, [
          "created_at",
          "updated_at",
          "password",
          "address_id",
        ]),
        address: excludeFields(updatedEmployee.address, [
          "created_at",
          "updated_at",
        ]),
      };

      return dataToReturn;
    } catch (error) {
      if (error instanceof AppError || error instanceof Error) throw error;
      throw new AppError(ErrorMessages.MSGE05, 404);
    }
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
            {
              cpf: {
                contains: args?.searchTerm,
              },
            },
            {
              email: {
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

    const dataToUse = data.map((employee) => ({
      ...excludeFields(employee, [
        "created_at",
        "updated_at",
        "password",
        "address_id",
      ]),

      address: excludeFields(employee.address, ["created_at", "updated_at"]),
    }));

    return {
      data: dataToUse,
      totalItems,
    };
  }

  async findByEmail(email: string) {
    try {
      const employee = await prisma.employee.findUniqueOrThrow({
        where: { email },
        include: {
          address: true,
        },
      });

      return { ...employee };
    } catch {
      throw new AppError(ErrorMessages.MSGE02);
    }
  }
}
