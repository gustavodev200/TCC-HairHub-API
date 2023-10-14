import { IService } from "../interfaces";
import { FindAllArgs, FindAllReturn } from "../interfaces/IRepository";
import { GenericStatus } from "../models/dtos";
import {
  IServiceInputDTO,
  IServiceOutputDTO,
  IUpdateServiceParams,
} from "../models/dtos/ServiceDTO";
import { ServiceRepository } from "../models/repositories/barbershop";

export class ServiceBarbershop implements IService {
  private serviceRepository = new ServiceRepository();

  public async create(data: IServiceInputDTO) {
    const service = await this.serviceRepository.create(data);

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

  public async listServices(): Promise<IServiceOutputDTO[]> {
    const service = await this.serviceRepository.listServices();

    return service as unknown as IServiceOutputDTO[];
  }
}
