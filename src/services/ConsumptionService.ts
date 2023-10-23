import { IService } from "../interfaces";
import {
  ConsumptionInputDTO,
  ConsumptionOutputDTO,
} from "../models/dtos/ConsumptionDTO";
import { ConsumptionRepository } from "../models/repositories/barbershop";

export class ConsumptionService implements IService {
  private consumptionRepository = new ConsumptionRepository();
  async create(data: ConsumptionInputDTO): Promise<ConsumptionOutputDTO> {
    const consumption = await this.consumptionRepository.create(data);

    return consumption;
  }
  async update(id: string, data: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async changeStatus(id: string, status: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async list(args?: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async listAllConsumptions(): Promise<ConsumptionOutputDTO[]> {
    const data = await this.consumptionRepository.listAllConsumptions();

    return data;
  }
}
