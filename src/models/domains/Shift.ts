import { z } from "zod";
import { AppError, ErrorMessages } from "../../errors";

export class Shift {
  constructor(
    private _start_time: string,
    private _end_time: string,
    private _available_days: number[],
    private _id?: string
  ) {}

  get start_time() {
    return this._start_time;
  }

  get end_time() {
    return this._end_time;
  }

  get available_days() {
    return this._available_days;
  }

  get id() {
    return this._id!;
  }

  set start_time(start_time: string) {
    this._start_time = start_time;
  }

  set end_time(end_time: string) {
    this._end_time = end_time;
  }

  set available_days(available_days: number[]) {
    this._available_days = available_days;
  }

  toJSON() {
    return {
      start_time: this.start_time,
      end_time: this.end_time,
      available_days: this.available_days,
      id: this.id,
    };
  }

  validate() {
    const officeHourSchema = z
      .object({
        id: z
          .string({ required_error: ErrorMessages.MSGE01 })
          .uuid("id inválido"),
        start_time: z
          .string({ required_error: ErrorMessages.MSGE01 })
          .datetime({ offset: true }),
        end_time: z
          .string({ required_error: ErrorMessages.MSGE01 })
          .datetime({ offset: true }),
      })
      .partial({ id: true });

    try {
      officeHourSchema.parse(this);
    } catch (err) {
      throw new AppError(`Erro tente novamente mais tarde! - ${err}`);
    }
  }
}
