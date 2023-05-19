import { z } from "zod";
import { GenericStatus } from "../dtos";
import { AppError, ErrorMessages } from "../../errors";

export class Product {
  constructor(
    private _name: string,
    private _price: number,
    private _description: string,
    private _amount: number,
    private _category_id: string,
    private _id?: string,
    private _status?: GenericStatus
  ) {}

  get name() {
    return this._name;
  }

  get price() {
    return this._price;
  }

  get description() {
    return this._description;
  }

  get amount() {
    return this._amount;
  }

  get id() {
    return this._id!;
  }

  get status() {
    return this._status!;
  }

  get category_id() {
    return this._category_id;
  }

  set name(name: string) {
    this._name = name;
  }

  set price(price: number) {
    this._price = price;
  }

  set description(description: string) {
    this._description = description;
  }

  set amount(amount: number) {
    this._amount = amount;
  }

  set id(id: string) {
    this._id = id;
  }

  set status(status: GenericStatus) {
    this._status = status;
  }

  set category_id(category_id: string) {
    this._category_id = category_id;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      price: this.price.toFixed(2),
      description: this.description,
      amount: this.amount,
      status: this.status,
      category_id: this.category_id,
    };
  }

  validate() {
    const productSchema = z
      .object({
        id: z.string().uuid("id inválido"),
        status: z.enum([GenericStatus.active, GenericStatus.inactive], {
          errorMap: () => new AppError(ErrorMessages.MSGE06),
        }),
        name: z
          .string()
          .min(2, ErrorMessages.MSGE08)
          .max(120, ErrorMessages.MSGE09),
        price: z.number().positive().min(0, ErrorMessages.MSGE06),
        description: z
          .string()
          .min(3, ErrorMessages.MSGE08)
          .max(500, ErrorMessages.MSGE09),
        amount: z.number().positive().min(0, ErrorMessages.MSGE06),
      })
      .partial({ id: true, status: true });

    try {
      productSchema.parse(this);
    } catch (err) {
      throw new AppError(`Erro tente novamente mais tarde! - ${err}`);
    }
  }
}
