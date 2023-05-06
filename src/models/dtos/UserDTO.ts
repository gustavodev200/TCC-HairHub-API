import { GenericStatus } from "./Status";

export enum AssignmentType {
  ADMIN = "admin",
  EMPLOYEE = "employee",
  CLIENT = "client",
}

//All users interface
export interface UserInterface {
  id?: string;
  email: string;
  password: string;
}

// Employee Input DTO

export interface EmployeeInputDTO {
  name: string;
  cpf: string;
  dataNasc: Date;
  phone: string;
  email: string;
  password: string;
  role: AssignmentType;
  address: AddressInputDTO;
}

// Employee Output DTO
export interface EmployeeOutputDTO {
  id: string;
  name: string;
  image?: string;
  cpf: string;
  dataNasc: Date;
  phone: string;
  email: string;
  status: GenericStatus;
  role: AssignmentType;
  address: AddressOutputDTO;
  adress_id: string;
  created_at: Date;
  updated_at: Date;
}

// Address DTO

export interface AddressInputDTO {
  cep: string;
  city: string;
  state: string;
  district: string;
  street: string;
  number?: string;
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
}
