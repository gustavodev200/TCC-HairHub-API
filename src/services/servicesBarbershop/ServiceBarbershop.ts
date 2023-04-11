import { IService } from "../../interfaces";
import { FindAllArgs, FindAllReturn } from "../../interfaces/IRepository";
import { GenericStatus } from "../../models/dtos";
import {
  IServiceInputDTO,
  IUpdateServiceParams,
} from "../../models/dtos/ServiceDTO";
import { ServiceRepository } from "../../models/repositories/barbershop/servicesBarbershop";

export class ServiceBarbershop implements IService {
  private serviceRepository = new ServiceRepository();

  public async create(data: IServiceInputDTO, imageUrl: string) {
    const service = await this.serviceRepository.create(data, imageUrl);

    return service;
  }

  public async update(id: string, data: IUpdateServiceParams) {
    const updatedService = await this.serviceRepository.update(id, data);

    return updatedService;
  }

  public async changeStatus(id: string, status: GenericStatus) {
    const updatedService = await this.serviceRepository.update(id, { status });

    return updatedService;
  }

  public async list(args?: FindAllArgs | undefined): Promise<FindAllReturn> {
    const result = await this.serviceRepository.findAll(args);

    return result;
  }
}
