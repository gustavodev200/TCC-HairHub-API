import { prisma } from "../..";
import { AppError, ErrorMessages } from "../../../errors";
import { IRepository } from "../../../interfaces";
import { Schedule } from "../../domains";
import {
  EmployeeOutputDTO,
  ScheduleInputDTO,
  ScheduleOutputDTO,
} from "../../dtos";

export class ScheduleRepository implements IRepository {
  async create({
    appointment_date,
    start_time,
    services,
    end_time,
    client,
    employee,
  }: ScheduleInputDTO): Promise<ScheduleOutputDTO> {
    // Validar se a data selecionada tem algum barbeiro disponível naquele horário
    const isEmployeeAvailable = await prisma.scheduling.findFirst({
      where: {
        appointment_date: appointment_date,
        employee_id: employee.id,
      },
    });

    if (isEmployeeAvailable) {
      throw new AppError(
        "O barbeiro selecionado não está disponível na data e horário especificados."
      );
    }

    // Validar se o horário informado está dentro do turno do barbeiro
    const employeeShift = await prisma.shift.findFirst({
      where: {
        employee_id: employee.id,
        start_time: { $lte: new Date(start_time) }, // Verifica se o início do turno é menor ou igual ao horário informado
        end_time: { $gte: new Date(end_time) }, // Verifica se o término do turno é maior ou igual ao horário informado
      },
    });

    if (!employeeShift) {
      throw new AppError(
        "O horário informado não está dentro do turno do barbeiro selecionado."
      );
    }

    const schedule = new Schedule(
      appointment_date,
      start_time,
      end_time,
      services,
      client,
      employee
    );

    schedule.validate();

    const createdSchedule = await prisma.scheduling.create({
      data: {
        appointment_date: schedule.appointment_date,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        client: {
          connect: {
            // id: schedule.client.id,
          },
        },
        employee: {
          connect: {
            // id: schedule.employee.id,
          },
        },
        services: {
          // connect: schedule.services,
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
