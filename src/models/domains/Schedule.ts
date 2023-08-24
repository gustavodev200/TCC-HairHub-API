import { z } from "zod";
import { AppError, ErrorMessages } from "../../errors";
import {
  ClientOutputDTO,
  EmployeeOutputDTO,
  IServiceOutputDTO,
  ScheduleStatus,
} from "../dtos";
import { Employee } from "@prisma/client";

export class Schedule {
  constructor(
    private _appointment_date: Date,
    private _start_time: string,
    private _end_time: string,
    private _services: string[],
    private _client: string,
    private _employee: string,
    private _estimated_time?: Date,
    private _schedule_status?: ScheduleStatus,
    private _id?: string
  ) {}

  get id() {
    return this._id!;
  }

  get status() {
    return this._schedule_status!;
  }

  get appointment_date() {
    return this._appointment_date;
  }

  get start_time() {
    return this._start_time;
  }

  get end_time() {
    return this._end_time;
  }

  get estimated_time() {
    return this._estimated_time!;
  }

  get services() {
    return this._services;
  }

  get client() {
    return this._client;
  }

  get employee() {
    return this._employee;
  }

  set id(id: string) {
    this._id = id;
  }

  set schedule_status(schedule_status: ScheduleStatus) {
    this._schedule_status = schedule_status;
  }

  set appointment_date(appointment_date: Date) {
    this._appointment_date = appointment_date;
  }

  set start_time(start_time: string) {
    this._start_time = start_time;
  }

  set end_time(end_time: string) {
    this._end_time = end_time;
  }

  set estimated_time(estimated_time: Date) {
    this._estimated_time = estimated_time;
  }

  set services(services: string[]) {
    this._services = services;
  }

  set client(client: string) {
    this._client = client;
  }

  set employee(employee: string) {
    this._employee = employee;
  }

  toJSON() {
    return {
      id: this.id,
      appointment_date: this.appointment_date,
      start_time: this.start_time,
      end_time: this.end_time,
      estimated_time: this.estimated_time,
      service_id: this.services,
      client: this.client,
      employee: this.employee,
      status: this.status,
    };
  }

  validate() {
    const scheduleSchema = z
      .object({
        id: z.string().uuid("id inválido"),
        status: z.enum(
          [
            ScheduleStatus.SCHEDULED,
            ScheduleStatus.CONFIRMED,
            ScheduleStatus.AWAITING_SERVICE,
            ScheduleStatus.FINISHED,
            ScheduleStatus.CANCELED,
          ],
          {
            errorMap: () => new AppError(ErrorMessages.MSGE06),
          }
        ),
        appointment_date: z.date(),
        start_time: z.string(),
        end_time: z.string(),
        estimated_time: z.date(),
        services: z.string(),
        client: z.string(),
        employee: z.string(),
      })
      .partial({ id: true, status: true });

    try {
      scheduleSchema.parse(this);
    } catch (err) {
      throw new AppError(`Erro tente novamente mais tarde! - ${err}`);
    }
  }
}
