import { z } from "zod";
import { GenericStatus } from "../dtos";
import { AppError, ErrorMessages } from "../../errors";

export class Category {
  constructor(
    private _name: string,
    private _id?: string,
    private _status?: GenericStatus
  ) {}

  get id() {
    return this._id!;
  }

  get status() {
    return this._status!;
  }

  get name() {
    return this._name;
  }

  set id(id: string) {
    this._id = id;
  }

  set status(status: GenericStatus) {
    this._status = status;
  }

  set name(name: string) {
    this._name = name;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
    };
  }

  validate() {
    const categorySchema = z
      .object({
        id: z.string().uuid("id inválido"),
        status: z.enum([GenericStatus.active, GenericStatus.inactive], {
          errorMap: () => new AppError(ErrorMessages.MSGE06),
        }),
        name: z
          .string()
          .min(3, ErrorMessages.MSGE08)
          .max(120, ErrorMessages.MSGE09),
      })
      .partial({ id: true, status: true });

    try {
      categorySchema.parse(this);
    } catch (err) {
      throw new AppError(`Erro tente novamente mais tarde! - ${err}`);
    }
  }
}
