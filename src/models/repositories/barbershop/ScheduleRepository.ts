import { prisma } from "../..";
import { AppError, ErrorMessages } from "../../../errors";
import { IRepository } from "../../../interfaces";
import { excludeFields } from "../../../utils";
import { Schedule } from "../../domains";
import {
  EmployeeOutputDTO,
  ScheduleInputDTO,
  ScheduleOutputDTO,
  ScheduleStatus,
  SchedulesUpdateParamsDTO,
} from "../../dtos";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

export class ScheduleRepository implements IRepository {
  async create({
    start_date_time,
    services,
    end_date_time,
    client,
    employee,
  }: ScheduleInputDTO): Promise<any> {
    const turnoDisponivel = await prisma.shift.findMany({
      where: {
        employee_id: employee.id,
        start_time: {
          lte: start_date_time,
        },
        end_time: {
          gte: end_date_time,
        },
        available_days: {
          some: {
            day: dayjs(start_date_time).get("day"),
          },
        },
      },
    });

    if (turnoDisponivel.length) {
      const horarioAgendado = await prisma.scheduling.findMany({
        where: {
          employee_id: employee.id,
          OR: [
            {
              start_date_time: {
                lte: start_date_time,
              },
              end_date_time: {
                gte: start_date_time,
              },
            },
            {
              end_date_time: {
                gte: end_date_time,
              },
              start_date_time: {
                lte: end_date_time,
              },
            },
          ],
        },
      });

      if (horarioAgendado.length) {
        return "Barbeiro não disponivel";
      }

      const schedule = new Schedule(
        start_date_time,
        end_date_time,
        services,
        client,
        employee.id
      );

      if (start_date_time !== undefined)
        schedule.start_date_time = start_date_time;
      if (end_date_time !== undefined) schedule.end_date_time = end_date_time;
      if (client !== undefined) schedule.client = client;

      schedule.validate();

      const scheduleCreated = await prisma.scheduling.create({
        data: {
          start_date_time: schedule.start_date_time,
          end_date_time: schedule.end_date_time,
          client_id: schedule.client,
          employee_id: schedule.employee,
          schedule_status: schedule.schedule_status,
          services: {
            connect: services.map((service) => ({
              id: service,
            })),
          },
        },
        include: {
          services: true,
        },
      });

      return scheduleCreated as unknown as ScheduleOutputDTO;
    }

    return "Barbeiro não disponivel";
  }

  async update(
    id: string,
    data: SchedulesUpdateParamsDTO
  ): Promise<ScheduleOutputDTO> {
    try {
      const scheduleToUpdate = await prisma.scheduling.findUniqueOrThrow({
        where: { id },
        include: {
          services: true,
        },
      });

      //colocarvalidações se já existe esse agendamento

      const schedule = new Schedule(
        dayjs(scheduleToUpdate.start_date_time).toISOString(),
        dayjs(scheduleToUpdate.end_date_time).toISOString(),
        scheduleToUpdate.services.map((service) => service.id),
        scheduleToUpdate.client_id,
        scheduleToUpdate.employee_id,
        scheduleToUpdate.schedule_status as ScheduleStatus,
        scheduleToUpdate.id
      );

      if (data.client !== undefined) schedule.client = data.client;
      if (data.employee !== undefined) schedule.employee = data.employee;
      if (data.end_date_time !== undefined)
        schedule.end_date_time = data.end_date_time;
      if (data.start_date_time !== undefined)
        schedule.start_date_time = data.start_date_time;
      if (data.services !== undefined) schedule.services = data.services;
      if (data.schedule_status !== undefined)
        schedule.schedule_status = data.schedule_status;

      schedule.validate();

      const updatedSchedule = await prisma.scheduling.update({
        where: { id },
        data: {
          start_date_time: schedule.start_date_time,
          end_date_time: schedule.end_date_time,
          client_id: schedule.client,
          employee_id: schedule.employee,
          schedule_status: schedule.schedule_status as ScheduleStatus,
          services: {
            connect: schedule.services.map((service) => ({
              id: service,
            })),
          },
        },
        include: {
          services: true,
        },
      });

      return updatedSchedule as unknown as ScheduleOutputDTO;
    } catch (error) {
      if (error instanceof AppError || error instanceof Error) throw error;

      throw new AppError(ErrorMessages.MSGE05, 404);
    }
  }
}
