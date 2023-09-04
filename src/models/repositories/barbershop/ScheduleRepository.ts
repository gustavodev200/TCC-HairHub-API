import { prisma } from "../..";
import { IRepository } from "../../../interfaces";
import { excludeFields } from "../../../utils";
import { Schedule } from "../../domains";
import {
  ScheduleInputDTO,
  ScheduleOutputDTO,
  ScheduleStatus,
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

  async update(id: string, data: unknown): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
}
