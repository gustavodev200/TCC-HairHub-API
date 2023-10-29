import { prismaClient } from "../..";
import { AppError, ErrorMessages } from "../../../errors";
import { FindAllArgsScheduling, IRepository } from "../../../interfaces";
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
    const availableShift = await prismaClient.shift.findMany({
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
      const timeScheduled = await prismaClient.scheduling.findMany({
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
        throw new AppError(ErrorMessages.MSGE020);
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

      schedule.validate();

      const scheduleCreated = await prismaClient.scheduling.create({
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
          employee: true,
          client: true,
          consumption: {
            include: {
              products_consumption: {
                include: {
                  product: true,
                },
              },
              services_consumption: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
      });

      return scheduleCreated as unknown as ScheduleOutputDTO;
    }

    throw new AppError(ErrorMessages.MSGE020);
  }

  async update(id: string, data: SchedulesUpdateParamsDTO) {
    try {
      const scheduleToUpdate = await prismaClient.scheduling.findUniqueOrThrow({
        where: { id },
        include: {
          services: true,
        },
      });

      if (!scheduleToUpdate) {
        throw new AppError("Agendamento não encontrado");
      }

      const availableShiftBarber = await prismaClient.shift.findMany({
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
        const newTimeScheduled = await prismaClient.scheduling.findMany({
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
          throw new AppError(ErrorMessages.MSGE020);
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

        if (data.end_date_time !== undefined)
          schedule.end_date_time = data.end_date_time;
        if (data.start_date_time !== undefined)
          schedule.start_date_time = data.start_date_time;
        if (data.services !== undefined) schedule.services = data.services;
        if (data.schedule_status !== undefined)
          schedule.schedule_status = data.schedule_status;

        schedule.validate();

        const updatedSchedule = await prismaClient.scheduling.update({
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
            confirmed_status_date_time:
              data.schedule_status === "confirmed"
                ? new Date().toISOString()
                : undefined,
            awaiting_status_date_time:
              data.schedule_status === "awaiting_service"
                ? new Date().toISOString()
                : undefined,
            attend_status_date_time:
              data.schedule_status === "attend"
                ? new Date().toISOString()
                : undefined,
            finished_status_date_time:
              data.schedule_status === "finished"
                ? new Date().toISOString()
                : undefined,
          },
          include: {
            services: true,
            employee: true,
            client: true,
            consumption: {
              include: {
                products_consumption: {
                  include: {
                    product: true,
                  },
                },
                services_consumption: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                  },
                },
              },
            },
          },
        });

        return updatedSchedule as unknown as ScheduleOutputDTO;
      }

      throw new AppError(ErrorMessages.MSGE020);
    } catch (error) {
      if (error instanceof AppError || error instanceof Error) throw error;

      throw new AppError(ErrorMessages.MSGE05, 404);
    }
  }

  public async findById(id: string) {
    try {
      const schedule = await prismaClient.scheduling.findUniqueOrThrow({
        where: { id },
        include: {
          services: true,
          consumption: {
            include: {
              products_consumption: {
                include: {
                  product: true,
                },
              },
              services_consumption: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
      });

      return schedule as unknown as ScheduleOutputDTO;
    } catch (error) {
      if (error instanceof AppError || error instanceof Error) throw error;
    }
  }

  public async findAll(args?: FindAllArgsScheduling) {
    const where = {
      start_date_time: args?.filterByDate
        ? {
            gte: dayjs(args?.filterByDate).startOf("day").toISOString(),
            lte: dayjs(args?.filterByDate).endOf("day").toISOString(),
          }
        : undefined,

      employee_id: {
        equals: args?.filterByEmployee,
      },

      schedule_status: {
        equals: args?.filterByStatus,
      },
    };

    const totalItems = await prismaClient.scheduling.count({ where });

    const data = await prismaClient.scheduling.findMany({
      skip: args?.skip,
      take: args?.take,
      where,
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
            price: true,
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
