import { z } from "zod";
import { AddressInputDTO, GenericStatus } from "../dtos";
import { AppError, ErrorMessages } from "../../errors";
import { AssignmentType } from "@prisma/client";

export class User {
  constructor(
    private _name: string,
    private _cpf: string,
    private _dataNasc: Date,
    private _phone: string,
    private _role: AssignmentType,
    private _address: AddressInputDTO,
    private _email: string,
    private _password: string,
    private _id?: string,
    private _status?: GenericStatus,
    private _image?: string
  ) {}

  get name() {
    return this._name;
  }
  get image() {
    return this._image!;
  }

  get cpf() {
    return this._cpf;
  }
  get dataNasc() {
    return this._dataNasc;
  }

  get phone() {
    return this._phone;
  }
  get role() {
    return this._role;
  }

  get address() {
    return this._address;
  }

  get email() {
    return this._email;
  }

  get password() {
    return this._password;
  }

  get id() {
    return this._id!;
  }
  get status() {
    return this._status!;
  }

  set name(name: string) {
    this._name = name;
  }

  set image(image: string) {
    this._image = image;
  }

  set cpf(cpf: string) {
    this._cpf = cpf;
  }

  set dataNasc(dataNasc: Date) {
    this._dataNasc = dataNasc;
  }

  set phone(phone: string) {
    this._phone = phone;
  }

  set role(role: AssignmentType) {
    this._role = role;
  }

  set address(address: AddressInputDTO) {
    this._address = address;
  }

  set email(email: string) {
    this._email = email;
  }

  set password(password: string) {
    this._password = password;
  }

  set id(id: string) {
    this._id = id;
  }

  set status(status: GenericStatus) {
    this._status = status;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      image: this.image,
      cpf: this.cpf,
      dataNasc: this.dataNasc,
      phone: this.phone,
      email: this.email,
      password: this.password,
      status: this.status,
      roles: this.role,
      address: this.address,
    };
  }

  validate() {
    const userSchema = z
      .object({
        id: z.string().uuid("id inválido"),
        status: z.enum([GenericStatus.active, GenericStatus.inactive], {
          errorMap: () => new AppError(ErrorMessages.MSGE06),
        }),
        name: z
          .string()
          .min(3, ErrorMessages.MSGE08)
          .max(120, ErrorMessages.MSGE09),
        cpf: z
          .string()
          .regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)
          .refine((value) => {
            const cpf = value.replace(/[^\d]+/g, "");
            let sum = 0;
            let remainder;

            if (
              cpf.length != 11 ||
              cpf == "00000000000" ||
              cpf == "11111111111" ||
              cpf == "22222222222" ||
              cpf == "33333333333" ||
              cpf == "44444444444" ||
              cpf == "55555555555" ||
              cpf == "66666666666" ||
              cpf == "77777777777" ||
              cpf == "88888888888" ||
              cpf == "99999999999"
            ) {
              return false;
            }

            for (let i = 1; i <= 9; i++) {
              sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
            }

            remainder = (sum * 10) % 11;

            if (remainder == 10 || remainder == 11) {
              remainder = 0;
            }

            if (remainder != parseInt(cpf.substring(9, 10))) {
              throw new AppError(ErrorMessages.MSGE14);
            }

            sum = 0;

            for (let i = 1; i <= 10; i++) {
              sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
            }

            remainder = (sum * 10) % 11;

            if (remainder == 10 || remainder == 11) {
              remainder = 0;
            }

            if (remainder != parseInt(cpf.substring(10, 11))) {
              throw new AppError(ErrorMessages.MSGE14);
            }

            return cpf;
          }, new AppError(ErrorMessages.MSGE14)),

        // dataNasc: z.date(),
        phone: z
          .string()
          .regex(/^\(\d{2}\)\s\d{5}\-\d{4}$/)
          .transform((value) => {
            if (value) {
              return value.replace(/\D/g, "");
            }

            return value;
          }),
        email: z.string().email(),
      })
      .partial({ id: true, status: true });

    try {
      userSchema.parse(this);
    } catch (err) {
      throw new AppError(`Erro tente novamente mais tarde! - ${err}`);
    }
  }
}
