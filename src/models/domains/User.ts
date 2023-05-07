import { AddressDTO, AddressInputDTO, GenericStatus } from "../dtos";
import { AssignmentType } from "@prisma/client";
export class User {
  constructor(
    private _name: string,
    private _cpf: string,
    private _dataNasc: string,
    private _phone: string,
    private _role: AssignmentType,
    private _address: AddressInputDTO | AddressDTO,
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

  set dataNasc(dataNasc: string) {
    this._dataNasc = dataNasc;
  }

  set phone(phone: string) {
    this._phone = phone;
  }

  set role(role: AssignmentType) {
    this._role = role;
  }

  set address(address: AddressInputDTO | AddressDTO) {
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
}
