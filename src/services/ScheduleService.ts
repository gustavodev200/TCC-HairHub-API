import {
  FindAllArgsScheduling,
  FindAllReturn,
  IServiceSchedule,
} from "../interfaces";
import {
  ScheduleInputDTO,
  ScheduleOutputDTO,
  SchedulesUpdateParamsDTO,
} from "../models/dtos";
import { ScheduleRepository } from "../models/repositories/barbershop";

export class ScheduleService implements IServiceSchedule {
  private scheduleRepository = new ScheduleRepository();
  async create(data: ScheduleInputDTO): Promise<ScheduleOutputDTO> {
    const schedule = await this.scheduleRepository.create(data);

    return schedule;
  }
  async update(
    id: string,
    data: SchedulesUpdateParamsDTO
  ): Promise<ScheduleOutputDTO | string> {
    const schedule = await this.scheduleRepository.update(id, data);

    return schedule;
  }
  async changeStatus(id: string, status: string): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  async list(args?: FindAllArgsScheduling | undefined): Promise<FindAllReturn> {
    const result = await this.scheduleRepository.findAll(args);
    return result;
  }
}
