import { prisma } from "../../..";
import { AppError } from "../../../../errors/AppError";
import {
  FindAllArgs,
  FindAllReturn,
  IRepository,
} from "../../../../interfaces/IRepository";
import { Service } from "../../../domains";
import {
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
        time: service.time,
        price: service.price,
      },
    });

    return createdService as IServiceOutputDTO;
  }
  public async update(
    id: string,
    data: IUpdateServiceParams
  ): Promise<IServiceOutputDTO> {
    throw new Error("Method not implemented.");
  }
  public async findAll(args?: FindAllArgs | undefined): Promise<FindAllReturn> {
    throw new Error("Method not implemented.");
  }
}
