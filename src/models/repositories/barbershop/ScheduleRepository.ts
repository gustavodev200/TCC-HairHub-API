import { prisma } from "../..";
import { AppError, ErrorMessages } from "../../../errors";
import { FindAllArgsScheduling, IRepository } from "../../../interfaces";
import { excludeFields } from "../../../utils";
import { Schedule } from "../../domains";
import {
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
    const availableShift = await prisma.shift.findMany({
      where: {
        employee_id: employee,
        AND: [
          {
            start_time: {
              lte: start_date_time,
            },
            end_time: {
              gte: end_date_time,
            },
          },

          {
            start_time: {
              lte: end_date_time,
            },
            end_time: {
              gte: start_date_time,
            },
          },
        ],
        available_days: {
          some: {
            day: dayjs(start_date_time).get("day"),
          },
        },
      },
    });

    if (availableShift.length) {
      const timeScheduled = await prisma.scheduling.findMany({
        where: {
          employee_id: employee,
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
            {
              start_date_time: {
                gte: start_date_time,
              },
              end_date_time: {
                lte: end_date_time,
              },
            },
          ],
        },
      });

      if (timeScheduled.length) {
        return "Barbeiro não disponivel";
      }

      const schedule = new Schedule(
        start_date_time,
        end_date_time,
        services,
        client,
        employee
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

  async update(id: string, data: SchedulesUpdateParamsDTO) {
    try {
      const scheduleToUpdate = await prisma.scheduling.findUniqueOrThrow({
        where: { id },
        include: {
          services: true,
        },
      });

      if (!scheduleToUpdate) {
        throw new AppError("Agendamento não encontrado");
      }

      const availableShiftBarber = await prisma.shift.findMany({
        where: {
          employee_id: data.employee,
          AND: [
            {
              start_time: {
                lte: data.start_date_time,
              },
              end_time: {
                gte: data.end_date_time,
              },
            },

            {
              start_time: {
                lte: data.end_date_time,
              },
              end_time: {
                gte: data.start_date_time,
              },
            },
          ],
          available_days: {
            some: {
              day: dayjs(data.start_date_time).get("day"),
            },
          },
        },
      });

      if (availableShiftBarber.length) {
        const newTimeScheduled = await prisma.scheduling.findMany({
          where: {
            employee_id: data.employee,
            id: { not: scheduleToUpdate.id },
            OR: [
              {
                start_date_time: {
                  lte: data.start_date_time,
                },
                end_date_time: {
                  gte: data.start_date_time,
                },
              },
              {
                end_date_time: {
                  gte: data.end_date_time,
                },
                start_date_time: {
                  lte: data.end_date_time,
                },
              },
              {
                start_date_time: {
                  gte: data.start_date_time,
                },
                end_date_time: {
                  lte: data.end_date_time,
                },
              },
            ],
          },
        });

        if (newTimeScheduled.length) {
          throw new AppError("Barbeiro não disponivel");
        }

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
              set: schedule.services.map((service) => ({
                id: service,
              })),
            },
          },
          include: {
            services: true,
          },
        });

        return updatedSchedule as unknown as ScheduleOutputDTO;
      }

      return "Barbeiro não disponivel";
    } catch (error) {
      if (error instanceof AppError || error instanceof Error) throw error;

      throw new AppError(ErrorMessages.MSGE05, 404);
    }
  }

  public async findAll(args?: FindAllArgsScheduling) {
    const where = {
      OR: args?.searchTerm
        ? [
            {
              name: {
                contains: args?.searchTerm,
              },
            },
          ]
        : undefined,
      status: {
        equals: args?.filterByStatus,
      },
    };

    const totalItems = await prisma.scheduling.count();

    const data = await prisma.scheduling.findMany({
      skip: args?.skip,
      take: args?.take,
      // where,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        services: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        start_date_time: "asc",
      },
    });

    return {
      data,
      totalItems,
    };
  }
}
