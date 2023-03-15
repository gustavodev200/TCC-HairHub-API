import { prisma } from "../../..";
import { ICreateServiceModel } from "../../../../controllers/barbershop/services/createService/Protocols";
import {
  IServiceInputDTO,
  IServiceOutputDTO,
} from "../../../../dtos/ServiceDTO";

export class MysqlCreateServiceModel implements ICreateServiceModel {
  public async createService(
    data: IServiceInputDTO
  ): Promise<IServiceOutputDTO> {
    const newService = await prisma.service.create({ data });

    return newService;
  }
}
