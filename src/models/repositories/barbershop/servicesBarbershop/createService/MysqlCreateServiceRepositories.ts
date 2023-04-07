import { prisma } from "../../../..";
import { ICreateServiceRepository } from "../../../../../controllers/barbershop/servicesBarbershop/createService/Protocols";
import {
  IServiceInputDTO,
  IServiceOutputDTO,
} from "../../../../../dtos/ServiceDTO";
import { AppError } from "../../../../../errors/AppError";

export class MysqlCreateServiceRepository implements ICreateServiceRepository {
  public async createService(
    data: IServiceInputDTO
  ): Promise<IServiceOutputDTO> {
    const service = await prisma.service.create({ data });

    if (!service) {
      throw new AppError("Erro ao criar Serviço! Tente novamente mais tarde.");
    }

    return service;
  }
}
