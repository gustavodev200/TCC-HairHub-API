import { z } from "zod";
import { AppError } from "../../errors/AppError";
import { GenericStatus } from "../dtos";
import { ErrorMessages } from "../../errors";

export class Service {
  constructor(
    private _name: string,
    private _image: string,
    private _time: number,
    private _price: number,
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

  get image() {
    return this._image;
  }

  get time() {
    return this._time;
  }

  get price() {
    return Number(this._price);
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

  set image(image: string) {
    this._image = image;
  }

  set time(time: number) {
    this._time = time;
  }

  set price(price: number) {
    this._price = price;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      image: this.image,
      time: this.time,
      price: this.price,
      status: this.status,
    };
  }

  validate() {
    const serviceSchema = z
      .object({
        id: z.string().uuid("id inválido"),
        status: z.enum([GenericStatus.active, GenericStatus.inactive], {
          errorMap: () => new AppError(ErrorMessages.MSGE06),
        }),
        name: z
          .string()
          .min(3, ErrorMessages.MSGE08)
          .max(120, ErrorMessages.MSGE09),
        price: z
          .number({
            required_error: ErrorMessages.MSGE01,
          })
          .min(1, ErrorMessages.MSGE10)
          .max(999, ErrorMessages.MSGE11),
      })
      .partial({ id: true, status: true });

    try {
      serviceSchema.parse(this);
    } catch (err) {
      throw new AppError(`Erro tente novamente mais tarde! - ${err}`);
    }
  }
}
