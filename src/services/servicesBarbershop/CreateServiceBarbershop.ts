import { IServiceInputDTO } from "../../dtos/ServiceDTO";
import { MysqlCreateServiceRepository } from "../../models/repositories/barbershop/servicesBarbershop/createService/MysqlCreateServiceRepositories";

export class CreateServiceBarbershop {
  public async handle(data: IServiceInputDTO) {
    const createServiceRepository = new MysqlCreateServiceRepository();
    const service = await createServiceRepository.createService(data);

    return service;
  }
}
