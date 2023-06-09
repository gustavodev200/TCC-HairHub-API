import { AddressDTO, AddressInputDTO } from "./AddressDTO";
import { ShiftInputDTO, ShiftOutputDTO } from "./ShiftDTO";
import { GenericStatus } from "./Status";

export enum AssignmentType {
  ADMIN = "admin",
  EMPLOYEE = "employee",
  CLIENT = "client",
  ATTENDANT = "attendant",
}

//All users interface
export interface UserInterface {
  id?: string;
  email: string;
  password: string;
}

export interface IUpdateEmployeeParams {
  id?: string;
  name?: string;
  cpf?: string;
  dataNasc?: string;
  phone?: string;
  email?: string;
  role?: AssignmentType;
  address?: AddressDTO;
  password?: string;
  status?: GenericStatus;
  shifts?: ShiftOutputDTO[];
}

// Employee Input DTO

export interface EmployeeInputDTO {
  cep: string;
  name: string;
  cpf: string;
  dataNasc: string;
  phone: string;
  email: string;
  role: AssignmentType;
  address: AddressInputDTO;
  shifts: ShiftInputDTO[];
}

// Employee Output DTO
export interface EmployeeOutputDTO {
  id: string;
  name: string;
  image?: string;
  cpf: string;
  dataNasc: string;
  phone: string;
  email: string;
  status: GenericStatus;
  role: AssignmentType;
  address: AddressOutputDTO;
  adress_id: string;
  created_at: Date;
  updated_at: Date;
}
export interface AddressOutputDTO {
  id: string;
  cep: string;
  city: string;
  state: string;
  district: string;
  street: string;
  number?: string;
  employee: EmployeeOutputDTO;
  created_at: Date;
  updated_at: Date;
}
