import { z } from "zod";
import {
  AddressDTO,
  AddressInputDTO,
  AssignmentType,
  GenericStatus,
} from "../dtos";
import { User } from "./User";
import { AppError, ErrorMessages } from "../../errors";
import { validateCPF } from "../../utils";

export class Client extends User {
  constructor(
    _name: string,
    _cpf: string,
    _dataNasc: string,
    _phone: string,
    _role: AssignmentType,
    _address: AddressInputDTO | AddressDTO,
    _email: string,
    _password: string,
    _image?: string,
    _id?: string,
    _status?: GenericStatus
  ) {
    super(
      _name,
      _cpf,
      _dataNasc,
      _phone,
      _role,
      _address,
      _email,
      _password,
      _image,
      _id,
      _status
    );
  }

  validate() {
    const employeeSchema = z
      .object({
        id: z.string().uuid("id inválido"),
        status: z.enum([GenericStatus.active, GenericStatus.inactive], {
          errorMap: () => new AppError(ErrorMessages.MSGE06),
        }),
        name: z
          .string({ required_error: ErrorMessages.MSGE01 })
          .min(3, ErrorMessages.MSGE08)
          .max(120, ErrorMessages.MSGE09),
        cpf: z
          .string({ required_error: ErrorMessages.MSGE01 })
          .min(11, ErrorMessages.MSGE08)
          .max(11, ErrorMessages.MSGE09)
          .refine((cpf) => validateCPF(cpf), ErrorMessages.MSGE14),
        dataNasc: z.string({ required_error: ErrorMessages.MSGE01 }),
        phone: z
          .string({ required_error: ErrorMessages.MSGE01 })
          .min(11, ErrorMessages.MSGE08)
          .max(11, ErrorMessages.MSGE09),
        email: z
          .string({ required_error: ErrorMessages.MSGE01 })
          .email(ErrorMessages.MSGE06),
        password: z
          .string({ required_error: ErrorMessages.MSGE01 })
          .min(8, ErrorMessages.MSGE08),
      })
      .partial({ id: true, status: true });

    try {
      employeeSchema.parse(this);
    } catch (err) {
      throw new AppError(`Erro tente novamente mais tarde! - ${err}`);
    }
  }
}
