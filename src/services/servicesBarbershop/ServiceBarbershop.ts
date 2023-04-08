import { IService } from "../../interfaces";
import { FindAllArgs, FindAllReturn } from "../../interfaces/IRepository";
import {
  IServiceInputDTO,
  IUpdateServiceParams,
} from "../../models/dtos/ServiceDTO";
import { ServiceRepository } from "../../models/repositories/barbershop/servicesBarbershop";

export class ServiceBarbershop implements IService {
  private serviceRepository = new ServiceRepository();

  public async create(data: IServiceInputDTO) {
    const service = await this.serviceRepository.create(data);

    return service;
  }
  public async update(id: string, data: IUpdateServiceParams) {
    throw new Error("Method not implemented.");
  }
  public async changeStatus(id: string, status: string) {
    throw new Error("Method not implemented.");
  }
  public async list(args?: FindAllArgs | undefined): Promise<FindAllReturn> {
    throw new Error("Method not implemented.");
  }
}
