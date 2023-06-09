import { FindAllArgs, FindAllReturn, IService } from "../interfaces";
import { ScheduleInputDTO, ScheduleOutputDTO } from "../models/dtos";
import { ScheduleRepository } from "../models/repositories/barbershop";

export class ScheduleService implements IService {
  private scheduleRepository = new ScheduleRepository();
  async create(data: ScheduleInputDTO): Promise<ScheduleOutputDTO> {
    const schedule = await this.scheduleRepository.create(data);

    return schedule;
  }
  async update(id: string, data: unknown): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  async changeStatus(id: string, status: string): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  async list(args?: FindAllArgs | undefined): Promise<FindAllReturn> {
    throw new Error("Method not implemented.");
  }
}
