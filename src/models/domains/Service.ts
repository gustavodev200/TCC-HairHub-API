import { z } from "zod";
import { AppError } from "../../errors/AppError";
import { GenericStatus } from "../dtos";

export class Service {
  constructor(
    private _name: string,
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

  get price() {
    return this._price;
  }

  get time() {
    return this._time;
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

  set price(price: number) {
    this._price = price;
  }

  set time(time: number) {
    this._time = time;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
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
          errorMap: () =>
            new AppError(`'${this._status}' não é um status válido`),
        }),
        name: z
          .string()
          .min(3, "Nome deve conter pelo menos 3 caracteres")
          .max(120, "Nome não deve ser maior que 120 caracteres"),
        price: z
          .number()
          .min(1, "Preço do serviço não deve ser menor que 1")
          .max(999, "Preço do serviço não deve ser maior que 999"),
      })
      .partial({ id: true, status: true });

    try {
      serviceSchema.parse(this);
    } catch (err) {
      throw new AppError("Erro tente novamente mais tarde!");
    }
  }
}
