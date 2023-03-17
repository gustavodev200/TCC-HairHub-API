import { prisma } from "../../..";
import { ICreateServiceModel } from "../../../../controllers/barbershop/services/createService/Protocols";
import {
  IServiceInputDTO,
  IServiceOutputDTO,
} from "../../../../dtos/ServiceDTO";
import { AppError } from "../../../../errors/AppError";

export class MysqlCreateServiceModel implements ICreateServiceModel {
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
