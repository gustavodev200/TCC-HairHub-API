import { z } from "zod";
import { AppError, ErrorMessages } from "../../errors";
import { AddressDTO } from "../dtos";

export class Address {
  constructor(
    public _cep: string,
    public _city: string,
    public _state: string,
    public _district: string,
    public _street: string,
    public _number?: string,
    private _id?: string
  ) {}

  get cep() {
    return this._cep;
  }

  get city() {
    return this._city;
  }

  get state() {
    return this._state;
  }

  get district() {
    return this._district;
  }

  get street() {
    return this._street;
  }

  get number() {
    return this._number!;
  }

  get id() {
    return this._id!;
  }

  set cep(cep: string) {
    this._cep = cep;
  }

  set city(city: string) {
    this._city = city;
  }

  set state(state: string) {
    this._state = state;
  }

  set district(district: string) {
    this._district = district;
  }

  set street(street: string) {
    this._street = street;
  }

  set number(number: string) {
    this._number = number;
  }

  set id(id: string) {
    this._id = id;
  }

  toJSON() {
    return {
      id: this.id,
      cep: this.cep,
      city: this.city,
      state: this.state,
      district: this.district,
      street: this.street,
      number: this.number,
    };
  }

  setAll(data: AddressDTO) {
    this.id = data.id;
    this.cep = data.cep;
    this.city = data.city;
    this.state = data.state;
    this.district = data.district;
    this.street = data.street;
    this.number = data.number as string;
  }

  validate() {
    const addressSchema = z
      .object({
        id: z
          .string({ required_error: ErrorMessages.MSGE01 })
          .uuid("id inválido"),
        cep: z
          .string({ required_error: ErrorMessages.MSGE01 })
          .min(8, ErrorMessages.MSGE08),
        city: z
          .string({ required_error: ErrorMessages.MSGE01 })
          .min(3, ErrorMessages.MSGE08),
        state: z
          .string({ required_error: ErrorMessages.MSGE01 })
          .max(2, ErrorMessages.MSGE09),
        district: z
          .string({ required_error: ErrorMessages.MSGE01 })
          .min(3, ErrorMessages.MSGE08),
        street: z
          .string({ required_error: ErrorMessages.MSGE01 })
          .min(3, ErrorMessages.MSGE08),
        number: z.string().optional(),
      })
      .partial({ id: true });

    try {
      addressSchema.parse(this);
    } catch (err) {
      throw new AppError(`Erro tente novamente mais tarde! - ${err}`);
    }
  }
}
