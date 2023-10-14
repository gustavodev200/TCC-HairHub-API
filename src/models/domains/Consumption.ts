import { z } from "zod";
import { IServiceOutputDTO } from "../dtos";
import { ProductOutputDTO } from "../dtos/ProductDTO";
import { AppError, ErrorMessages } from "../../errors";

export class Consumption {
  constructor(
    private _total_amount: number,
    private _payment_type: string,
    private _products_consumption: string[],
    private _services_consumption?: string[],
    private _id?: string
  ) {}

  get total_amount() {
    return this._total_amount;
  }

  get payment_type() {
    return this._payment_type;
  }

  get products_consumption() {
    return this._products_consumption;
  }

  get services_consumption() {
    return this._services_consumption!;
  }

  get id() {
    return this._id!;
  }

  set id(id: string) {
    this._id = id;
  }

  set total_amount(total_amount: number) {
    this._total_amount = total_amount;
  }

  set payment_type(payment_type: string) {
    this._payment_type = payment_type;
  }

  set products_consumption(products_consumption: string[]) {
    this._products_consumption = products_consumption;
  }

  set services_consumption(services_consumption: string[]) {
    this._services_consumption = services_consumption;
  }
  toJSON() {
    return {
      id: this.id,
      total_amount: this.total_amount,
      payment_type: this.payment_type,
      products_consumption: this.products_consumption,
      services_consumption: this.services_consumption,
    };
  }

  validate() {
    const consumptionSchema = z
      .object({
        id: z.string().uuid("id inválido"),
        total_amount: z.number(),
        payment_type: z.string(),
      })
      .partial({ id: true, status: true });

    try {
      consumptionSchema.parse(this);
    } catch (err) {
      throw new AppError(`Erro tente novamente mais tarde! - ${err}`);
    }
  }
}
