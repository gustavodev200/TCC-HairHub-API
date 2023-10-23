import {
  FindAllArgsScheduling,
  FindAllReturn,
  IServiceSchedule,
} from "../interfaces";
import {
  ScheduleInputDTO,
  ScheduleOutputDTO,
  ScheduleStatus,
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
  async changeStatus(
    id: string,
    schedule_status: ScheduleStatus,
    attend_status_date_time?: Date,
    awaiting_status_date_time?: Date,
    finished_status_date_time?: Date,
    confirmed_status_date_time?: Date
  ): Promise<ScheduleOutputDTO | string> {
    const updatedSchedule = await this.scheduleRepository.update(id, {
      schedule_status,
      attend_status_date_time,
      awaiting_status_date_time,
      finished_status_date_time,
      confirmed_status_date_time,
    });

    return updatedSchedule;
  }

  async list(args?: FindAllArgsScheduling | undefined): Promise<FindAllReturn> {
    const result = await this.scheduleRepository.findAll(args);
    return result;
  }

  async listById(id: string): Promise<ScheduleOutputDTO | string> {
    const result = await this.scheduleRepository.findById(id);
    return result as unknown as ScheduleOutputDTO;
  }
}
