import { z } from "zod";
import { AppError } from "../../errors";
import { ProductsConsumedDTO } from "../dtos/ConsumptionDTO";

export class Consumption {
  constructor(
    private _total_amount: number,
    private _payment_type: string,
    private _products_consumption: ProductsConsumedDTO[],
    private _services_consumption: string[],
    private _scheduling_id: string,
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

  get scheduling_id() {
    return this._scheduling_id;
  }

  set id(id: string) {
    this._id = id;
  }

  set total_amount(total_amount: number) {
    this._total_amount = total_amount;
  }

  set scheduling_id(scheduling_id: string) {
    this._scheduling_id = scheduling_id;
  }

  set payment_type(payment_type: string) {
    this._payment_type = payment_type;
  }

  set products_consumption(products_consumption: ProductsConsumedDTO[]) {
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
      scheduling_id: this.scheduling_id,
    };
  }

  validate() {
    const consumptionSchema = z
      .object({
        id: z.string().uuid("id inválido"),
        total_amount: z.number(),
        payment_type: z.string(),
      })
      .partial({ id: true, status: true, payment_type: true });

    try {
      consumptionSchema.parse(this);
    } catch (err) {
      throw new AppError(`Erro tente novamente mais tarde! - ${err}`);
    }
  }
}
