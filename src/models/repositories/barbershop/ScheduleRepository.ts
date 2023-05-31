import { prisma } from "../..";
import { AppError, ErrorMessages } from "../../../errors";
import { IRepository } from "../../../interfaces";
import { Schedule } from "../../domains";
import { ScheduleInputDTO, ScheduleOutputDTO } from "../../dtos";

export class ScheduleRepository implements IRepository {
  async create({
    appointment_date,
    start_time,
    end_time,
    services,
    client_id,
    employee_id,
  }: ScheduleInputDTO): Promise<ScheduleOutputDTO> {
    const existingSchedule = await prisma.scheduling.findFirst({
      where: {
        appointment_date,
        start_time,
        end_time,
        client_id,
        employee_id,
      },
    });

    if (existingSchedule) {
      throw new AppError(ErrorMessages.MSGE02);
    }

    const schedule = new Schedule(
      appointment_date,
      start_time,
      end_time,
      services,
      client_id,
      employee_id
    );

    schedule.validate();

    const createdSchedule = await prisma.scheduling.create({
      data: {
        appointment_date: schedule.appointment_date,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        client: {
          connect: {
            id: schedule.client.id,
          },
        },
        employee: {
          connect: {
            id: schedule.employee.id,
          },
        },
        services: {
          connect: schedule.services,
        },
        schedule_status: schedule.schedule_status,
        estimated_time: schedule.estimated_time,
      },
    });

    return createdSchedule as unknown as ScheduleOutputDTO;
  }
  async update(id: string, data: unknown): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
}
