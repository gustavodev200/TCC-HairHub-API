import { z } from "zod";
import { AppError, ErrorMessages } from "../../errors";
import { ScheduleStatus } from "../dtos";

export class Schedule {
  constructor(
    private _start_date_time: string,
    private _end_date_time: string,
    private _services: string[],
    private _client: string,
    private _employee: string,
    private _schedule_status?: ScheduleStatus,
    private _id?: string,
    private _confirmed_status_date_time?: Date,
    private _awaiting_status_date_time?: Date,
    private _attend_status_date_time?: Date,
    private _finished_status_date_time?: Date
  ) {}

  get id() {
    return this._id!;
  }

  get schedule_status() {
    return this._schedule_status!;
  }

  get start_date_time() {
    return this._start_date_time;
  }

  get end_date_time() {
    return this._end_date_time;
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

  get confirmed_status_date_time() {
    return this._confirmed_status_date_time as Date;
  }

  get awaiting_status_date_time() {
    return this._awaiting_status_date_time as Date;
  }

  get attend_status_date_time() {
    return this._attend_status_date_time as Date;
  }

  get finished_status_date_time() {
    return this._finished_status_date_time as Date;
  }

  set id(id: string) {
    this._id = id;
  }

  set schedule_status(schedule_status: ScheduleStatus) {
    this._schedule_status = schedule_status;
  }

  set start_date_time(start_date_time: string) {
    this._start_date_time = start_date_time;
  }

  set end_date_time(end_date_time: string) {
    this._end_date_time = end_date_time;
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

  set confirmed_status_date_time(confirmed_status_date_time: Date) {
    this._confirmed_status_date_time = confirmed_status_date_time;
  }

  set awaiting_status_date_time(awaiting_status_date_time: Date) {
    this._awaiting_status_date_time = awaiting_status_date_time;
  }

  set attend_status_date_time(attend_status_date_time: Date) {
    this._attend_status_date_time = attend_status_date_time;
  }

  set finished_status_date_time(finished_status_date_time: Date) {
    this._finished_status_date_time = finished_status_date_time;
  }

  toJSON() {
    return {
      id: this.id,
      start_time: this.start_date_time,
      end_time: this.end_date_time,
      services: this.services,
      client: this.client,
      employee: this.employee,
      schedule_status: this.schedule_status,
      confirmed_status_date_time: this.confirmed_status_date_time,
      awaiting_status_date_time: this.awaiting_status_date_time,
      attend_status_date_time: this.attend_status_date_time,
      finished_status_date_time: this.finished_status_date_time,
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
        start_date_time: z.string(),
        end_date_time: z.string(),
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
