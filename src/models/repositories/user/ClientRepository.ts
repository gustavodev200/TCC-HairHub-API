import { prisma } from "../..";
import bcrypt from "bcrypt";
import { AppError, ErrorMessages } from "../../../errors";
import { FindAllArgs, FindAllReturn, IRepository } from "../../../interfaces";
import { excludeFields, generateRandomPassword } from "../../../utils";
import { Address, Client } from "../../domains";
import { Mail } from "../../domains/Mail";
import {
  AssignmentType,
  ClientInputDTO,
  ClientOutputDTO,
  GenericStatus,
  IUpdateClientParams,
} from "../../dtos";
import { hash } from "bcrypt";
import { newPasswordEmailTemplate } from "../../../utils/firstAccessPassword";
import { firstAccessEmailTemplate } from "../../../utils/newPassword";

export class ClientRepository implements IRepository {
  async create(data: ClientInputDTO) {
    try {
      const existingClientByCpf = await prisma.client.findUnique({
        where: {
          cpf: data.cpf,
        },
      });

      const existingClientByEmail = await prisma.client.findUnique({
        where: {
          email: data.email,
        },
      });

      if (existingClientByCpf && existingClientByEmail) {
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

      const client = new Client(
        data.name,
        data.cpf,
        data.dataNasc,
        data.phone,
        data.role,
        address.toJSON(),
        data.email,
        hashedPassword,
        data.image
      );

      client.validate();

      const createdClient = await prisma.client.create({
        data: {
          name: client.name,
          cpf: client.cpf,
          dataNasc: client.dataNasc,
          phone: client.phone,
          role: client.role,
          email: client.email,
          password: client.password,
          id: client.id,
          address: {
            create: {
              cep: client.address.cep,
              city: client.address.city,
              state: client.address.state,
              district: client.address.district,
              street: client.address.street,
              number: client.address.number,
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
        firstAccessEmailTemplate(client.name, client.email, passwordAccessEmail)
      );

      const dataToReturn = {
        ...excludeFields(createdClient, [
          "created_at",
          "updated_at",
          "password",
          "address_id",
        ]),

        address: excludeFields(createdClient.address, [
          "created_at",
          "updated_at",
        ]),
      };

      return dataToReturn as unknown as ClientOutputDTO;
    } catch (error) {
      if (error instanceof AppError || error instanceof Error) throw error;

      throw new AppError(ErrorMessages.MSGE05, 404);
    }
  }
  async update(id: string, data: IUpdateClientParams) {
    try {
      const clientToUpdate = await prisma.client.findUnique({
        where: { id },
        include: {
          address: true,
        },
      });

      if (!clientToUpdate) {
        throw new AppError(ErrorMessages.MSGE05, 404);
      }
      const address = new Address(
        clientToUpdate.address.cep,
        clientToUpdate.address.city,
        clientToUpdate.address.state,
        clientToUpdate.address.district,
        clientToUpdate.address.street,
        clientToUpdate.address.number!,
        clientToUpdate.address.id
      );

      if (data.address) {
        address.setAll(data.address);
        address.validate();
      }

      const client = new Client(
        clientToUpdate.name,
        clientToUpdate.cpf,
        clientToUpdate.dataNasc.toISOString(),
        clientToUpdate.phone,
        clientToUpdate.role as AssignmentType,
        address.toJSON(),
        clientToUpdate.email,
        clientToUpdate.password,
        clientToUpdate.image as string,
        clientToUpdate.id,
        clientToUpdate.status as GenericStatus
      );

      if (data.name !== undefined) client.name = data.name;
      if (data.cpf !== undefined) client.cpf = data.cpf;
      if (data.dataNasc !== undefined) client.dataNasc = data.dataNasc;
      if (data.phone !== undefined) client.phone = data.phone;
      if (data.role !== undefined) client.role = data.role;
      if (data.email !== undefined) client.email = data.email;
      if (data.password !== undefined) client.password = data.password;
      if (data.status !== undefined) client.status = data.status;

      client.validate();

      if (client.cpf !== clientToUpdate.cpf) {
        const existingClientCPF = await prisma.client.findFirst({
          where: { cpf: client.cpf },
        });

        if (existingClientCPF) {
          throw new AppError(ErrorMessages.MSGE02);
        }
      }

      if (client.email !== clientToUpdate.email) {
        const existingClientEmail = await prisma.client.findFirst({
          where: { email: client.email },
        });

        if (existingClientEmail) {
          throw new AppError(ErrorMessages.MSGE02);
        }
      }

      let hashPassword: string = clientToUpdate.password;

      if (client.password !== clientToUpdate.password) {
        hashPassword = await bcrypt.hash(
          client.password,
          Number(process.env.BCRYPT_SALT)
        );
      }

      const updatedClient = await prisma.client.update({
        where: { id },
        data: {
          name: client.name,
          cpf: client.cpf,
          email: client.email,
          phone: client.phone,
          role: client.role,
          status: client.status,
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
          client.email,
          "Novos dados de acesso a plataforma Hair Hub BarberShop",
          newPasswordEmailTemplate(client.name, client.email, client.password)
        );
      }

      const dataToReturn = {
        ...excludeFields(updatedClient, [
          "created_at",
          "updated_at",
          "password",
          "address_id",
        ]),
        address: excludeFields(updatedClient.address, [
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

    const totalItems = await prisma.client.count({ where });

    const data = await prisma.client.findMany({
      where,
      include: {
        address: true,
      },
      skip: args?.skip,
      take: args?.take,
    });

    const dataToUse = data.map((client) => ({
      ...excludeFields(client, [
        "created_at",
        "updated_at",
        "password",
        "address_id",
      ]),

      address: excludeFields(client.address, ["created_at", "updated_at"]),
    }));

    return {
      data: dataToUse,
      totalItems,
    };
  }

  async findByEmail(email: string) {
    try {
      const client = await prisma.client.findUniqueOrThrow({
        where: { email },
        include: {
          address: true,
        },
      });

      return { ...client };
    } catch {
      throw new AppError(ErrorMessages.MSGE02);
    }
  }

  async findById(id: string) {
    try {
      const client = await prisma.client.findUniqueOrThrow({
        where: { id },
      });

      return { ...client, role: client.role };
    } catch {
      throw new AppError(ErrorMessages.MSGE02, 404);
    }
  }

  public async listAllClients() {
    const data = await prisma.client.findMany({
      where: {
        role: AssignmentType.CLIENT,
        status: GenericStatus.active,
      },
    });
    if (!data) {
      throw new AppError(ErrorMessages.MSGE05, 404);
    }

    const dataToUse = data.map((employee) => ({
      ...excludeFields(employee, [
        "created_at",
        "updated_at",
        "password",
        "address_id",
      ]),
    }));

    return dataToUse as unknown as ClientOutputDTO[];
  }
}
