import { GenericStatus } from "./Status";

export enum AssignmentType {
  ADMIN = "admin",
  EMPLOYEE = "employee",
  CLIENT = "client",
}

// Employee Input DTO

export interface EmployeeInputDTO {
  name: string;
  cpf: string;
  dataNasc: Date;
  phone: string;
  email: string;
  password: string;
  roles: RoleInputDTO[];
  address: AddressInputDTO[];
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
  password: string;
  status: GenericStatus;
  roles: RoleOutputDTO[];
  address: AddressOutputDTO[];
  created_at: Date;
  updated_at: Date;
}

// Address DTO

export interface AddressInputDTO {
  cep: string;
  county: string;
  fu: string;
  district: string;
  street: string;
  number?: string;
}
export interface AddressOutputDTO {
  id: string;
  cep: string;
  county: string;
  fu: string;
  district: string;
  street: string;
  number?: string;
  employeeId: string;
  employee: EmployeeOutputDTO;
  created_at: Date;
  updated_at: Date;
}

// Role DTO

export interface RoleInputDTO {
  type: AssignmentType;
}
export interface RoleOutputDTO {
  id: string;
  type: AssignmentType;
  employee: EmployeeOutputDTO;
  employeeId: string;
  created_at: Date;
  updated_at: Date;
}
