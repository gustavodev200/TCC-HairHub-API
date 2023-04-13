import { prisma } from "../../..";
import { AppError } from "../../../../errors/AppError";
import { FindAllArgs, IRepository } from "../../../../interfaces/IRepository";
import { Service } from "../../../domains";
import {
  GenericStatus,
  IServiceInputDTO,
  IServiceOutputDTO,
  IUpdateServiceParams,
} from "../../../dtos";

export class ServiceRepository implements IRepository {
  public async create({
    name,
    image,
    time,
    price,
  }: IServiceInputDTO): Promise<IServiceOutputDTO> {
    const existingService = await prisma.service.findUnique({
      where: { name },
    });

    if (existingService) {
      throw new AppError("O serviço já existe! Tente novamente.");
    }

    const service = new Service(name, image, time, price);

    service.validate();

    const createdService = await prisma.service.create({
      data: {
        name: service.name,
        image: service.image,
        time: Number(service.time),
        price: Number(service.price),
      },
    });

    return createdService as IServiceOutputDTO;
  }
  public async update(id: string, data: IUpdateServiceParams) {
    try {
      const serviceToUpdate = await prisma.service.findUniqueOrThrow({
        where: { id },
      });

      const service = new Service(
        serviceToUpdate.name,
        serviceToUpdate.image as string,
        serviceToUpdate.time,
        serviceToUpdate.price,
        serviceToUpdate.id,
        serviceToUpdate.status as GenericStatus
      );

      if (data.name !== undefined) service.name = data.name;
      if (data.image !== undefined) service.image = data.image;
      if (data.time !== undefined) service.time = data.time;
      if (data.price !== undefined) service.price = data.price;
      if (data.status !== undefined) service.status = data.status;

      service.validate();

      const updatedService = await prisma.service.update({
        where: { id },
        data: {
          name: service.name,
          image: service.image,
          time: Number(service.time),
          price: Number(service.price),
          status: service.status,
        },
      });

      return updatedService as IServiceOutputDTO;
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError("Algo deu errado! Tente novamente.", 404);
    }
  }

  public async findAll(args?: FindAllArgs) {
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

    const totalItems = await prisma.service.count({ where });

    const data = await prisma.service.findMany({
      where,
      skip: args?.skip,
      take: args?.take,
    });

    return {
      data,
      totalItems,
    };
  }
}
