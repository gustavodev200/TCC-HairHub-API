import { z } from "zod";
import { AppError, ErrorMessages } from "../../errors";

export class OfficeHour {
  constructor(
    private _start_time: Date,
    private _end_time: Date,
    private _days_available: string[],
    private _id?: string
  ) {}

  get start_time() {
    return this._start_time;
  }

  get end_time() {
    return this._end_time;
  }

  get days_available() {
    return this._days_available;
  }

  get id() {
    return this._id!;
  }

  set start_time(start_time: Date) {
    this._start_time = start_time;
  }

  set end_time(end_time: Date) {
    this._end_time = end_time;
  }

  set days_available(days_available: string[]) {
    this._days_available = days_available;
  }

  toJSON() {
    return {
      start_time: this.start_time,
      end_time: this.end_time,
      days_available: this.days_available,
      id: this.id,
    };
  }

  validate() {
    const officeHourSchema = z
      .object({
        id: z
          .string({ required_error: ErrorMessages.MSGE01 })
          .uuid("id inválido"),
        start_time: z.date(),
        end_time: z.date(),
        days_available: z.array(z.string()),
      })
      .partial({ id: true });

    try {
      officeHourSchema.parse(this);
    } catch (err) {
      throw new AppError(`Erro tente novamente mais tarde! - ${err}`);
    }
  }
}
