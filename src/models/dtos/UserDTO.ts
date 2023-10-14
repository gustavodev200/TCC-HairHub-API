import { AddressDTO, AddressInputDTO } from "./AddressDTO";
import { ShiftInputDTO, ShiftOutputDTO } from "./ShiftDTO";
import { GenericStatus } from "./Status";

export enum AssignmentType {
  ADMIN = "admin",
  EMPLOYEE = "employee",
  CLIENT = "client",
  ATTENDANT = "attendant",
}

export interface UserAuth {
  id: string;
  email: string;
  name: string;
  password: string;
  role: AssignmentType;
}

//All users interface
export interface UserInterface {
  id?: string;
  email: string;
  password: string;
}

export interface IUpdateEmployeeParams {
  id?: string;
  image?: string;
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
  image?: string;
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
  shifts: ShiftInputDTO[];
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
